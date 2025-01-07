<script lang="ts">
    import { Form, FormControl, InputText } from 'fuma'
    import { tick } from 'svelte'
    import type { Algorithm } from '@prisma/client'
    import { MarkdownEdit } from '$lib/markdown'
    import { NewResolver, type Resolver } from '$lib/algo'
    import Evaluations, {
        type EvalResult,
    } from '$lib/analyze/Evaluations.svelte'
    import { modelAlgorithmCreate } from '$lib'

    let description = $state('')
    let resolver = $state<Resolver | null>(null)
    let fileHandle = $state<FileSystemFileHandle | null>(null)
    let fileList = $state<FileList | null>(null)
    let evaluations = $state<Evaluations | undefined>()

    type Scores = Pick<Algorithm, 'score3' | 'score5' | 'score100' | 'score500'>
    let scores = $state<Scores | null>(null)
    let execTime500 = $state<number | null>(null)

    async function onResolverChange(r: Resolver) {
        scores = null
        execTime500 = null
        resolver = r
        await tick()
        if (evaluations) evaluations.refresh()
    }
    async function onFileHandleChange(handle: FileSystemFileHandle | null) {
        fileHandle = handle
        if (!fileHandle) {
            fileList = null
            return
        }
        const file = await fileHandle.getFile()
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileList = dataTransfer.files
    }

    function onEvalDone(results: EvalResult[]) {
        const isOk =
            results.filter(
                (r) => r.runs.filter((run) => run.isOk).length === r.runs.length
            ).length === results.length
        if (!isOk) {
            scores = null
            return
        }
        scores = results.reduce<Scores>(
            (acc, cur) => ({ ...acc, [`score${cur.nbValues}`]: cur.max }),
            {} as Scores
        )
        const result500 = results.find((r) => r.nbValues === 500)!
        execTime500 = Math.ceil(Math.max(...result500.runs.map((r) => r.time)))
    }
</script>

<div class="max-w-lg mx-auto my-10">
    <h1 class="text-2xl pb-6">New algorithm</h1>

    <NewResolver {onResolverChange} {onFileHandleChange} class="my-4" />
    {#if resolver && fileHandle}
        <div class="py-2">
            <Evaluations
                bind:this={evaluations}
                {resolver}
                readOnly
                mode="table"
                nbRuns={100}
                onDone={onEvalDone}
            />
        </div>
    {/if}

    <Form
        action="/new?/algo"
        model={modelAlgorithmCreate}
        disabled={!scores || !fileList}
    >
        {#if fileList}
            <input
                type="file"
                name="wasm"
                bind:files={fileList}
                class="hidden"
            />
        {/if}
        {#if scores}
            {#each Object.entries(scores) as [name, value]}
                <input type="hidden" {name} {value} />
            {/each}
        {/if}
        {#if execTime500}
            <input type="hidden" name="execTime500" value={execTime500} />
        {/if}
        <InputText key="name" label="Name" input={{ autocomplete: 'off' }} />
        <FormControl key="description" label="Description">
            <MarkdownEdit bind:value={description} />
            <input type="hidden" name="description" value={description} />
        </FormControl>
        <InputText
            key="repository"
            label="Repository"
            input={{ placeholder: 'https://github.com/peufo/42_push_swap' }}
        />
    </Form>
</div>
