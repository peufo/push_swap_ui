<script lang="ts">
    import { enhance } from '$app/forms'
    import { Icon } from 'fuma'
    import { CardAlgo } from '$lib'
    import { mdiPlus } from '@mdi/js'

    export let data
</script>

<div class="flex flex-col gap-6 max-w-lg mx-auto my-10">
    <div class="flex gap-2 items-end">
        <h2 class="text-2xl">
            {data.user.displayname.split(' ')[0]}'s algorithms
        </h2>
        <div class="grow"></div>
        <form action="/me?/logout" use:enhance method="post" class="contents">
            <button class="btn btn-ghost btn-sm mt-2">logout</button>
        </form>
    </div>

    {#each data.algos as algo}
        <CardAlgo {algo} />
    {:else}
        <a href="/new" class="btn btn-primary btn-outline group">
            <Icon
                path={mdiPlus}
                class="fill-primary group-hover:fill-base-100"
            />
            <span>new algorithm</span>
        </a>
    {/each}
</div>
