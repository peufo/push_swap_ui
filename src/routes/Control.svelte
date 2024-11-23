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
    const ms = Math.min(Math.round(12000 / sequence.length), 50)
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
    if (!el) return
    el.parentElement?.scroll({
      left: el.offsetLeft - 100,
    })
  }
</script>

<fieldset class="border rounded pt-4 flex flex-col gap-2">
  <legend>Sequence ({sequence.length})</legend>

  <div class="flex gap-1 overflow-auto max-w-sm px-4 pb-4">
    {#each sequence as move, i}
      <div
        class="border px-2 rounded move"
        class:border-primary={i === currentMove}
        class:opacity-50={i < currentMove}
      >
        {move.toUpperCase()}
      </div>
    {/each}
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
