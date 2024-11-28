<script lang="ts">
    import Icon from '$lib/Icon.svelte'
    import { mdiRabbit, mdiTortoise } from '@mdi/js'

    let { mps = $bindable() }: { mps: number } = $props()
</script>

<div class="flex flex-col gap-1">
    <div class="flex gap-2 py-2 items-center">
        <Icon path={mdiTortoise} size={30} class="opacity-70" />
        <input type="range" min="1" max="100" bind:value={mps} class="range" />
        <Icon path={mdiRabbit} size={30} class="opacity-70" />
    </div>
    <pre class="text-sm text-center">{mps} moves per second</pre>
</div>
