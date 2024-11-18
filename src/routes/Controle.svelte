<script lang="ts">
  import { mdiPageLast, mdiPageFirst } from '@mdi/js'
  import { getNextCandidates, type State } from './state'
  import { move, moveList, moveReverse, type Move } from './move'
  import { Icon } from '$lib'

  let { state = $bindable() }: { state: State } = $props()

  function getNextBetterMove() {
    const m = state.candidates[0].sequence[state.sequence.length].m
    if (m === 'init') return
    const next = move(state, m)
    if (next.score > 0) next.candidates = getNextCandidates(next, 4)
    state = next
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
</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
  <legend>Controle</legend>
  <div class="flex gap-2">
    <button
      class="btn grow"
      onclick={getPrevious}
      disabled={state.sequence.length < 2}
    >
      <Icon path={mdiPageFirst} />
      prev
    </button>
    <button
      class="btn grow"
      onclick={getNextBetterMove}
      disabled={state.score === 0}
    >
      next
      <Icon path={mdiPageLast} />
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
