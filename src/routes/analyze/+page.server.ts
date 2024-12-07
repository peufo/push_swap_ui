import { z } from 'fuma'
import { parseQuery } from 'fuma/server'
import { prisma } from '$lib/server'

export const load = async ({ url }) => {
    const { algoId } = parseQuery(url, { algoId: z.coerce.number().nullish() })
    if (!algoId) return { algo: null }
    return {
        algo: await prisma.algorithm.findFirst({ where: { id: algoId } }),
    }
}
