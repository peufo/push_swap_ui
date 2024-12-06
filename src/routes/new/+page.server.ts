import path from 'node:path'
import fs from 'node:fs/promises'
import uuid from 'short-uuid'
import { formAction } from 'fuma/server'
import { WASM_DIR } from '$env/static/private'
import { modelAlgorithm } from '$lib'
import { prisma } from '$lib/server'

export const actions = {
    algo_create: formAction(
        modelAlgorithm,
        async ({ event, data, formData }) => {
            if (!event.locals.user) throw Error('Not authorized')
            console.log(data)
            const wasm = formData.get('wasm')
            if (!(wasm instanceof File)) throw Error('wasm file is required')

            const wasmDir = path.resolve(WASM_DIR)
            await fs.mkdir(wasmDir, { recursive: true })
            const wasmPath = path.resolve(wasmDir, uuid.generate() + '.wasm')

            await fs.writeFile(wasmPath, Buffer.from(await wasm.arrayBuffer()))
            return prisma.algorithm.create({
                data: {
                    ...data,
                    wasm: wasmPath,
                    authorId: event.locals.user.id,
                },
            })
        },
        {
            redirectTo: '/me',
        }
    ),
}
