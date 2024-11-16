<script lang="ts">
  import { type Sequence, sequenceShema } from './move'

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
  <legend>Sequence</legend>
  <div class="flex gap-2 items-end">
    <label class="block w-full">
      <span class="label-text">Executable</span>
      <input type="text" bind:value={exe} class="input input-bordered w-full" />
    </label>
    <button class="btn" onclick={exec}>exec</button>
  </div>
  <ul class="flex gap-1 flex-wrap">
    {#if sequence.length}
      <li class="border px-2 rounded bg-primary text-primary-content">
        {sequence.length}
      </li>
    {/if}
    {#each sequence as move}
      <li class="border px-2 rounded">{move.toUpperCase()}</li>
    {/each}
  </ul>
  {#if !isValidOutput}
    <span class="label-text">Output invalid</span>
    <pre
      class="border rounded p-2 text-sm max-h-80 overflow-scroll">{output}</pre>
  {/if}
</fieldset>
