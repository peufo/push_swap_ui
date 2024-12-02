<script lang="ts">
    import { Analize } from '$lib/analyze'
    import SelectAlgo from './SelectAlgo.svelte'
    import type { Algo } from '$lib'

    let algo: Algo
</script>

<Analize {algo}>
    <SelectAlgo bind:algo />
</Analize>
