<script lang="ts">
  import GraphScore from './GraphScore.svelte'
  import Arguments from './Arguments.svelte'

  let values = $state<number[]>([2, 4, 1])
</script>

<div class="max-w-2xl mx-auto flex flex-col gap-4 p-4">
  <h2 class="text-2xl text-indigo-600">Push Swap UI</h2>
  <Arguments bind:values />
  <GraphScore />
</div>
