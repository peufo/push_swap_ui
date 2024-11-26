<script lang="ts">
    import { type Move, type Stack } from '$lib/move'
    import { isSequenceOk } from './isSequenceOk'

    let { sequence, stack }: { sequence: Move[]; stack: Stack } = $props()

    let resultOK = $derived.by<boolean>(() => isSequenceOk(stack, sequence))
</script>

{#if resultOK}
    <span class="text-success">[OK]</span>
{:else}
    <span class="text-error">[KO]</span>
{/if}
