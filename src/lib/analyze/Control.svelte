<script lang="ts">
    import {
        mdiPlay,
        mdiStepBackward,
        mdiStepBackward2,
        mdiStepForward,
        mdiStepForward2,
        mdiStop,
    } from '@mdi/js'
    import { Icon } from '$lib'
    import { onDestroy } from 'svelte'
    import { moveReverseMap, type Move } from '$lib/move'
    import ControlSpeed from './ControlSpeed.svelte'

    let {
        sequence,
        currentMove = $bindable(),
        onMoves,
        onReset,
    }: {
        sequence: Move[]
        currentMove: number
        onMoves(sequence: Move[]): void
        onReset(): void
    } = $props()

    let player = $state<'forward' | 'backward' | 'pause'>('pause')
    let mps = $state<number>(4)
    const isToStart = $derived(currentMove === 0)
    const isToEnd = $derived(currentMove === sequence.length)
    let interval: NodeJS.Timeout | null = null
    function cleanInterval() {
        if (!interval) return
        clearInterval(interval)
        interval = null
    }

    onDestroy(() => {
        cleanInterval()
    })

    function reset() {
        cleanInterval()
        player = 'pause'
        currentMove = 0
        onReset()
    }

    function pause() {
        cleanInterval()
        player = 'pause'
    }

    function playForward() {
        if (player === 'forward') return pause()
        cleanInterval()
        player = 'forward'
        const ms = Math.min(Math.round(12000 / sequence.length), 300)
        interval = setInterval(() => {
            if (isToEnd) return pause()
            getNext(1)
        }, ms)
    }

    function playBackward() {
        if (player === 'backward') return pause()
        cleanInterval()
        player = 'backward'
        const ms = Math.min(Math.round(12000 / sequence.length), 300)
        interval = setInterval(() => {
            if (isToStart) return pause()
            getPrevious(1)
        }, ms)
    }

    function getPrevious(nb: number) {
        if (currentMove === 0) return
        const start = Math.max(0, currentMove - nb)
        const moves = sequence
            .slice(start, currentMove)
            .reverse()
            .map((m) => moveReverseMap[m])
        currentMove -= moves.length
        onMoves(moves)
    }

    function getNext(nb: number) {
        if (currentMove === sequence.length) return pause()
        const end = Math.min(sequence.length, currentMove + nb)
        const moves = sequence.slice(currentMove, end)
        currentMove += moves.length
        onMoves(moves)
    }
</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
    <legend>Control</legend>

    <div class="flex gap-2 justify-center">
        <button
            class="btn btn-square outline-2 outline-primary"
            onclick={playBackward}
            class:outline={player === 'backward'}
            disabled={isToStart}
        >
            <Icon path={mdiPlay} class="rotate-180" />
        </button>
        <button
            class="btn btn-square"
            onclick={reset}
            disabled={currentMove === 0}
        >
            <Icon path={mdiStop} />
        </button>
        <button
            class="btn btn-square outline-2 outline-primary"
            onclick={playForward}
            class:outline={player === 'forward'}
            disabled={isToEnd}
        >
            <Icon path={mdiPlay} />
        </button>
    </div>
    <ControlSpeed bind:mps />

    <div class="divider"></div>
    <div class="flex gap-2 justify-center">
        <button
            class="btn btn-square"
            onclick={() => {
                pause()
                getPrevious(5)
            }}
            disabled={isToStart}
        >
            <Icon path={mdiStepBackward2} />
        </button>
        <button
            class="btn btn-square"
            onclick={() => {
                pause()
                getPrevious(1)
            }}
            disabled={isToStart}
        >
            <Icon path={mdiStepBackward} />
        </button>
        <button
            class="btn btn-square"
            onclick={() => {
                pause()
                getNext(1)
            }}
            disabled={isToEnd}
        >
            <Icon path={mdiStepForward} />
        </button>
        <button
            class="btn btn-square"
            onclick={() => {
                pause()
                getNext(5)
            }}
            disabled={isToEnd}
        >
            <Icon path={mdiStepForward2} />
        </button>
    </div>
</fieldset>
