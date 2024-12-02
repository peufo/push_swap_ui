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
        const nbMoves = res.runs.map((r) => r.nbMoves)
        const dist = get_distribution(nbMoves)
        const range = get_range(0, res.max)
        chart.data.labels = get_range(0, Math.max(res.max, ...res.limits))
        chart.data.datasets[0].data = range.map((x) => dist[x] || 0)
        // @ts-ignore
        chart.data.datasets[0].barPercentage =
            0.5 + Math.max(...res.limits) / 50
        res.limits.forEach((limit, i) => {
            chart.data.datasets[i + 1] = {
                type: 'scatter',
                label: 'Limit ' + (i + 1),
                showLine: true,
                data: [
                    { x: limit, y: 0 },
                    { x: limit, y: 1 },
                ],
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1,
                pointRadius: 0,
            }
        })
        chart.options.plugins!.title!.text = `max ${res.max} moves for ${res.nbValues} values`
        chart.options.plugins!.subtitle!.text = `limits: ${res.limits.join(', ')}`
        chart.update('none')
    }

    function get_distribution(values: number[]): Record<number, number> {
        const dist: Record<number, number> = {}
        values.forEach((v) => {
            if (!dist[v]) dist[v] = 1
            else dist[v]++
        })
        return dist
    }

    function get_range(min: number, max: number): number[] {
        const range: number[] = []
        for (let v = min; v <= max; v++) range.push(v)
        return range
    }

    onMount(() => {
        chart = new Chart(canvasElement, {
            data: {
                labels: [],
                datasets: [
                    {
                        type: 'bar',
                        label: 'results',
                        data: [],
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        borderColor: 'rgba(153, 102, 255)',
                        borderWidth: 1,
                        order: 99,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                    x: {
                        display: true,
                        title: { text: 'Sequence lenght', display: true },
                    },
                },
                locale: 'fr-ch',
                plugins: {
                    title: {
                        text: '',
                        display: true,
                        font: {
                            size: 20,
                        },
                    },
                    subtitle: {
                        text: '',
                        display: true,
                        padding: {
                            bottom: 20,
                        },
                        font: {
                            size: 18,
                        },
                    },
                    legend: {
                        display: false,
                    },
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
