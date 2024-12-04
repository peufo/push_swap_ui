<script lang="ts">
    import { enhance } from '$app/forms'
    import { Login } from 'fuma'

    export let data
</script>

<div class="grid h-screen place-content-center">
    {#if data.user}
        <div class="text-center">
            <div class="title rounded bg-base-200/40 px-6 py-2">
                Hey {data.user.username} 👋
            </div>
            <form
                action="/auth?/logout"
                use:enhance
                method="post"
                class="contents"
            >
                <button class="btn btn-ghost btn-xs mt-2">logout</button>
            </form>
        </div>
    {:else}
        <Login />
    {/if}
</div>
