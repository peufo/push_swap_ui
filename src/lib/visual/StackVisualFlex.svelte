<script lang="ts">
    import type { Stack } from '$lib/move'

    let { stack }: { stack: Stack } = $props()

    const width = 600
    const height = 300
    type StackName = 'A' | 'B'
    const colors: Record<StackName, { fill: string; stroke: string }> = {
        A: { fill: 'rgba(54, 162, 235, 0.2)', stroke: 'rgba(54, 162, 235)' },
        B: { fill: 'rgba(153, 102, 255, 0.2)', stroke: 'rgba(153, 102, 255)' },
    }

    let len = $derived(stack.values.length)
    let max = $derived(Math.max(...stack.values))
    let w = $derived(width / len)
    let padding = $derived(w * 0.1)
</script>

<div class="border rounded p-4 w-min">
    <div
        class="flex items-end"
        style:gap="{padding}px"
        style:width="{width}px"
        style:height="{height}px"
    >
        {#each stack.values as value, index (value)}
            {@const h = height * (value / max)}
            <div
                class="border {index < stack.cursor ? 'stack-b' : 'stack-a'}"
                style="height: {h}px; width: {w - padding}px;"
            ></div>
        {/each}
    </div>
</div>

<style>
    .stack-a {
        background-color: rgba(54, 162, 235, 0.4);
        border-color: rgba(54, 162, 235);
    }
    .stack-b {
        background-color: rgba(153, 102, 255, 0.4);
        border-color: rgba(153, 102, 255);
    }
</style>
