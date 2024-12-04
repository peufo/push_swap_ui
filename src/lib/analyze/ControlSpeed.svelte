<script lang="ts">
    import { mdiRabbit, mdiTortoise } from '@mdi/js'
    import { Icon } from 'fuma/ui'

    let {
        mps = $bindable(),
        sequenceLen,
    }: { mps: number; sequenceLen: number } = $props()
</script>

<div class="flex flex-col gap-1">
    <div class="flex gap-2 py-2 items-center">
        <Icon path={mdiTortoise} size={30} class="opacity-70" />
        <input
            type="range"
            min="1"
            max={Math.max(2, Math.round(sequenceLen / 3))}
            bind:value={mps}
            class="range"
        />
        <Icon path={mdiRabbit} size={30} class="opacity-70" />
    </div>
    <pre class="text-sm text-center">{mps} move{mps > 1
            ? 's'
            : ''} per second</pre>
</div>
