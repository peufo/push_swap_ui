<script lang="ts">
    import debounce from 'debounce'
    import { move, type Move, type Sequence, type Stack } from '$lib/move'
    import { StackHorizontal } from '$lib/visual'
    import SequenceView from './SequenceView.svelte'
    import Arguments from './Arguments.svelte'
    import Control from './Control.svelte'
    import type { Algo } from '$lib/algo'

    export let algo: Algo | undefined

    let initalValues = [2, 1, 3, 6, 5, 8]
    let values = [...initalValues]
    let sequence: Sequence = []
    let currentMove: number
    let stack: Stack = { values: [...values], cursor: 0 }
    let algoIsRunning = false
    let algoTime = 0

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

    function onMove(m: Move) {
        move(stack, m)
        stack = stack
    }

    function onReset() {
        stack = { values: [...values], cursor: 0 }
    }

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
    <aside class="flex flex-col gap-4 max-w-sm min-w-80 shrink-0">
        <slot />
        <Arguments values={initalValues} onchange={handleChangeValues} />
        <Control {sequence} {onMove} {onReset} bind:currentMove />
    </aside>
    <main class="flex flex-col gap-4 grow min-w-0">
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
    </main>
</div>
