<script lang="ts">
  import { slide } from 'svelte/transition'

  let { values = $bindable() }: { values: number[] } = $props()

  let valuesAsString = $state(values.join(' '))
  let count = $state(values.length)
  const isUniqueValues = $derived(
    !values.find((n, i, self) => self.indexOf(n) !== i)
  )

  function shuffle() {
    const numbers = Array(count)
      .fill(1)
      .map(() => Math.random())
    const sorted = numbers.toSorted()
    valuesAsString = numbers.map((n) => sorted.indexOf(n) * 2).join(' ')
  }

  $effect(() => {
    values = valuesAsString
      .split(' ')
      .filter(Boolean)
      .map((n) => +n)
      .filter((n) => !isNaN(n))
  })
  $effect(() => {
    count = values.length
  })
</script>

<fieldset class="border rounded px-8 py-4 flex flex-col gap-2">
  <legend>Arguments</legend>
  <label class="block">
    <span class="label-text">Values</span>
    <textarea
      contenteditable="true"
      class="input input-bordered w-full"
      bind:value={valuesAsString}
    ></textarea>
    {#if !isUniqueValues}
      <div class="label-text-alt text-red-500" transition:slide>
        Duplicate value
      </div>
    {/if}
  </label>
  <div class="flex gap-2 items-end">
    <label class="block">
      <span class="label-text block">Count</span>
      <input type="number" class="input input-bordered" bind:value={count} />
    </label>
    <button
      class="btn"
      class:btn-primary={values.length != count}
      onclick={shuffle}
    >
      shuffle
    </button>
  </div>
</fieldset>
