import { fail, redirect } from '@sveltejs/kit'
import {
    deleteSessionTokenCookie,
    invalidateSession,
    prisma,
} from '$lib/server'

export const load = async (event) => {
    if (!event.locals.user) return redirect(302, '/')
    return {
        user: event.locals.user,
        algos: await prisma.algorithm.findMany({
            where: { authorId: event.locals.user.id },
            include: { author: true },
        }),
    }
}

export const actions = {
    logout: async (event) => {
        if (event.locals.session === null) {
            return fail(401)
        }
        await invalidateSession(event.locals.session.id)
        deleteSessionTokenCookie(event)
        event.locals.session = null
        event.locals.user = null
        return redirect(302, '/')
    },
}
