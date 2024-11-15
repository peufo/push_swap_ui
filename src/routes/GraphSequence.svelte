<script lang="ts">
  import { onMount } from 'svelte'
  import { Chart, type ChartDataset } from 'chart.js/auto'
  import type { State } from './state'

  let { state }: { state: State } = $props()
  let canvasElement: HTMLCanvasElement

  let chart: Chart<'scatter'>
  $effect(() => updateChart(state))

  function getCandidatesData(
    delta: number,
    candidates: State[]
  ): ChartDataset<'scatter'>[] {
    const currents = candidates.filter((c) => !c.candidates.length)
    const dataset: ChartDataset<'scatter'>[] = currents.map((c, n) => ({
      label: `Candidate [${n}] ${c.sequence.map(({ m }) => m).join('->')}`,
      data: c.sequence.map(({ score }, i) => ({ x: delta + i, y: score })),
    }))
    const children = candidates.filter((c) => c.candidates.length)
    return [
      ...dataset,
      ...children.map((c) => getCandidatesData(delta, c.candidates)).flat(),
    ]
  }

  function getDatasets(s: State): ChartDataset<'scatter'>[] {
    return [
      {
        label: 'sequence',
        data: s.sequence.map(({ score }, x) => ({ x, y: score })),
      },
      ...getCandidatesData(s.sequence.length, s.candidates),
    ]
  }

  function updateChart(s: State) {
    if (!chart) return
    chart.data.datasets = getDatasets(s)
    chart.update('none')
  }

  onMount(() => {
    chart = new Chart(canvasElement, {
      type: 'scatter',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        showLine: true,
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
    updateChart(state)
    return () => chart.destroy()
  })
</script>

<div class="max-w-xl">
  <canvas bind:this={canvasElement}></canvas>
</div>
