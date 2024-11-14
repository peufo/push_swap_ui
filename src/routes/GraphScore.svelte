<script lang="ts">
  import { onMount } from 'svelte'
  import { Chart } from 'chart.js/auto'

  let canvasElement: HTMLCanvasElement
  onMount(() => {
    new Chart(canvasElement, {
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
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
      },
    })
  })
</script>

<div>
  <canvas bind:this={canvasElement}></canvas>
</div>
