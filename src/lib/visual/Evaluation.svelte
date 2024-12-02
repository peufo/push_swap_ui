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
        const distOK = get_distribution(res.runs.filter(r => r.isOk).map((r) => r.nbMoves))
        const distKO = get_distribution(res.runs.filter(r => !r.isOk).map((r) => r.nbMoves))
        const range = get_range(0, res.max)
        chart.data.labels = get_range(0, Math.max(res.max, ...res.limits))
        console.log({distKO, distOK})
        chart.data.datasets[0].data = range.map((x) => distOK[x] || 0)
        chart.data.datasets[1].data = range.map((x) => distKO[x] || 0)
        // @ts-ignore
        chart.data.datasets[0].barPercentage =
            0.5 + Math.max(...res.limits) / 50
        // @ts-ignore
        chart.data.datasets[1].barPercentage =
            0.5 + Math.max(...res.limits) / 50
        res.limits.forEach((limit, i) => {
            chart.data.datasets[i + 2] = {
                type: 'scatter',
                label: 'Limit ' + (i + 1),
                showLine: true,
                data: [
                    { x: limit, y: 0 },
                    { x: limit, y: 1 },
                ],
                backgroundColor: 'rgb(97, 132, 216)',
                borderColor: 'rgb(97, 132, 216)',
                borderWidth: 2,
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
                        backgroundColor: 'rgba(129, 193, 75, 0.4)',
                        borderColor: 'rgba(129, 193, 75)',
                        borderWidth: 1,
                        order: 9,
                        stack: 'dist'
                    },
                    {
                        type: 'bar',
                        label: 'results',
                        data: [],
                        backgroundColor: 'rgba(226, 78, 27, 0.4)',
                        borderColor: 'rgba(226, 78, 27)',
                        borderWidth: 1,
                        order: 10,
                        stack: 'dist'
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        stacked: true
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
