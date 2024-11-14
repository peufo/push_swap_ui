<script lang="ts">
  import { slide } from 'svelte/transition'

  let { values = $bindable() }: { values: number[] } = $props()

  let valuesAsString = $state(values.join(' '))
  let count = $state(values.length)
  const isUniqueValues = $derived(
    values.find((n, i, self) => self.indexOf(n) !== i) === undefined
  )

  function shuffle() {
    if (count < 1) {
      valuesAsString = ''
      return
    }
    const numbers = Array(count)
      .fill(1)
      .map(() => Math.random())
    const sorted = numbers.toSorted()
    valuesAsString = numbers.map((n, i) => sorted.indexOf(n)).join(' ')
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

<fieldset class="border rounded p-4 flex flex-col gap-2">
  <legend>Arguments</legend>
  <label class="block">
    <span class="label-text">Values</span>
    <textarea
      contenteditable="true"
      class="textarea textarea-bordered w-full"
      bind:value={valuesAsString}
    ></textarea>
    {#if !isUniqueValues}
      <div class="label-text-alt text-red-500" transition:slide>
        Duplicate value
      </div>
    {/if}
  </label>
  <div class="flex gap-2 items-end">
    <label class="block w-full">
      <span class="label-text block">Count</span>
      <input
        type="number"
        class="input input-bordered w-full"
        bind:value={count}
        min="2"
      />
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
