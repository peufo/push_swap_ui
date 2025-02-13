import { init, WASI } from '@wasmer/wasi'
import { createResolver, type Resolver } from '$lib'
import type { Move } from '$lib/move'

export async function compileWasm(buffer: ArrayBuffer): Promise<Resolver> {
    const module = await WebAssembly.compile(buffer)
    await init()
    return createResolver((values) => {
        const wasi = new WASI({
            env: {},
            args: ['hey', ...values.map((v) => v.toString())],
        })
        wasi.instantiate(module, {})
        const exitCode = wasi.start()
        if (exitCode == 1) throw Error('Program exit with exit code [1]')
        let stdout = wasi.getStdoutString()
        console.log(`STDOUT len=${stdout.length}`)
        console.log(stdout.slice(0, 1000))
        wasi.free()
        // TODO: valid the output with zod
        return stdout.split('\n').filter(Boolean) as Move[]
    })
}
