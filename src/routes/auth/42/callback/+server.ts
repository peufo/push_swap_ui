import { OAuth2Tokens } from 'arctic'
import {
    api42,
    createSession,
    fortyTwoAuth,
    generateSessionToken,
    prisma,
    setSessionTokenCookie,
} from '$lib/server'
import type { RequestEvent } from './$types.js'
import type { User } from '@prisma/client'

export const GET = async (event) => {
    const { url, cookies } = event
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')
    const storedState = cookies.get('42_oauth_state') ?? null

    if (code === null || storedState === null || state !== storedState)
        return new Response(null, { status: 400 })

    if (state !== storedState) return new Response(null, { status: 400 })

    let tokens: OAuth2Tokens
    try {
        tokens = await fortyTwoAuth.validateAuthorizationCode(code)
    } catch (e) {
        return new Response(null, { status: 400 })
    }
    const user42 = await api42.me(tokens)
    let user = await prisma.user.findUnique({ where: { email: user42.email } })
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: user42.email,
                url: user42.url,
                login: user42.login,
                displayname: user42.displayname,
                campus: user42.campus[0]?.name,
                imageMicro: user42.image.versions.micro,
                imageSmall: user42.image.versions.small,
                imageMedium: user42.image.versions.medium,
                imageLarge: user42.image.versions.large,
            },
        })
    }
    return login(event, user)
}

async function login(event: RequestEvent, user: User) {
    const sessionToken = generateSessionToken()
    const session = await createSession(sessionToken, user.id)
    setSessionTokenCookie(event, sessionToken, session.expiresAt)
    return new Response(null, {
        status: 302,
        headers: {
            Location: '/me',
        },
    })
}
