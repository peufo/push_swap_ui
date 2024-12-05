import type { Handle } from '@sveltejs/kit'
import {
    deleteSessionTokenCookie,
    setSessionTokenCookie,
    validateSessionToken,
} from '$lib/server'

export const handle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session') ?? null
    if (!token) {
        event.locals.user = null
        event.locals.session = null
        return resolve(event)
    }
    const { session, user } = await validateSessionToken(token)
    if (!session) {
        event.locals.user = null
        event.locals.session = null
        deleteSessionTokenCookie(event)
        return resolve(event)
    }
    setSessionTokenCookie(event, token, session.expiresAt)
    event.locals.user = user
    event.locals.session = session
    return resolve(event)
}
