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
        const distOK = get_distribution(
            res.runs.filter((r) => r.isOk).map((r) => r.nbMoves)
        )
        const distKO = get_distribution(
            res.runs.filter((r) => !r.isOk).map((r) => r.nbMoves)
        )
        const distMax = Math.max(...Object.values(distOK))
        const range = get_range(res.min, res.max)
        const limit = res.limits.filter((l) => l < res.max)[0] ?? res.limits[0]
        chart.data.labels = get_range(res.min, Math.max(res.max, limit))
        chart.data.datasets[0].data = range.map((x) => distOK[x] || 0)
        chart.data.datasets[1].data = range.map((x) => distKO[x] || 0)
        const rangeLen = Math.max(res.max, limit) - Math.min(res.min, limit)
        // @ts-ignore
        chart.data.datasets[0].barPercentage = 0.5 + rangeLen / 50
        // @ts-ignore
        chart.data.datasets[1].barPercentage = 0.5 + rangeLen / 50
        chart.data.datasets[2] = {
            type: 'scatter',
            label: 'Limit',
            showLine: true,
            data: [
                { x: limit, y: 0 },
                { x: limit, y: distMax },
            ],
            backgroundColor: 'rgb(97, 132, 216)',
            borderColor: 'rgb(97, 132, 216)',
            borderWidth: 2,
            pointRadius: 0,
        }

        chart.options.plugins!.title!.text = `${res.max} moves for ${res.nbValues} values`
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
        if (min > max) [min, max] = [max, min]
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
                        backgroundColor: 'rgba(129, 193, 75, 0.4)',
                        borderColor: 'rgba(129, 193, 75)',
                        borderWidth: 1,
                        order: 9,
                        stack: 'dist',
                    },
                    {
                        type: 'bar',
                        label: 'results',
                        data: [],
                        backgroundColor: 'rgba(226, 78, 27, 0.4)',
                        borderColor: 'rgba(226, 78, 27)',
                        borderWidth: 1,
                        order: 10,
                        stack: 'dist',
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true,
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
                            size: 14,
                        },
                    },
                    subtitle: {
                        text: '',
                        display: true,
                        padding: {
                            bottom: 20,
                        },
                        font: {
                            size: 12,
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
