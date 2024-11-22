<script lang="ts">
    import { onMount } from 'svelte'
    import { Chart } from 'chart.js/auto'
    import { createState, type State } from '$lib/algo/score'
    import type { Stack } from '$lib/move'

    let { stack }: { stack: Stack } = $props()
    let canvasElement: HTMLCanvasElement
    let chart: Chart<'bar'>
    let state = $derived.by(() => {
        const s = createState(stack)
        return s
    })
    $effect(() => updateChart(state))

    function updateChart(s: State) {
        if (!chart) return
        chart.data.labels = s.deltas
        chart.data.datasets[0].data = [...s.deltas]
        chart.data.datasets[1].data = [...s.entropies]
        //chart.data.datasets[2].data = [...s.steps]
        chart.options.plugins!.title!.text = `Score: ${s.score}`
        chart.options.plugins!.subtitle!.text = JSON.stringify(s.scores)
            .replaceAll(/["\}\{]/g, '')
            .replaceAll(':', ' ')
            .replaceAll(',', ', ')
        chart.update('none')
    }

    onMount(() => {
        chart = new Chart(canvasElement, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    { label: 'deltas', data: [], borderWidth: 1 },
                    { label: 'entropies', data: [], borderWidth: 1 },
                    //{ label: 'steps', data: [], borderWidth: 1 },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    title: {
                        display: true,
                    },
                    subtitle: {
                        display: true,
                        padding: {
                            bottom: 8,
                        },
                    },
                },
            },
        })
        updateChart(state)
        return () => chart.destroy()
    })
</script>

<div class="max-w-xl">
    <canvas bind:this={canvasElement}></canvas>
</div>
