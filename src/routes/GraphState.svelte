<script lang="ts">
  import { onMount } from 'svelte'
  import { Chart } from 'chart.js/auto'
  import type { State } from './state'

  let { state }: { state: State } = $props()
  let canvasElement: HTMLCanvasElement

  let chart: Chart<'bar', number[], string | number>
  $effect(() => {
    updateChart(state)
    logState(state)
  })

  function logState(s: State) {
    console.table({ values: [...s.values], deltas: s.deltas, steps: s.steps })
    const [neg] = s.candidates.filter((c) => c.score < 0)
    if (neg) {
      console.log('WTF')
      console.log(neg.scores)
      console.table({
        values: [...neg.values],
        deltas: neg.deltas,
        steps: neg.steps,
      })
    }
  }

  function updateChart(s: State) {
    if (!chart) return
    chart.data.labels = s.values
    chart.data.datasets[0].data = s.values
    chart.data.datasets[0].backgroundColor = s.values.map((v, i) =>
      i < s.cursor ? 'rgba(54, 162, 235, 0.2)' : 'rgba(153, 102, 255, 0.2)'
    )
    chart.data.datasets[0].borderColor = s.values.map((v, i) =>
      i < s.cursor ? 'rgba(54, 162, 235)' : 'rgba(153, 102, 255)'
    )
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
          {
            data: [],
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
          title: {
            display: true,
            text: '',
          },
          subtitle: {
            display: true,
            text: '',
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
