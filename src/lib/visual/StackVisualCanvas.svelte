<script lang="ts">
    import type { Stack } from '$lib/move'

    let { stack }: { stack: Stack } = $props()
    let canvas = $state<HTMLCanvasElement>()
    let ctx = $derived(canvas?.getContext('2d'))
    const width = 600
    const height = 300
    type StackName = 'A' | 'B'
    const colors: Record<StackName, { fill: string; stroke: string }> = {
        A: { fill: 'rgba(54, 162, 235, 0.2)', stroke: 'rgba(54, 162, 235)' },
        B: { fill: 'rgba(153, 102, 255, 0.2)', stroke: 'rgba(153, 102, 255)' },
    }
    let len = $derived(stack.values.length)
    let max = $derived(Math.max(...stack.values))

    $effect(() => draw(stack))

    function draw(s: Stack) {
        if (!ctx) return
        ctx.clearRect(0, 0, width, height)
        ctx.fillStyle = colors.B.fill
        ctx.strokeStyle = colors.B.stroke
        for (let index = 0; index < s.cursor; index++) {
            drawRect(index)
        }
        ctx.fillStyle = colors.A.fill
        ctx.strokeStyle = colors.A.stroke
        for (let index = s.cursor; index < len; index++) {
            drawRect(index)
        }
        function drawRect(index: number) {
            const w = width / len
            const p = 0.1 * w
            const h = height * (s.values[index] / max)
            const x = index * w
            const y = height - h
            ctx!.fillRect(x + p / 2, y, w - p, h)
            ctx!.strokeRect(x + p / 2, y, w - p, h)
        }
    }
</script>

<div class="border rounded p-4 w-min">
    <canvas bind:this={canvas} {width} {height}></canvas>
</div>
