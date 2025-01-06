<script lang="ts">
    import {
        mdiAccountHeartOutline,
        mdiPlus,
        mdiChartBoxOutline,
    } from '@mdi/js'
    import { ToggleMode, Icon } from 'fuma/ui'
    import { mode } from 'mode-watcher'
    import { Toaster } from 'svelte-sonner'
    import '../app.css'

    let { children, data } = $props()
</script>

<Toaster theme={$mode} />

<div
    class="flex flex-wrap gap-2 border-b shadow-md items-center p-1 pl-4 bordered sticky top-0 bg-base-100 z-10"
>
    <a href="/">
        <h2 class="text-2xl text-primary">push_swap_ui</h2>
    </a>

    <div class="flex gap-2 justify-end grow">
        <a href="/analyze" class="btn">
            <Icon path={mdiChartBoxOutline} />
            <span class="max-sm:hidden">Analyze</span>
        </a>
        {#if data.user}
            <a href="/new" class="btn btn-primary btn-outline group">
                <Icon
                    path={mdiPlus}
                    class="fill-primary group-hover:fill-base-100"
                />
                <span class="max-sm:hidden">new algorithm</span>
            </a>
            <a href="/me" class="btn gap-3 pr-0 max-sm:px-2 overflow-hidden">
                <div class="max-sm:hidden">{data.user.login}</div>
                <div class="h-full p-0.5">
                    <img
                        src={data.user.imageSmall}
                        alt="User avatar"
                        class="h-full rounded"
                    />
                </div>
            </a>
        {:else}
            <a href="/auth/42" class="btn btn-square">
                <Icon path={mdiAccountHeartOutline} />
            </a>
        {/if}

        <ToggleMode class="btn-md" defaultMode="dark" />
    </div>
</div>

{@render children()}
