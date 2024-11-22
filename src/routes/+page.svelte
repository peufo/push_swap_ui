<script lang="ts">
    import debounce from 'debounce'
    import Arguments from './Arguments.svelte'
    import Algorithm from './Algorithm.svelte'
    import Control from './Control.svelte'
    import GraphStack from './GraphStack.svelte'
    import GraphSequence from './GraphSequence.svelte'
    import { move, type Move, type Sequence, type Stack } from '$lib/move'

    let algorithm: Algorithm
    let initalValues = [2, 1, 3, 6, 5, 8]
    //let initalValues = [3, 4, 2, 0, 1, 5]
    //let initalValues = [0, 8, 1, 5, 6, 4, 2, 3, 7]
    //let initalValues = [8, 9, 6, 4, 7, 11, 10, 3, 1, 2, 0, 5]
    //let initalValues = [1, 5, 2, 4, 8, 6, 3, 7, 0]
    //let initalValues = [1, 5, 10, 3, 4, 6, 15, 12, 7, 0, 8, 9, 2, 14, 11, 13]

    let values = [...initalValues]
    let sequence: Sequence = []
    let currentMove: number
    let stack: Stack = { values: [...values], cursor: 0 }

    const handleChangeValues = debounce((newValues: number[]) => {
        values = newValues
        stack = { values: [...values], cursor: 0 }
        algorithm.runAlgo()
    }, 400)

    function onSequenceChange(newSequence: Sequence) {
        sequence = newSequence
        currentMove = 0
        stack = { values: [...values], cursor: 0 }
    }

    function onMove(m: Move) {
        stack = move(stack, m)
    }

    function onReset() {
        stack = { values: [...values], cursor: 0 }
    }
</script>

<h2 class="p-4 text-2xl text-indigo-600">Push Swap UIs</h2>
<div class="flex gap-4 p-4">
    <aside class="max-w-sm min-w-80 flex flex-col gap-4 grow">
        <Arguments values={initalValues} onchange={handleChangeValues} />
        <Algorithm bind:this={algorithm} {values} {onSequenceChange} />
        <Control {sequence} bind:currentMove {onMove} {onReset} />
    </aside>
    <main class="grow">
        <GraphStack {stack} />
    </main>
</div>
