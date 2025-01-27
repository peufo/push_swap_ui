<script lang="ts">
    import { mode } from 'fuma'
    import type { Stack } from '$lib/move'
    let { stack }: { stack: Stack } = $props()

    let width = $state<number>(0)
    let height = $state<number>(0)
    let orientation = $state<'h' | 'v'>('h')
    let len = $derived(stack.values.length)
    let max = $derived(Math.max(...stack.values))
    let lightness = $derived($mode == 'dark' ? '76%' : '80%')
    let chroma = $derived($mode == 'dark' ? '0.12' : '0.10')
    let values = $derived(
        stack.values.map((value) => ({
            value,
            color: `oklch(${lightness} ${chroma} ${(value / max) * 300})`,
        }))
    )
    let W = $derived(width / (len + 1))
    let H = $derived(height / len)
    let paddingW = $derived(W * 0.1 > 1 ? W * 0.1 : 0)
    let paddingH = $derived(H * 0.1 > 1 ? H * 0.1 : 0)
    let lenA = $derived(stack.values.length - stack.cursor)
    let lenB = $derived(stack.cursor)
    let cursor_size = $derived(Math.max(8, Math.min(16, W)))
</script>

<fieldset class="border rounded p-4 grow">
    <legend class="px-1">Stacks</legend>

    <div class="flex flex-col h-full">
        <div class="flex gap-4 pb-4 items-center">
            <div>
                <pre class="text-sm">Stack A = [{lenA}]</pre>
                <pre class="text-sm">Stack B = [{lenB}]</pre>
            </div>
            <div class="grow"></div>
            <div class="flex gap-2">
                <button
                    class="btn"
                    class:outline={orientation === 'h'}
                    onclick={() => (orientation = 'h')}
                >
                    Horizontal
                </button>
                <button
                    class="btn"
                    class:outline={orientation === 'v'}
                    onclick={() => (orientation = 'v')}
                >
                    Vertical
                </button>
            </div>
        </div>

        {#if orientation === 'h'}
            <svg
                class="w-full grow"
                bind:clientWidth={width}
                bind:clientHeight={height}
                xmlns="http://www.w3.org/2000/svg"
            >
                {#each values as { value, color }, index (value)}
                    {@const h = Math.max(
                        (height - cursor_size) * (value / max) - paddingW,
                        1
                    )}
                    {@const isStackA = index >= stack.cursor ? 1 : 0}
                    <rect
                        width={W - paddingW}
                        height={h}
                        x={(index + isStackA) * W + paddingW / 2}
                        y={height - h - paddingW / 2 - cursor_size}
                        rx="2"
                        ry="2"
                        fill={color}
                    />
                {/each}
                <circle
                    cx={stack.cursor * W + W / 2}
                    cy={height - cursor_size + cursor_size / 2}
                    r={cursor_size / 2}
                    class="fill-primary"
                />
            </svg>
        {:else}
            <svg
                class="w-full grow"
                bind:clientWidth={width}
                bind:clientHeight={height}
                xmlns="http://www.w3.org/2000/svg"
            >
                {#each values.slice(stack.cursor) as { value, color }, index (value)}
                    {@const w = Math.max(
                        (width / 2) * (value / max) - paddingH,
                        1
                    )}
                    <rect
                        width={w}
                        height={H - paddingW}
                        x={width * 0.25 - w * 0.5}
                        y={height - (lenA - index) * H}
                        rx="2"
                        ry="2"
                        fill={color}
                    />
                {/each}

                {#each values
                    .slice(0, stack.cursor)
                    .toReversed() as { value, color }, index (value)}
                    {@const w = Math.max(
                        (width / 2) * (value / max) - paddingH,
                        1
                    )}
                    <rect
                        width={w}
                        height={H - paddingW}
                        x={width * 0.75 - w * 0.5}
                        y={height - (lenB - index) * H}
                        rx="2"
                        ry="2"
                        fill={color}
                    />
                {/each}
            </svg>
        {/if}
    </div>
</fieldset>
