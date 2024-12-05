import { fortyTwoAuth } from '$lib/server/auth'
import { generateState } from 'arctic'

export const GET = async ({ cookies }) => {
    const state = generateState()
    const scopes = ['public']
    const url = fortyTwoAuth.createAuthorizationURL(state, scopes)

    cookies.set('42_oauth_state', state, {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
    })

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    })
}
