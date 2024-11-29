<script lang="ts">
    import Chart from 'chart.js/auto'
    import type { TestResult } from '$lib/analyze'
    import { onMount } from 'svelte'

    let { results }: { results: TestResult[] } = $props()

    let canvasElement: HTMLCanvasElement
    let chart: Chart<'scatter'>

    $effect(() => updateChart(results))

    function updateChart(res: TestResult[]) {
        if (!chart) return
        chart.data.datasets[0].data = res.map((r) => ({
            x: r.nbValues,
            y: r.nbMoves,
        }))
        const bgColors = res.map((r) =>
            r.isOk ? 'rgb(46, 204, 113, 0.5)' : 'rgb(231, 76, 60, 0.5)'
        )
        const colors = res.map((r) =>
            r.isOk ? 'rgb(46, 204, 113)' : 'rgb(231, 76, 60)'
        )
        chart.data.datasets[0].backgroundColor = bgColors
        chart.data.datasets[0].borderColor = colors
        chart.data.datasets[1].data = res.map((r) => ({
            x: r.nbValues,
            y: r.time,
        }))
        chart.update('none')
    }

    onMount(() => {
        chart = new Chart(canvasElement, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Sequence lenght',
                        yAxisID: 'y',
                        data: [],
                        showLine: true,
                    },
                    {
                        label: 'Execution time',
                        yAxisID: 'y2',
                        data: [],
                        showLine: false,
                        backgroundColor: 'rgb(52, 152, 219, 0.5)',
                        borderColor: 'rgb(52, 152, 219, 0.5)',
                    },
                ],
            },
            options: {
                showLine: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { text: 'Sequence', display: true },
                    },
                    x: {
                        title: { text: 'Number of values', display: true },
                    },
                    y2: {
                        beginAtZero: true,
                        title: { text: 'Execution time [ms]', display: true },
                        //display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false, // only want the grid lines for one axis to show up
                        },
                    },
                },
                plugins: {
                    legend: {},
                },
            },
        })
        updateChart(results)
        return () => chart.destroy()
    })
</script>

<div>
    <canvas bind:this={canvasElement}></canvas>
</div>
