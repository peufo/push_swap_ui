import path from 'node:path'
import fs from 'node:fs/promises'
import { WASM_DIR } from '$env/static/private'
import { error } from '@sveltejs/kit'

export const GET = async ({ params: { wasmName } }) => {
    const filePath = path.resolve(WASM_DIR, wasmName)
    const buffer = await fs.readFile(filePath).catch(() => null)
    if (!buffer) error(404)
    return new Response(buffer, {
        headers: {
            'content-type': 'application/wasm',
        },
    })
}
