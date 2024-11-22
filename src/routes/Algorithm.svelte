<script lang="ts">
  import { type Sequence } from '../lib/move'
  import {algos, type Algo} from '$lib/algo'
  import { execPath } from '$lib/algo/exec';
    import { slide } from 'svelte/transition';
  
  let { values, onSequenceChange} : {
    values: number[];
    onSequenceChange: (sequence: Sequence) => void
  } = $props()

  let algo = $state(algos[0])
  async function runAlgo() {
    const sequence = await algo.resolve(values)
    onSequenceChange(sequence)
  }

</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
  <legend>Algorithm</legend>

  <div class="flex gap-2">
    {#each algos as a}
      <button class="btn" class:btn-active={algo.name === a.name} onclick={() => algo = a}>
        {a.name}
      </button>
    {/each}
  </div>
  
  {#if algo.name === 'Executable'}
    <div class="flex gap-2 items-end" transition:slide>
      <label class="block w-full">
        <span class="label-text">Executable path</span>
        <input type="text" bind:value={$execPath} class="input input-bordered w-full" />
      </label>
    </div>
  {/if}

  <hr>

  <button class="btn" onclick={runAlgo}>run</button>
</fieldset>
