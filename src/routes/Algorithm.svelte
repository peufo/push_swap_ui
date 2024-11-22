<script lang="ts">
  import { type Sequence, sequenceShema } from '../lib/move'
  import {algos} from '$lib/algo'
    import { each } from 'chart.js/helpers';


  let exe = $state('~/42/push_swap/push_swap')
  let {
    values,
    sequence = $bindable([]),
  }: { values: number[]; sequence?: Sequence } = $props()

  let output = $state('')
  let isValidOutput = $state(true)

  async function exec() {
    sequence = []
    output = await fetch('/', {
      method: 'POST',
      body: JSON.stringify({ exe, values }),
    }).then((r) => r.text())
    const res = sequenceShema.safeParse(output.split('\n').filter(Boolean))
    if (res.success) {
      isValidOutput = true
      sequence = res.data
    } else {
      console.log(res.error)
      isValidOutput = false
      sequence = []
    }
  }

  $inspect(output)
</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
  <legend>Algorithm</legend>
  <div class="flex gap-2 items-end">
    <label class="block w-full">
      <span class="label-text">Executable</span>
      <input type="text" bind:value={exe} class="input input-bordered w-full" />
    </label>
    <button class="btn" onclick={exec}>exec</button>
  </div>


  
  {#each algos as a}
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">{a.name}</span>
        <input type="radio" name="radio-algo" class="radio" onselect={() => console.log(a.name)} />
      </label>
    </div>
  {/each}


  {#if !isValidOutput}
    <span class="label-text">Output invalid</span>
    <pre
      class="border rounded p-2 text-sm max-h-80 overflow-scroll">{output}</pre>
  {/if}
</fieldset>
