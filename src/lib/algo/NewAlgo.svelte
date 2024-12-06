<script lang="ts">
    import { onMount } from 'svelte'
    import { init, WASI } from '@wasmer/wasi'
    import { Buffer } from 'buffer'
    import { toast } from 'svelte-sonner'
    import type { Move } from '$lib/move'
    import { createResolver, type Algo, type Resolver } from '$lib'
    import { Icon } from 'fuma'
    import { mdiHelp } from '@mdi/js'

    let {
        onAlgoChange,
        onFileHandleChange = () => {},
        algoIsSelected = true,
        class: klass,
    }: {
        onAlgoChange: (a: Algo) => unknown
        onFileHandleChange?: (f: FileSystemFileHandle | null) => unknown
        algoIsSelected?: boolean
        class?: string
    } = $props()

    const algo: Algo = {
        name: 'New programe',
        resolve: (values) => compileProgram().then((progam) => progam(values)),
    }

    onMount(() => {
        window.Buffer = window.Buffer || Buffer
    })

    let fileHandle = $state<FileSystemFileHandle | null>(null)

    async function selectProgram() {
        try {
            ;[fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: 'Web Assembly',
                        accept: { 'application/wasm': '.wasm' },
                    },
                ],
                multiple: false,
            })
        } catch (e) {
            console.error(e)
            fileHandle = null
            toast.warning('Selection canceled')
        }
        onFileHandleChange(fileHandle)
        onAlgoChange(algo)
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
            wasi.free()
            // TODO: valid the output with zod
            return stdout.split('\n').filter(Boolean) as Move[]
        })
    }
</script>

<div class="flex gap-2 items-center {klass}">
    {#if fileHandle}
        {@const name = fileHandle.name}
        <button
            class="btn grow outline-primary"
            class:outline={algoIsSelected}
            onclick={() => onAlgoChange(algo)}
        >
            <span>
                {name.length > 24 ? '…' : ''}{name.slice(-24)}
            </span>
        </button>
    {/if}

    <button
        class="btn grow"
        class:btn-primary={!fileHandle}
        onclick={selectProgram}
    >
        {fileHandle ? 'Change' : 'Select wasm'}
    </button>

    {#if !fileHandle}
        <a href="/help" class="btn btn-sm btn-circle">
            <Icon path={mdiHelp} title="How to make a .wasm file" />
        </a>
    {/if}
</div>
