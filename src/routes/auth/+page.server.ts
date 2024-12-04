import { fail, redirect } from '@sveltejs/kit'
import { Argon2id } from 'oslo/password'
import type { RequestEvent } from './$types'
import type { User } from '@prisma/client'
import { z } from 'fuma'
import { formAction } from 'fuma/server'

import { lucia } from '$lib/server/auth.js'
import { prisma } from '$lib/server'

const modelLogin = {
    username: z.string(),
    password: z.string(),
}

const modelRegister = {
    email: z.string().toLowerCase().email(),
    username: z.string().min(3),
    password: z.string().min(8),
}

export const actions = {
    register: formAction(
        modelRegister,
        async ({ data, event }) => {
            data.password = await new Argon2id().hash(data.password)
            const user = await prisma.user.create({ data })
            await createSession(user, event)
        },
        { redirectTo: '/' }
    ),
    login: formAction(
        modelLogin,
        async ({ event, data }) => {
            const user = await prisma.user.findFirst({
                where: {
                    OR: [{ email: data.username }, { username: data.username }],
                },
            })
            if (!user) throw new Error('Incorrect username or password')
            if (!user.password)
                throw new Error('Login with password is not enable')

            const validPassword = await new Argon2id().verify(
                user.password,
                data.password
            )
            if (!validPassword) throw Error('Incorrect username or password')

            await createSession(user, event)
        },
        { redirectTo: '/' }
    ),
    logout: async ({ locals: { session }, cookies }) => {
        if (!session) return fail(401)
        await lucia.invalidateSession(session.id)
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies.set(sessionCookie.name, sessionCookie.value, {
            path: '.',
            ...sessionCookie.attributes,
        })
        redirect(302, '/auth')
    },
}

async function createSession(user: User, event: RequestEvent) {
    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    event.cookies.set(sessionCookie.name, sessionCookie.value, {
        path: '.',
        ...sessionCookie.attributes,
    })
}
