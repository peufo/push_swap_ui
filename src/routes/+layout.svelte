<script lang="ts">
    import { mdiAccountHeartOutline } from '@mdi/js'
    import { ToggleMode, Icon } from 'fuma/ui'
    import '../app.css'

    let { children, data } = $props()
</script>

<div class="flex gap-1 border-b shadow-md items-center p-1 pl-4">
    <a href="/">
        <h2 class="text-2xl text-primary">push_swap_ui</h2>
    </a>

    <div class="grow"></div>
    {#if data.user}
        <a
            href="/me"
            class="btn btn-square grid place-content-center overflow-hidden"
        >
            <img src={data.user.imageSmall} alt="user avatar" />
        </a>
    {:else}
        <a href="/auth/42" class="btn btn-square">
            <Icon path={mdiAccountHeartOutline} />
        </a>
    {/if}

    <ToggleMode class="btn-md" />
</div>

{@render children()}
