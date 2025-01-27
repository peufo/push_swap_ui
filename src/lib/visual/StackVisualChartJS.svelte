<script lang="ts">
    import { onMount } from 'svelte'
    import { Chart } from 'chart.js/auto'
    import type { Stack } from '$lib/move'

    let { stack }: { stack: Stack } = $props()
    let canvasElementStack: HTMLCanvasElement

    let chart: Chart<'bar', number[], string | number>

    $effect(() => {
        updateChart(stack)
    })

    function updateChart(s: Stack) {
        if (!chart) return
        chart.data.labels = s.values.map((v, i) => i)
        const len = s.values.length
        const { backgroundColor, borderColor } = chart.data.datasets[0]
        for (let index = 0; index < len; index++) {
            if (chart.data.datasets[0].data[index] !== s.values[index])
                chart.data.datasets[0].data[index] = s.values[index]
            if (index < s.cursor) {
                // @ts-ignore
                backgroundColor[index] = 'rgba(54, 162, 235, 0.2)'
                // @ts-ignore
                borderColor[index] = 'rgba(54, 162, 235)'
            } else {
                // @ts-ignore
                backgroundColor[index] = 'rgba(153, 102, 255, 0.2)'
                // @ts-ignore
                borderColor[index] = 'rgba(153, 102, 255)'
            }
        }
        chart.update('none')
    }

    onMount(() => {
        chart = new Chart(canvasElementStack, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [
                    {
                        data: [...stack.values],
                        backgroundColor: stack.values.map(
                            () => 'rgba(54, 162, 235, 0.2)'
                        ),
                        borderColor: stack.values.map(
                            () => 'rgba(54, 162, 235)'
                        ),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
        })
        updateChart(stack)
        return () => chart.destroy()
    })
</script>

<div class="max-w-xl">
    <canvas bind:this={canvasElementStack}></canvas>
</div>
