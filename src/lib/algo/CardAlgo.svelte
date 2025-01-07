<script lang="ts">
    import {
        mdiBookOpenPageVariantOutline,
        mdiPencilOutline,
        mdiChartBoxOutline,
        mdiSourceBranch,
        mdiRocketLaunchOutline,
        mdiSnail,
    } from '@mdi/js'
    import { Icon, tip } from 'fuma'
    import type { Algorithm, User } from '@prisma/client'
    import { Markdown } from '$lib/markdown'
    import { page } from '$app/stores'

    let { algo }: { algo: Algorithm & { author: User } } = $props()
    let readAll = $state<boolean>(false)
    let wrapperHeight = $state<number>(0)
    let descriptionHeight = $state<number>(0)
    let isLongDescription = $derived(
        readAll || descriptionHeight > wrapperHeight
    )
    const getTip = (nb: number) => `Sequence length to sort ${nb} number`
</script>

<div class="card border shadow-lg overflow-hidden">
    <div class="card-body">
        <h2 class="card-title">
            <span>{algo.name}</span>
            <span class="grow"></span>
            <span
                class="badge badge-lg flex-nowrap gap-2"
                use:tip={{ content: 'Execution time for 500 values' }}
            >
                {#if algo.execTime500 < 40}
                    <Icon path={mdiRocketLaunchOutline} class="fill-success" />
                {:else if algo.execTime500 > 400}
                    <Icon path={mdiSnail} class="fill-warning" />
                {/if}
                {algo.execTime500.toLocaleString()} ms
            </span>
            <span
                class="badge badge-lg flex-nowrap"
                use:tip={{ content: getTip(500) }}
            >
                {algo.score500.toLocaleString()}
            </span>
        </h2>
        <p class="mb-4 text-xs">
            By
            <a
                href="https://profile.intra.42.fr/users/{algo.author.login}"
                class="link link-hover"
                target="_blank"
            >
                {algo.author.displayname}
            </a>
            from {algo.author.campus}
        </p>

        <div
            class="description-wrapper relative"
            class:read-all={readAll}
            bind:offsetHeight={wrapperHeight}
        >
            <div class="description" bind:offsetHeight={descriptionHeight}>
                <Markdown value={algo.description} />
            </div>
        </div>
    </div>
    <div
        class="card-actions pt-4 flex-nowrap backdrop-blur-sm bg-base-100/60 p-8"
    >
        {#if isLongDescription}
            <button
                onclick={() => (readAll = !readAll)}
                class="btn btn-outline btn-sm group"
            >
                <Icon
                    path={mdiBookOpenPageVariantOutline}
                    class="group-hover:fill-base-100"
                />
                <span>Read {readAll ? 'less' : 'more'}</span>
            </button>
        {/if}

        <div class="grow"></div>

        {#if algo.repository}
            <a
                href={algo.repository}
                target="_blank"
                class="btn btn-ghost btn-sm"
            >
                <Icon path={mdiSourceBranch} />
                <span class="max-sm:hidden">Source</span>
            </a>
        {/if}
        <a href="/analyze?algoId={algo.id}" class="btn btn-ghost btn-sm">
            <Icon path={mdiChartBoxOutline} />
            <span>Analyze</span>
        </a>

        {#if $page.data.user?.id === algo.authorId}
            <a href="/edit/{algo.id}" class="btn btn-ghost btn-sm">
                <Icon path={mdiPencilOutline} />
                <span class="max-sm:hidden">Edit</span>
            </a>
        {/if}
    </div>
</div>

<style>
    .description-wrapper {
        max-height: 240px;
    }
    .description-wrapper.read-all {
        max-height: none;
    }
</style>
