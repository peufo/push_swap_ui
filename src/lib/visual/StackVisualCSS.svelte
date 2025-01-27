<script lang="ts">
    import type { Stack } from '$lib/move'

    let { stack }: { stack: Stack } = $props()

    const width = 600
    const height = 30
    let len = $derived(stack.values.length)
    let max = $derived(Math.max(...stack.values))
    let w = $derived(width / len)
    let padding = $derived(w * 0.1)
</script>

<div class="border rounded p-4 w-min">
    <div class="relative" style:width="{width}px" style:height="{height}px">
        {#each stack.values as value, index (value)}
            {@const h = height * (value / max)}
            <div
                class="stack-element {index < stack.cursor
                    ? 'stack-b'
                    : 'stack-a'}"
                style="
                    height: {h}px;
                    width: {w - padding}px;
                    translate: {index * w + padding / 2}px;
                "
            ></div>
        {/each}
    </div>
</div>

<style>
    .stack-element {
        border-width: 1px;
        position: absolute;
        bottom: 0;
        left: 0;
    }
    .stack-a {
        background-color: rgba(54, 162, 235, 0.4);
        border-color: rgba(54, 162, 235);
    }
    .stack-b {
        background-color: rgba(153, 102, 255, 0.4);
        border-color: rgba(153, 102, 255);
    }
</style>
