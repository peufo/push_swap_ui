import { fail, redirect } from '@sveltejs/kit'
import { deleteSessionTokenCookie, invalidateSession } from '$lib/server'

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
