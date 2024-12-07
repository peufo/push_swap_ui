<script lang="ts">
    import { Analyze } from '$lib/analyze'
    import { SelectResolver } from '$lib/algo'
    import type { Resolver } from '$lib'

    let resolver = $state<Resolver | undefined>()
</script>

<Analyze {resolver}>
    <SelectResolver onSelect={(r) => (resolver = r)} />
</Analyze>
