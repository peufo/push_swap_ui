<script lang="ts">
    import debounce from 'debounce'
    import { move, type Move, type Sequence, type Stack } from '$lib/move'
    import { StackVisual } from '$lib/visual'
    import SequenceView from './SequenceView.svelte'
    import Parameters from './Parameters.svelte'
    import Control from './Control.svelte'
    import type { Resolver } from '$lib/algo'
    import Regression from './Regression.svelte'
    import Evaluations from './Evaluations.svelte'
    import { createValues } from './createValues'

    export let resolver: Resolver | undefined

    let initalValues = createValues(42)
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
        runResolver()
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

    $: if (resolver) runResolver()
    async function runResolver() {
        if (!resolver) return
        algoIsRunning = true
        const { sequence, time } = await resolver(values)
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
        {#if !resolver}
            <div
                class="grid place-content-center grow border border-dashed rounded-lg"
            >
                <span>No algorithme selected !</span>
            </div>
        {:else if mode === 'manual'}
            <SequenceView
                {sequence}
                stack={{ values: [...values], cursor: 0 }}
                {algoIsRunning}
                {algoTime}
                onRefreshAlgo={() => runResolver()}
                bind:currentMove
            />
            <StackVisual {stack} />
        {:else if mode === 'regression'}
            <Regression {resolver} />
        {:else if mode === 'eval'}
            <Evaluations {resolver} />
        {/if}
    </main>
</div>
