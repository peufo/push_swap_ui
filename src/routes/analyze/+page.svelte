<script lang="ts">
    import { Analyze } from '$lib/analyze'
    import SelectAlgo from './SelectAlgo.svelte'
    import type { Algo } from '$lib'

    let algo: Algo
</script>

<Analyze {algo}>
    <SelectAlgo bind:algo />
</Analyze>
