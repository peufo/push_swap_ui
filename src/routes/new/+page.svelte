<script lang="ts">
    import { Manual } from '$lib/manual'
    import NewProgram from './NewProgram.svelte'
    import { algoSplit as algo } from '$lib/algo/split'

    let newProgram: NewProgram
</script>

<Manual algo={newProgram?.algo}>
    <NewProgram bind:this={newProgram} />
</Manual>
