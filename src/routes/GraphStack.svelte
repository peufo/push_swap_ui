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
        chart.data.datasets[0].data = [...s.values]
        chart.data.datasets[0].backgroundColor = s.values.map((v, i) =>
            i < s.cursor
                ? 'rgba(54, 162, 235, 0.2)'
                : 'rgba(153, 102, 255, 0.2)'
        )
        chart.data.datasets[0].borderColor = s.values.map((v, i) =>
            i < s.cursor ? 'rgba(54, 162, 235)' : 'rgba(153, 102, 255)'
        )
        chart.update('none')
    }

    onMount(() => {
        chart = new Chart(canvasElementStack, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{ data: [], borderWidth: 1 }],
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
