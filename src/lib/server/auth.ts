import { FortyTwo } from 'arctic'
import { dev } from '$app/environment'

import { env } from '$env/dynamic/private'

const domain = dev ? 'http://localhost:5173' : 'https://push.peuf.ch'

export const fortyTwoAuth = new FortyTwo(
    env.FORTYTWO_CLIENT_ID,
    env.FORTYTWO_CLIENT_SECRET,
    `${domain}/auth/42/callback`
)
