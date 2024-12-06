import { redirect } from '@sveltejs/kit'
import { prisma } from '$lib/server'

export const load = async () => {
    return {
        algos: await prisma.algorithm.findMany({
            include: { author: true },
        }),
    }
}
