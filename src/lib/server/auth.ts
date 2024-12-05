import { FortyTwo } from 'arctic'
import { dev } from '$app/environment'

import { FORTYTWO_CLIENT_ID, FORTYTWO_CLIENT_SECRET } from '$env/static/private'

const domain = dev ? 'http://localhost:5173' : 'https://push.peuf.ch'

export const fortyTwoAuth = new FortyTwo(
    FORTYTWO_CLIENT_ID,
    FORTYTWO_CLIENT_SECRET,
    `${domain}/auth/42/callback`
)
