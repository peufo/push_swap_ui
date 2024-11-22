<script lang="ts">
  import { onMount } from 'svelte'
  import { Chart } from 'chart.js/auto'
  import type { State } from '../lib/algo/score'

  let { state }: { state: State } = $props()
  let canvasElementState: HTMLCanvasElement
  let canvasElementScore: HTMLCanvasElement

  let chartState: Chart<'bar', number[], string | number>
  let chartScore: Chart<'bar', number[], string | number>
  $effect(() => {
    updateCharts(state)
    logState(state)
  })

  function logState(s: State) {
    console.log('pivot', s.pivot)
    console.log('cursor', s.cursor)
  }

  function updateChartState(s: State) {
    if (!chartState) return
    chartState.data.labels = s.values.map((v, i) => i)
    chartState.data.datasets[0].data = [...s.values]
    chartState.data.datasets[0].backgroundColor = s.values.map((v, i) =>
      i < s.cursor ? 'rgba(54, 162, 235, 0.2)' : 'rgba(153, 102, 255, 0.2)'
    )
    chartState.data.datasets[0].borderColor = s.values.map((v, i) =>
      i < s.cursor ? 'rgba(54, 162, 235)' : 'rgba(153, 102, 255)'
    )
    chartState.update('none')
  }

  function updateChartScore(s: State) {
    if (!chartScore) return
    chartScore.data.labels = s.deltas
    chartScore.data.datasets[0].data = [...s.deltas]
    chartScore.data.datasets[1].data = [...s.steps]
    chartScore.data.datasets[2].data = [...s.entropies]
    chartScore.options.plugins!.title!.text = `Score: ${s.score}`
    chartScore.options.plugins!.subtitle!.text = JSON.stringify(s.scores)
      .replaceAll(/["\}\{]/g, '')
      .replaceAll(':', ' ')
      .replaceAll(',', ', ')
    chartScore.update('none')
  }

  function updateCharts(s: State) {
    updateChartState(s)
    updateChartScore(s)
  }

  onMount(() => {
    chartState = new Chart(canvasElementState, {
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
    chartScore = new Chart(canvasElementScore, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          { label: 'deltas', data: [], borderWidth: 1 },
          { label: 'steps', data: [], borderWidth: 1 },
          { label: 'entropies', data: [], borderWidth: 1 },
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
    updateCharts(state)
    return () => chartState.destroy()
  })
</script>

<div class="max-w-xl">
  <canvas bind:this={canvasElementState}></canvas>
</div>
<div class="max-w-xl">
  <canvas bind:this={canvasElementScore}></canvas>
</div>
