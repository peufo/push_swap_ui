<script lang="ts">
    import debounce from 'debounce'
    import { move, type Move, type Sequence, type Stack } from '$lib/move'
    import { StackHorizontal } from '$lib/visual'
    import SequenceView from './SequenceView.svelte'
    import Parameters from './Parameters.svelte'
    import Control from './Control.svelte'
    import type { Algo } from '$lib/algo'
    import Regression from './Regression.svelte'
    import Evaluations from './Evaluations.svelte'
    import { createValues } from './createValues'

    export let algo: Algo | undefined

    //let initalValues = [2, 1, 3, 6, 5, 8]
    let initalValues = createValues(60);
    let values = [...initalValues]
    let sequence: Sequence = []
    let currentMove: number
    let stack: Stack = { values: [...values], cursor: 0 }
    let algoIsRunning = false
    let algoTime = 0
    let mode: 'manual' | 'regression' | 'eval' = 'manual'

    const handleChangeValues = debounce((newValues: number[]) => {
        values = newValues
        stack = { values: [...values], cursor: 0 }
        runAlgo()
    }, 400)

    function onSequenceChange(newSequence: Sequence) {
        sequence = newSequence
        currentMove = 0
        stack = { values: [...values], cursor: 0 }
    }

    function onMoves(moves: Move[]) {
        for (const m of moves) move(stack, m)
        stack = stack
    }

    function onReset() {
        stack = { values: [...values], cursor: 0 }
    }

    $: if (algo) runAlgo()
    async function runAlgo() {
        if (!algo) return
        algoIsRunning = true
        const { sequence, time } = await algo.resolve(values)
        algoTime = time
        algoIsRunning = false
        currentMove = 0
        stack = { values: [...values], cursor: 0 }
        onSequenceChange(sequence)
    }
</script>

<div class="flex gap-4 p-4">
    <aside class="flex flex-col gap-4 w-96 shrink-0">
        <slot />
        <Parameters
            bind:mode
            values={initalValues}
            onchange={handleChangeValues}
        />
        {#if mode === 'manual'}
            <Control {sequence} {onMoves} {onReset} bind:currentMove />
        {/if}
    </aside>
    <main class="flex flex-col gap-4 grow min-w-0">
        {#if !algo}
            <div
                class="grid place-content-center grow border border-dashed rounded-lg"
            >
                <span>No program selected !</span>
            </div>
        {:else if mode === 'manual'}
            <SequenceView
                {sequence}
                stack={{ values: [...values], cursor: 0 }}
                {algoIsRunning}
                {algoTime}
                onRefreshAlgo={() => runAlgo()}
                bind:currentMove
            />
            <StackHorizontal {stack} />

            {#if algo?.charts}
                {#each algo.charts as Chart}
                    <svelte:component this={Chart} {stack} />
                {/each}
            {/if}
        {:else if mode === 'regression'}
            <Regression {algo} />
        {:else if mode === 'eval'}
            <Evaluations {algo} />
        {/if}
    </main>
</div>
