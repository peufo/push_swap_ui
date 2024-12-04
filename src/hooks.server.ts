import type { Handle, RequestEvent } from '@sveltejs/kit'
import type { Cookie } from 'lucia'
import { lucia } from '$lib/server/auth.js'

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(lucia.sessionCookieName)
	if (!sessionId) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}
	const { session, user } = await lucia.validateSession(sessionId)
	if (session && session.fresh) setSessionCookie(lucia.createSessionCookie(session.id), event)
	if (!session) setSessionCookie(lucia.createBlankSessionCookie(), event)

	event.locals.user = user
	event.locals.session = session
	return resolve(event)
}

function setSessionCookie(cookie: Cookie, event: RequestEvent) {
	event.cookies.set(cookie.name, cookie.value, {
		path: '.',
		...cookie.attributes
	})
}
