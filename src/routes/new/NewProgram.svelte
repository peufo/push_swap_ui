<script lang="ts">
    import { onMount } from 'svelte'
    import { init, WASI } from '@wasmer/wasi'
    import { Buffer } from 'buffer'
    import { resolve } from 'chart.js/helpers'
    import type { Move } from '$lib/move'

    onMount(() => {
        window.Buffer = window.Buffer || Buffer
    })

    let file: File | null = null

    async function selectProgram() {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'Web Assembly',
                    accept: { 'application/wasm': '.wasm' },
                },
            ],
            multiple: false,
        })
        file = await fileHandle.getFile()
        console.log(file)
    }

    async function runProgram(values: number[]): Promise<Move[]> {
        if (!file) return []
        const buffer = await file.arrayBuffer()
        const module = await WebAssembly.compile(buffer)
        await init()

        let wasi = new WASI({
            env: {},
            args: ['hey', ...values.map((v) => v.toString())],
        })
        wasi.instantiate(module, {})
        const exitCode = wasi.start()
        if (exitCode == 1) throw Error('Program exit with exit code [1]')
        let stdout = wasi.getStdoutString()
        console.log(stdout)

        // TODO: valid the output with zod
        return stdout.split('\n') as Move[]
    }
</script>

<fieldset class="p-4 border rounded border-primary">
    <legend>New Program</legend>

    <div class="flex gap-2">
        {#if file}
            <label class="block w-full">
                <input
                    readonly
                    disabled
                    class="input input-bordered w-full"
                    value={file.name}
                    min="2"
                />
            </label>
        {/if}

        <button
            class="btn"
            class:w-full={!file}
            class:btn-primary={!file}
            onclick={selectProgram}
        >
            Select
        </button>
    </div>

    <button class="btn" onclick={() => runProgram([2, 3, 5, 9, 6])}>
        test
    </button>
</fieldset>
