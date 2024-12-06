<script lang="ts">
    import { mdiAccountHeartOutline, mdiPlus } from '@mdi/js'
    import { ToggleMode, Icon } from 'fuma/ui'
    import { mode } from 'mode-watcher'
    import { Toaster } from 'svelte-sonner'
    import '../app.css'

    let { children, data } = $props()
</script>

<Toaster theme={$mode} />

<div
    class="flex gap-2 border-b shadow-md items-center p-1 pl-4 bordered sticky top-0 bg-base-100 z-10"
>
    <a href="/">
        <h2 class="text-2xl text-primary">push_swap_ui</h2>
    </a>

    <div class="grow"></div>

    {#if data.user}
        <a href="/new" class="btn btn-primary btn-outline group">
            <Icon
                path={mdiPlus}
                class="fill-primary group-hover:fill-base-100"
            />
            <span>new algorithm</span>
        </a>
        <a href="/me" class="btn gap-3 pr-0 overflow-hidden">
            <div>{data.user.login}</div>
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

{@render children()}
