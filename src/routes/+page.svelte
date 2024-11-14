<script lang="ts">
  import GraphScore from './GraphScore.svelte'
  import Arguments from './Arguments.svelte'
  import Sequence from './Sequence.svelte'

  let values = $state<number[]>([2, 4, 1])
  let sequence = $state<string[]>([])
</script>

<h2 class="p-4 text-2xl text-indigo-600">Push Swap UI</h2>
<div class="flex gap-4 p-4">
  <aside class="max-w-sm min-w-80 flex flex-col gap-4">
    <Arguments bind:values />
    <Sequence {values} bind:sequence />
  </aside>
  <main class="grow">
    <GraphScore />
  </main>
</div>
