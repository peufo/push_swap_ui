import { prisma } from '$lib/server'
import {
    encodeBase32LowerCaseNoPadding,
    encodeHexLowerCase,
} from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'
import type { User, Session } from '@prisma/client'

const DAY = 1000 * 60 * 60 * 24

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
}

export async function createSession(
    token: string,
    userId: number
): Promise<Session> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    )
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: new Date(Date.now() + DAY * 30),
    }
    return prisma.session.create({
        data: session,
    })
}

export async function validateSessionToken(
    token: string
): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(
        sha256(new TextEncoder().encode(token))
    )
    const result = await prisma.session.findUnique({
        where: {
            id: sessionId,
        },
        include: {
            user: true,
        },
    })
    if (!result) return { session: null, user: null }
    const { user, ...session } = result
    if (Date.now() >= session.expiresAt.getTime()) {
        await prisma.session.delete({ where: { id: sessionId } })
        return { session: null, user: null }
    }
    if (Date.now() >= session.expiresAt.getTime() - DAY * 15) {
        session.expiresAt = new Date(Date.now() + DAY * 30)
        await prisma.session.update({
            where: {
                id: session.id,
            },
            data: {
                expiresAt: session.expiresAt,
            },
        })
    }
    return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await prisma.session.delete({ where: { id: sessionId } })
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null }
