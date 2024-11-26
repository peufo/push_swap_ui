<script lang="ts">
    import { onMount } from 'svelte'
    import { init, WASI } from '@wasmer/wasi'
    import { Buffer } from 'buffer'
    import type { Move } from '$lib/move'
    import { createResolver, type Algo, type Resolver } from '$lib'

    export const algo: Algo = {
        name: 'New programe',
        resolve: (values) => compileProgram().then((progam) => progam(values)),
    }

    onMount(() => {
        window.Buffer = window.Buffer || Buffer
    })

    let fileHandle = $state<FileSystemFileHandle | null>(null)

    async function selectProgram() {
        ;[fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'Web Assembly',
                    accept: { 'application/wasm': '.wasm' },
                },
            ],
            multiple: false,
        })
    }

    async function compileProgram(): Promise<Resolver> {
        if (!fileHandle)
            return () =>
                new Promise((resolve) =>
                    resolve({
                        time: 0,
                        sequence: [] as Move[],
                        error: new Error('No fileHandle'),
                    })
                )
        const file = await fileHandle.getFile()
        const buffer = await file.arrayBuffer()
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

            // TODO: valid the output with zod
            return stdout.split('\n').filter(Boolean) as Move[]
        })
    }
</script>

<fieldset class="p-4 border rounded">
    <legend>Program</legend>

    <div class="flex gap-2">
        {#if fileHandle}
            <span
                class="inline-flex px-4 items-center rounded-lg border border-primary text-primary w-full"
            >
                {fileHandle.name}
            </span>
        {/if}

        <button
            class="btn"
            class:w-full={!fileHandle}
            class:btn-primary={!fileHandle}
            onclick={selectProgram}
        >
            {fileHandle ? 'Change' : 'Select file'}
        </button>
    </div>
</fieldset>
