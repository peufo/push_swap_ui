<script lang="ts">
  import {
    mdiSkipForward,
    mdiSkipNext,
    mdiSkipPrevious,
    mdiSmoke,
  } from '@mdi/js'
  import { getNextCandidates, type State } from './state'
  import { move, moveList, moveReverse, type Move } from './move'
  import { Icon } from '$lib'

  let { state = $bindable() }: { state: State } = $props()

  function getNextBetterMove() {
    const m = state.candidates[0].sequence[state.sequence.length].m
    if (m === 'init') return
    state = move(state, m)
    if (state.score > 0) state.candidates = getNextCandidates(state, 4)
  }

  function getNextBetterSequence() {
    state.candidates[0].sequence
      .slice(state.sequence.length)
      .forEach(({ m }) => {
        if (m === 'init') return
        state = move(state, m)
      })
    if (state.score > 0) state.candidates = getNextCandidates(state, 4)
  }

  function getPrevious() {
    const m = state.sequence.at(-1)?.m
    if (!m || m === 'init') return
    const prev = moveReverse(state, m)
    prev.candidates = getNextCandidates(prev, 4)
    state = prev
  }

  function getNext(m: Move) {
    const next = move(state, m)
    if (next.score > 0) next.candidates = getNextCandidates(next, 4)
    state = next
  }

  function getNextSplit() {
    const m = findNextMoveSplit()
    getNext(m)
  }

  function findNextMoveSplit(): Move {
    if (!state.pivot) throw Error('Pivot is null')
    if (state.cursor <= state.pivot) {
      const value = state.values[state.cursor]
      if (value < state.pivot) {
        //TODO place value on right or on left of pivotB
        return 'pb'
      }
      // TODO: choose 'ra' or 'rra'
      return 'ra'
    }

    const value = state.values[state.cursor - 1]
    if (value <= state.pivot) return 'pa'
    return 'rb'
  }
</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
  <legend>Controle</legend>
  <div class="flex gap-2">
    <button
      class="btn grow"
      onclick={getPrevious}
      disabled={state.sequence.length < 2}
    >
      <Icon path={mdiSkipPrevious} />
      prev
    </button>
    <button
      class="btn grow"
      onclick={getNextBetterMove}
      disabled={state.score === 0}
    >
      next
      <Icon path={mdiSkipNext} />
    </button>
    <button
      class="btn btn-square"
      onclick={getNextBetterSequence}
      disabled={state.score === 0}
    >
      <Icon path={mdiSkipForward} />
    </button>
    <button
      class="btn btn-square"
      onclick={getNextSplit}
      disabled={state.score === 0}
    >
      <Icon path={mdiSmoke} />
    </button>
  </div>
  <div class="flex flex-wrap gap-2">
    {#each moveList as m}
      <button
        class="btn btn-sm"
        onclick={() => getNext(m)}
        disabled={state.score === 0}
      >
        {m}
      </button>
    {/each}
  </div>
</fieldset>
