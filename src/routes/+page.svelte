<script lang="ts">
  import type { Move } from './move'
  import { createState, type State } from './state'
  import GraphState from './GraphState.svelte'
  import Arguments from './Arguments.svelte'
  import Sequence from './Sequence.svelte'
  import GraphSequence from './GraphSequence.svelte'
  import Controle from './Controle.svelte'

  let initalValues = [2, 1, 3, 6, 5, 8]
  //let initalValues = [2, 1, 6, 3]
  let values = [...initalValues]
  let current = createState(values)

  function handleChangeValues(newValues: number[]) {
    values = newValues
    current = createState(newValues)
  }
</script>

<h2 class="p-4 text-2xl text-indigo-600">Push Swap UI</h2>
<div class="flex gap-4 p-4">
  <aside class="max-w-sm min-w-80 flex flex-col gap-4">
    <Arguments values={initalValues} onchange={handleChangeValues} />
    <Sequence {values} />
    <Controle bind:state={current} />
  </aside>
  <main class="grow">
    <GraphState state={current} />
    <GraphSequence state={current} />
  </main>
</div>
