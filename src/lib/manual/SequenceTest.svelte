<script lang="ts">
    import { move, type Move, type Stack } from '$lib/move'

    let { sequence, stack }: { sequence: Move[]; stack: Stack } = $props()

    let resultOK = $derived.by<boolean>(() => {
        const s: Stack = { values: [...stack.values], cursor: stack.cursor }
        for (const m of sequence) {
            move(s, m)
        }
        if (s.cursor !== 0) return false
        const len = s.values.length
        for (let index = 1; index < len; index++) {
            if (s.values[index - 1] > s.values[index]) return false
        }
        return true
    })
</script>

{#if resultOK}
    <span class="text-success">[OK]</span>
{:else}
    <span class="text-error">[KO]</span>
{/if}
