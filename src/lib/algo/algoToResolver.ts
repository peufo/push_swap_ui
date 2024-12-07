import { compileWasm, type Resolver } from '$lib'
import type { Algorithm } from '@prisma/client'

export async function algoToResolver(algo: Algorithm): Promise<Resolver> {
    const res = await fetch(`/wasm/${algo.wasm}`)
    const buffer = await res.arrayBuffer()
    //const resolver = compileWasm(buffer)
    return (values) => compileWasm(buffer).then((r) => r(values))
}
