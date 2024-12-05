<script lang="ts">
    import type { Stack } from '$lib/move'

    let { stack }: { stack: Stack } = $props()

    let width = $state<number>(0)
    let height = $state<number>(0)
    let mode = $state<'h' | 'v'>('h')
    type StackName = 'A' | 'B'
    const colors: Record<StackName, { fill: string }> = {
        A: { fill: 'rgb(54, 162, 235)' },
        B: { fill: 'rgb(153, 102, 255)' },
    }

    let len = $derived(stack.values.length)
    let max = $derived(Math.max(...stack.values))
    let W = $derived(width / len)
    let H = $derived(height / len)
    let paddingW = $derived(W * 0.1 > 2 ? W * 0.1 : 0)
    let paddingH = $derived(H * 0.1 > 2 ? H * 0.1 : 0)
    let lenA = $derived(stack.values.length - stack.cursor)
    let lenB = $derived(stack.cursor)
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
                    class:outline={mode === 'h'}
                    onclick={() => (mode = 'h')}
                >
                    Horizontal
                </button>
                <button
                    class="btn"
                    class:outline={mode === 'v'}
                    onclick={() => (mode = 'v')}
                >
                    Vertical
                </button>
            </div>
        </div>

        {#if mode === 'h'}
            <svg
                class="w-full grow"
                bind:clientWidth={width}
                bind:clientHeight={height}
                xmlns="http://www.w3.org/2000/svg"
            >
                {#each stack.values as value, index (value)}
                    {@const h = Math.max(height * (value / max) - paddingW, 1)}
                    <rect
                        width={W - paddingW}
                        height={h}
                        x={index * W + paddingW / 2}
                        y={height - h - paddingW / 2}
                        rx="2"
                        ry="2"
                        {...colors[index < stack.cursor ? 'B' : 'A']}
                    />
                {/each}
            </svg>
        {:else}
            <svg
                class="w-full grow"
                bind:clientWidth={width}
                bind:clientHeight={height}
                xmlns="http://www.w3.org/2000/svg"
            >
                {#each stack.values.slice(stack.cursor) as value, index (value)}
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
                        {...colors.A}
                    />
                {/each}

                {#each stack.values.slice(0, stack.cursor) as value, index (value)}
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
                        {...colors.B}
                    />
                {/each}
            </svg>
        {/if}
    </div>
</fieldset>
