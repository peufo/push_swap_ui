<script lang="ts">
    import {
        mdiFastForward,
        mdiPlay,
        mdiSkipNext,
        mdiSkipPrevious,
        mdiStop,
    } from '@mdi/js'
    import { Icon, type Sequence } from '$lib'
    import { onDestroy } from 'svelte'
    import { moveReverseMap, type Move } from '$lib/move'

    let {
        sequence,
        currentMove = $bindable(),
        onMove,
        onReset,
    }: {
        sequence: Sequence
        currentMove: number
        onMove(m: Move): void
        onReset(): void
    } = $props()

    let player = $state<'run' | 'run-faster' | 'pause'>('pause')
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
        onMove(moveReverseMap[sequence[currentMove]])
    }

    function getNext() {
        if (currentMove === sequence.length) return pause()
        onMove(sequence[currentMove])
        currentMove++
    }
</script>

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
