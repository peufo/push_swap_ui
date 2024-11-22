<script lang="ts">
  import { onMount } from 'svelte'
  import { Chart, type ChartDataset } from 'chart.js/auto'
  import type { State } from '../lib/algo/score'

  let { state }: { state: State } = $props()
  let canvasElement: HTMLCanvasElement

  let chart: Chart<'scatter'>
  $effect(() => updateChart(state))

  function getCandidatesData(
    sequenceIndex: number,
    candidates: State[]
  ): ChartDataset<'scatter'>[] {
    const currents = candidates.filter((c) => !c.candidates.length)
    const dataset: ChartDataset<'scatter'>[] = currents.map((c, n) => {
      const sequence = c.sequence.slice(sequenceIndex)
      return {
        label: `Candidate [${n}] ${sequence.map(({ m }) => m).join('->')}`,
        data: sequence.map(({ score }, i) => ({
          x: sequenceIndex + i,
          y: score,
        })),
      }
    })
    const children = candidates.filter((c) => c.candidates.length)
    return [
      ...dataset,
      ...children
        .map((c) => getCandidatesData(sequenceIndex, c.candidates))
        .flat(),
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
          x: {
            ticks: {
              callback(v, i) {
                if (typeof v === 'string') return undefined
                if (v < state.sequence.length)
                  return `${v}.${state.sequence[v]?.m}`
                return `+${v - state.sequence.length + 1}`
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title(items) {
                return items
                  .filter(({ datasetIndex }) => !datasetIndex)
                  .map(
                    ({ dataIndex }) =>
                      `${dataIndex}.${state.sequence[dataIndex]?.m}`
                  )
              },
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
