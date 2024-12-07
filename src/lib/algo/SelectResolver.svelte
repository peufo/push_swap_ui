<script lang="ts">
    import { Icon, InputRelation, urlParam } from 'fuma'
    import { mdiClose, mdiTruckRemove } from '@mdi/js'
    import type { Algorithm } from '@prisma/client'
    import { algoToResolver, NewResolver, type Resolver } from '$lib/algo'
    import { api } from '$lib'
    import { goto } from '$app/navigation'
    import { onMount } from 'svelte'

    let {
        algo,
        onSelect,
    }: {
        algo?: Algorithm | null
        onSelect: (resolver: Resolver | undefined) => unknown
    } = $props()

    type SelectType = 'proposed' | 'listed'
    let selectedType = $state<SelectType>('listed')
    let resolverProposed = $state<Resolver>()
    let resolverListed = $state<Resolver>()
    let inputRelation = $state<InputRelation<Algorithm>>()

    onMount(async () => {
        if (!algo) return
        resolverListed = await algoToResolver(algo)
    })

    function select(t: SelectType) {
        selectedType = t
        if (selectedType === 'proposed') onSelect(resolverProposed)
        else onSelect(resolverListed)
    }

    async function handleSelectAlgorithm(a: Algorithm) {
        resolverListed = await algoToResolver(a)
        select('listed')
        goto($urlParam.with({ algoId: a.id }), {
            replaceState: true,
            noScroll: true,
            keepFocus: true,
        })
    }

    function handleClear() {
        inputRelation?.clear()
        goto($urlParam.without('algoId'), {
            replaceState: true,
            noScroll: true,
            keepFocus: true,
        })
    }
</script>

{#snippet slotItem(a: Algorithm)}
    <div class="flex h-12 items-center gap-2">
        <button
            class="btn grow"
            class:outline={selectedType === 'listed'}
            onclick={() => select('listed')}
        >
            <span>{a.name}</span>
        </button>
        <button onclick={handleClear} class="btn btn-square">
            <Icon path={mdiClose} />
        </button>
    </div>
{/snippet}
{#snippet slotSuggestion(a: Algorithm)}
    <span>{a.name}</span>
    <span class="badge ml-auto">{a.score500}</span>
{/snippet}

<fieldset class="p-4 border rounded">
    <legend class="px-1">Program</legend>
    <div class="flex flex-col gap-6">
        <InputRelation
            bind:this={inputRelation}
            value={algo}
            placeholder="Select an algorithm..."
            noSlotItemWrapper
            {slotItem}
            {slotSuggestion}
            search={api.Algorithm}
            on:input={({ detail: { value } }) => handleSelectAlgorithm(value)}
        />

        <NewResolver
            isSelected={selectedType === 'proposed'}
            onResolverChange={(r) => {
                resolverProposed = r
                select('proposed')
            }}
            onclick={() => select('proposed')}
        />
    </div>
</fieldset>
