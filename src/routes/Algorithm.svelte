<script lang="ts">
    import { type Sequence } from '../lib/move'
    import { algos, type Algo } from '$lib/algo'
    import { execPath } from '$lib/algo/exec'
    import { slide } from 'svelte/transition'
    import { tick } from 'svelte'

    let {
        values,
        onSequenceChange,
    }: {
        values: number[]
        onSequenceChange: (sequence: Sequence) => void
    } = $props()

    let algo = $state(algos[0])
    let isLoading = $state(false)

    function selectAlgo(a: Algo) {
        algo = a
        runAlgo()
    }

    export async function runAlgo() {
        isLoading = true
        setTimeout(async () => {
            const sequence = await algo.resolve(values)
            isLoading = false
            onSequenceChange(sequence)
        }, 50)
    }
</script>

<fieldset class="border rounded p-4 flex flex-col gap-2">
    <legend>Algorithm</legend>

    <div class="flex gap-2">
        {#each algos as a}
            <button
                class="btn outline-2"
                class:btn-active={algo.name === a.name}
                class:outline={algo.name === a.name}
                disabled={isLoading}
                onclick={() => selectAlgo(a)}
            >
                {a.name}
            </button>
        {/each}
    </div>

    {#if algo.name === 'Executable'}
        <div class="flex gap-2 items-end" transition:slide>
            <label class="block w-full">
                <span class="label-text">Executable path</span>
                <input
                    type="text"
                    bind:value={$execPath}
                    class="input input-bordered w-full"
                />
            </label>
            <button class="btn" onclick={runAlgo}>run</button>
        </div>
    {/if}
</fieldset>
