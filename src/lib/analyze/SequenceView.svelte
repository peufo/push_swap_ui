<script lang="ts">
    import { mdiArrowDown, mdiRefresh } from '@mdi/js'
    import { Icon } from '$lib'
    import { type Move, type Stack } from '$lib/move'
    import { getOptimizationPotential } from '$lib/algo/optimize'
    import SequenceTest from './SequenceTest.svelte'

    let {
        sequence,
        currentMove = $bindable(),
        stack,
        algoIsRunning,
        algoTime,
        onRefreshAlgo,
    }: {
        sequence: Move[]
        currentMove: number
        stack: Stack
        algoIsRunning: boolean
        algoTime: number
        onRefreshAlgo(): void
    } = $props()

    let cursorElement = $state<HTMLDivElement>()
    const optimizationPotiential = $derived(getOptimizationPotential(sequence))

    $effect(() => {
        if (currentMove === undefined) return
        const el = document.querySelector(
            `.move:nth-child(${currentMove + 1})`
        ) as HTMLDivElement
        if (!el || !cursorElement) return

        const left = el.offsetLeft - (el.parentElement?.offsetLeft || 0) + 8
        el.parentElement?.parentElement?.scroll({ left: left - 100 })
        cursorElement.style.translate = `${left}px`
    })
</script>

<fieldset
    class="border rounded p-4 flex flex-col gap-2 overflow-hidden min-w-0"
>
    <legend>Sequence</legend>

    <div>
        <div class="flex items-center gap-2 pb-2">
            <span class="font-mono text-sm">
                {#if algoIsRunning}
                    Execution...
                {:else}
                    <b>{sequence.length}</b>
                    moves founds in
                    <b>{Math.round(algoTime)}</b> ms
                    <SequenceTest {sequence} {stack} />
                {/if}
            </span>
            {#if optimizationPotiential}
                <span
                    class="badge badge-warning"
                    title="Easy optimizations possibles"
                >
                    <Icon path={mdiArrowDown} size={16} />
                    {optimizationPotiential}
                </span>
            {/if}

            <button
                disabled={algoIsRunning}
                class="btn btn-square btn-sm ml-auto"
                title="run algo"
                onclick={onRefreshAlgo}
            >
                <Icon path={mdiRefresh} />
            </button>
        </div>

        {#if algoIsRunning}
            <div class="skeleton rounded-lg h-20"></div>
        {:else if sequence.length < 10000}
            <div class="overflow-auto relative">
                <div>
                    <div class="inline-block" bind:this={cursorElement}>👇</div>
                </div>

                <div class="flex gap-1 py-2">
                    {#each sequence as move, i}
                        <div class="border px-2 rounded move">
                            {move.toUpperCase()}
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
</fieldset>
