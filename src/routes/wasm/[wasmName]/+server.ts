import path from 'node:path'
import fs from 'node:fs/promises'
import { env } from '$env/dynamic/private'
import { error } from '@sveltejs/kit'

export const GET = async ({ params: { wasmName } }) => {
    const filePath = path.resolve(env.WASM_DIR, wasmName)
    const buffer = await fs.readFile(filePath).catch(() => null)
    if (!buffer) error(404)
    return new Response(buffer, {
        headers: {
            'content-type': 'application/wasm',
        },
    })
}
