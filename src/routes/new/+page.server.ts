import path from 'node:path'
import fs from 'node:fs/promises'
import uuid from 'short-uuid'
import { formAction } from 'fuma/server'
import { WASM_DIR } from '$env/static/private'
import { modelAlgorithmCreate } from '$lib'
import { prisma } from '$lib/server'
import { error } from '@sveltejs/kit'

export const load = async (event) => {
    if (!event.locals.user) error(401)
    return {}
}

export const actions = {
    algo_create: formAction(
        modelAlgorithmCreate,
        async ({ event, data, formData }) => {
            if (!event.locals.user) throw Error('Not authorized')
            const wasmFile = formData.get('wasm')
            if (!(wasmFile instanceof File))
                throw Error('wasm file is required')
            const wasmDir = path.resolve(WASM_DIR)
            await fs.mkdir(wasmDir, { recursive: true })
            const wasmName = uuid.generate() + '.wasm'
            const wasmPath = path.resolve(wasmDir, wasmName)
            await fs.writeFile(
                wasmPath,
                Buffer.from(await wasmFile.arrayBuffer())
            )
            return prisma.algorithm.create({
                data: {
                    ...data,
                    wasm: wasmName,
                    authorId: event.locals.user.id,
                },
            })
        },
        {
            redirectTo: '/me',
        }
    ),
}
