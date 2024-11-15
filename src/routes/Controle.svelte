<script lang="ts">
  import { getNextCandidates, type State } from './state'
  import { move, moveReverse } from './move'

  let { state = $bindable() }: { state: State } = $props()

  function getNextBetterMove() {
    const m = state.candidates[0].sequence[0].m
    if (m === 'init') return
    const next = move(state, m)
    if (next.score > 0)
      next.candidates = getNextCandidates({ ...next, sequence: [] }, 5)
    state = next
  }

  function getPrevious() {
    const m = state.sequence.at(-1)?.m
    if (!m || m === 'init') return
    const prev = moveReverse(state, m)
    prev.candidates = getNextCandidates({ ...prev, sequence: [] }, 5)
    state = prev
  }
</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
  <legend>Controle</legend>
  <div class="flex gap-2">
    <button
      class="btn"
      onclick={getPrevious}
      disabled={state.sequence.length < 2}
    >
      prev
    </button>
    <button
      class="btn"
      onclick={getNextBetterMove}
      disabled={state.score === 0}
    >
      next
    </button>
  </div>
</fieldset>
