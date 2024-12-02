<script lang="ts">
    import Chart from 'chart.js/auto'
    import { onMount } from 'svelte'
    import type { EvalResult } from '$lib/analyze/Evaluations.svelte'

    let { results }: { results: EvalResult } = $props()

    let canvasElement: HTMLCanvasElement
    let chart: Chart

    $effect(() => updateChart(results))

    function updateChart(res: EvalResult) {
        if (!chart) return
        //TODO
        chart.update('none')
    }

    onMount(() => {
        chart = new Chart(canvasElement, {
            data: {
                datasets: [
                    //TODO
                ],
            },
        })
        updateChart(results)
        return () => chart.destroy()
    })
</script>

<div>
    <canvas bind:this={canvasElement}></canvas>
</div>
