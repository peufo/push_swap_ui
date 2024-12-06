import { error } from '@sveltejs/kit'
import { formAction } from 'fuma/server'
import { z } from 'fuma/validation'
import { prisma } from '$lib/server'
import { modelAlgorithmUpdate } from '$lib'

export const load = async ({ locals: { user }, params: { algoId } }) => {
    if (!user) error(401)
    const algo = await prisma.algorithm.findUnique({ where: { id: +algoId } })
    if (!algo) error(404)
    if (user.id !== algo.authorId) error(403)
    return { algo }
}

export const actions = {
    algo_update: formAction(
        { id: z.coerce.number(), ...modelAlgorithmUpdate },
        async ({ event, data: { id, ...data } }) => {
            event.params.algoId
            const { user } = event.locals
            if (!user) error(401)
            return prisma.algorithm.update({
                where: { id, authorId: user.id },
                data,
            })
        },
        {
            redirectTo: '/me',
        }
    ),
    algo_delete: formAction(
        { id: z.coerce.number() },
        async ({ event, data: { id } }) => {
            const { user } = event.locals
            if (!user) error(401)
            return prisma.algorithm.delete({
                where: { id, authorId: user.id },
            })
        },
        {
            redirectTo: '/me',
        }
    ),
}
