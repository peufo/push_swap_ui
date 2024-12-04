<script lang="ts">
    import NewProgram from './NewProgram.svelte'
    import { algoSplit } from '$lib/algo/split'
    import { algoSplit2 } from '$lib/algo/split_2'
    import { algoScore } from '$lib/algo/score'
    import type { Algo } from '$lib'

    export let algo = algoSplit2
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
            Split
        </button>
        <button
            class="btn grow"
            class:outline={algo.name === algoSplit2.name}
            onclick={() => (algo = algoSplit2)}
        >
            Split 2
        </button>
        <button
            class="btn grow"
            class:outline={algo.name === algoScore.name}
            onclick={() => (algo = algoScore)}
        >
            Score
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
