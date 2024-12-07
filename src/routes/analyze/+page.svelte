<script lang="ts">
    import { Analyze } from '$lib/analyze'
    import { algoToResolver, SelectResolver } from '$lib/algo'
    import type { Resolver } from '$lib'
    import { onMount } from 'svelte'

    let { data } = $props()
    let resolver = $state<Resolver | undefined>()

    onMount(async () => {
        if (!data.algo) return
        resolver = await algoToResolver(data.algo)
    })
</script>

<Analyze {resolver}>
    <SelectResolver onSelect={(r) => (resolver = r)} algo={data.algo} />
</Analyze>
