<script lang="ts">
    import { Chart } from 'chart.js/auto'
    import type { Stack } from '$lib/move'

    let { stack }: { stack: Stack } = $props()

    const width = 600
    const height = 300
    type StackName = 'A' | 'B'
    const colors: Record<StackName, { fill: string }> = {
        A: { fill: 'rgba(54, 162, 235)' },
        B: { fill: 'rgba(153, 102, 255)' },
    }

    let len = $derived(stack.values.length)
    let max = $derived(Math.max(...stack.values))
    let w = $derived(width / len)
    let padding = $derived(w * 0.1)
</script>

<div class="border rounded p-4 w-min">
    <svg {width} {height} xmlns="http://www.w3.org/2000/svg">
        {#each stack.values as value, index (value)}
            {@const h = height * (value / max)}
            <rect
                width={w - padding}
                height={h - padding}
                x={index * w + padding / 2}
                y={height - h + padding / 2}
                rx="2"
                ry="2"
                {...colors[index < stack.cursor ? 'B' : 'A']}
            />
        {/each}
    </svg>
</div>
