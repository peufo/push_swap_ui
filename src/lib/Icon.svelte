<script lang="ts">
  export let path: string
  export let size = 22
  let klass = ''
  export { klass as class }
  export let style = ''
  export let classSVG = ''

  const viewWidth = 24
  const viewHeight = 24
</script>

<i class="grid place-content-center fill-base-content {klass}" {style}>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox={`0 0 ${viewWidth} ${viewHeight}`}
    style="display: inline-block;"
    class={classSVG}
  >
    <path d={path} />
  </svg>
</i>
