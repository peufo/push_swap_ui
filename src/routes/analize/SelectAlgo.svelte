<script lang="ts">
    import NewProgram from './NewProgram.svelte'
    import { algoSplit } from '$lib/algo/split'
    import type { Algo } from '$lib'

    export let algo = algoSplit
    let algoNewProgram: Algo | undefined
</script>

<fieldset class="p-4 border rounded">
    <legend class="px-1">Program</legend>
    <div class="flex gap-2 pb-2">
        <button
            class="btn grow"
            class:outline={algo.name === algoSplit.name}
            onclick={() => (algo = algoSplit)}
        >
            Split JS
        </button>
    </div>
    <NewProgram
        algoIsSelected={algo.name === algoNewProgram?.name}
        onAlgoChange={(a) => {
            algoNewProgram = a
            algo = a
        }}
    />
</fieldset>
