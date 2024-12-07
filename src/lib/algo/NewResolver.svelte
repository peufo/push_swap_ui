<script lang="ts">
    import { onMount } from 'svelte'
    import { Buffer } from 'buffer'
    import { toast } from 'svelte-sonner'
    import { Icon } from 'fuma'
    import { mdiHelp, mdiFileDocumentMultipleOutline } from '@mdi/js'

    import type { Move } from '$lib/move'
    import { type Resolver, compileWasm } from '$lib'

    let {
        onResolverChange,
        onFileHandleChange = () => {},
        isSelected = true,
        class: klass,
        onclick,
    }: {
        onResolverChange: (r: Resolver) => unknown
        onFileHandleChange?: (f: FileSystemFileHandle | null) => unknown
        isSelected?: boolean
        class?: string
        onclick?: () => unknown
    } = $props()

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
            toast.warning('Selection canceled')
            return
        }
        onFileHandleChange(fileHandle)
        //const resolver = await compileProgram()
        onResolverChange((values) => compileProgram().then((p) => p(values)))
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
        return compileWasm(buffer)
    }
</script>

<div class="flex gap-2 items-center {klass}">
    {#if fileHandle}
        {@const name = fileHandle.name}
        <button
            class="btn grow outline-primary"
            class:outline={isSelected}
            {onclick}
        >
            <span>
                {name.length > 24 ? '…' : ''}{name.slice(-24)}
            </span>
        </button>
    {/if}

    {#if !fileHandle}
        <button class="btn grow btn-primary" onclick={selectProgram}>
            Select wasm
        </button>
        <a href="/help" class="btn btn-circle">
            <Icon path={mdiHelp} title="How to make a .wasm file" />
        </a>
    {:else}
        <button class="btn btn-square" onclick={selectProgram}>
            <Icon path={mdiFileDocumentMultipleOutline} title="Change file" />
        </button>
    {/if}
</div>
