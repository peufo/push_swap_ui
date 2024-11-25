<script lang="ts">
    import {
        mdiFastForward,
        mdiPlay,
        mdiRefresh,
        mdiSkipNext,
        mdiSkipPrevious,
        mdiStop,
    } from '@mdi/js'
    import { Icon, type Sequence } from '$lib'
    import { onDestroy } from 'svelte'
    import { moveReverseMap, type Move } from '$lib/move'
    import { slide } from 'svelte/transition'

    let {
        sequence,
        currentMove = $bindable(),
        algoIsRunning,
        algoTime,
        onMove,
        onReset,
        onRefreshAlgo,
    }: {
        sequence: Sequence
        currentMove: number
        algoIsRunning: boolean
        algoTime: number
        onMove(m: Move): void
        onReset(): void
        onRefreshAlgo(): void
    } = $props()

    let player = $state<'run' | 'run-faster' | 'pause'>('pause')
    let cursorElement = $state<HTMLDivElement>()
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
        updateSequenceScroll()
        onReset()
    }

    function pause() {
        cleanInterval()
        player = 'pause'
    }

    function play() {
        if (player === 'run') return pause()
        cleanInterval()
        player = 'run'
        const ms = Math.min(Math.round(12000 / sequence.length), 300)
        interval = setInterval(getNext, ms)
    }

    function playFaster() {
        if (player === 'run-faster') return pause()
        cleanInterval()
        player = 'run-faster'
        const ms = Math.min(Math.round(12000 / sequence.length), 5)
        interval = setInterval(getNext, ms)
    }

    function getPrevious() {
        if (currentMove === 0) return
        currentMove--
        updateSequenceScroll()
        onMove(moveReverseMap[sequence[currentMove]])
    }

    function getNext() {
        if (currentMove === sequence.length) return pause()
        onMove(sequence[currentMove])
        currentMove++
        updateSequenceScroll()
    }

    function updateSequenceScroll() {
        const el = document.querySelector(
            `.move:nth-child(${currentMove + 1})`
        ) as HTMLDivElement
        if (!el || !cursorElement) return
        el.parentElement?.scroll({
            left: el.offsetLeft - 100,
        })
        const delta = el.offsetLeft - (el.parentElement?.scrollLeft || 0) - 20
        cursorElement.style.translate = `${delta}px`
    }
</script>

<fieldset
    class="border rounded p-4 flex flex-col gap-2 overflow-hidden min-w-0"
>
    <legend>Sequence</legend>

    <div>
        <div class="flex items-center pb-2">
            <span class="font-mono text-sm">
                {#if algoIsRunning}
                    Execution...
                {:else}
                    <b>{sequence.length}</b>
                    moves founds on
                    <b>{Math.round(algoTime)}</b> ms
                {/if}
            </span>
            <button
                disabled={algoIsRunning}
                class="btn btn-square btn-sm ml-auto"
                title="run algo"
                onclick={onRefreshAlgo}
            >
                <Icon path={mdiRefresh} />
            </button>
        </div>

        {#if algoIsRunning}
            <div class="skeleton rounded-lg h-20"></div>
        {:else}
            <div class="relative h-6 w-0">
                <div class="absolute" bind:this={cursorElement}>👇</div>
            </div>
            <div class="flex gap-1 py-2 overflow-auto bg-base-200 rounded">
                {#each sequence as move, i}
                    <div class="border px-2 rounded move">
                        {move.toUpperCase()}
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</fieldset>

<fieldset class="border rounded p-4 flex flex-col gap-2">
    <legend>Controle</legend>

    <div class="flex gap-2">
        <button class="btn btn-square" onclick={reset}>
            <Icon path={mdiStop} />
        </button>
        <button
            class="btn btn-square outline-2"
            onclick={play}
            class:outline={player === 'run'}
        >
            <Icon path={mdiPlay} />
        </button>
        <button
            class="btn btn-square"
            class:outline={player === 'run-faster'}
            onclick={playFaster}
        >
            <Icon path={mdiFastForward} />
        </button>
        <div class="grow"></div>
        <button
            class="btn btn-square"
            onclick={getPrevious}
            disabled={player !== 'pause' || currentMove === 0}
        >
            <Icon path={mdiSkipPrevious} />
        </button>
        <button
            class="btn btn-square"
            onclick={getNext}
            disabled={player !== 'pause' || currentMove === sequence.length}
        >
            <Icon path={mdiSkipNext} />
        </button>
    </div>
</fieldset>
