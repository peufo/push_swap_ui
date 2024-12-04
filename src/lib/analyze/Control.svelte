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
    import { moveReverseMap, type Move } from '$lib/move'
    import ControlSpeed from './ControlSpeed.svelte'
    import { onDestroy, onMount } from 'svelte'

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

    type PlayerStatus = 'pause' | 'forward' | 'backward'

    let player = $state<PlayerStatus>('pause')
    let mps = $state<number>(8)
    let animationId: number | null = null
    const moveDuration = $derived(1000 / mps)
    const isToStart = $derived(currentMove === 0)
    const isToEnd = $derived(currentMove === sequence.length)

    $effect(() => {
        pause()
        mps = Math.max(1, Math.round(sequence.length / 10))
    })

    onMount(() => {
        window.addEventListener('keydown', handleShortcuts)
        return () => {
            pause()
            window.removeEventListener('keydown', handleShortcuts)
        }
    })

    function handleShortcuts(e: KeyboardEvent) {
        if (e.key === 'ArrowRight') {
            if (e.ctrlKey) return getNext(5)
            return getNext(1)
        }
        if (e.key === 'ArrowLeft') {
            if (e.ctrlKey) return getPrevious(5)
            return getPrevious(1)
        }
        if (e.key === ' ') {
            if (e.ctrlKey) return playBackward()
            return playForward()
        }
        if (e.key === 'ArrowDown') return reset()
    }


    function reset() {
        pause()
        currentMove = 0
        onReset()
    }

    function pause() {
        if (animationId) cancelAnimationFrame(animationId)
        player = 'pause'
    }

    function playForward() {
        if (player === 'forward') return pause()
        const animation = createAnimation(getNext, 'forward')
        requestAnimationFrame(animation)
    }

    function playBackward() {
        if (player === 'backward') return pause()
        const animation = createAnimation(getPrevious, 'backward')
        requestAnimationFrame(animation)
    }

    function getNext(nb: number) {
        if (currentMove === sequence.length) return pause()
        const end = Math.min(sequence.length, currentMove + nb)
        const moves = sequence.slice(currentMove, end)
        currentMove += moves.length
        onMoves(moves)
    }

    function getPrevious(nb: number) {
        if (currentMove === 0) return pause()
        const start = Math.max(0, currentMove - nb)
        const moves = sequence
            .slice(start, currentMove)
            .reverse()
            .map((m) => moveReverseMap[m])
        currentMove -= moves.length
        onMoves(moves)
    }

    function createAnimation(fun: (nb: number) => void, status: PlayerStatus) {
        let current = performance.now()
        pause()
        player = status
        function animation(time: number) {
            const elapsedTime = time - current
            const nbMoves = Math.floor(elapsedTime / moveDuration)
            if (nbMoves > 0) {
                fun(nbMoves)
                current = time
            }
            if (player === status)
                animationId = requestAnimationFrame(animation)
        }
        return animation
    }
</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
    <legend class="px-1">Control</legend>

    <div class="flex gap-2 justify-center">
        <button
            title="Play / pause backward"
            class="btn btn-square outline-2 outline-primary"
            onclick={playBackward}
            class:outline={player === 'backward'}
            disabled={isToStart}
        >
            <Icon path={mdiPlay} class="rotate-180" />
        </button>
        <button
            title="Reset"
            class="btn btn-square"
            onclick={reset}
            disabled={currentMove === 0}
        >
            <Icon path={mdiStop} />
        </button>
        <button
            title="Play / pause forward"
            class="btn btn-square outline-2 outline-primary"
            onclick={playForward}
            class:outline={player === 'forward'}
            disabled={isToEnd}
        >
            <Icon path={mdiPlay} />
        </button>
    </div>
    <ControlSpeed bind:mps sequenceLen={sequence.length} />

    <div class="divider"></div>
    <div class="flex gap-2 justify-center">
        <button
            title="5 steps backward"
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
            title="Step backward"
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
            title="Step forward"
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
            title="5 steps forward"
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
