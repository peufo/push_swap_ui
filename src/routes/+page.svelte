<script lang="ts">
    import { CardAlgo } from '$lib'

    let { data } = $props()
</script>

<div class="flex flex-col gap-6 max-w-lg mx-auto my-10">
    <div class="flex gap-2 items-end">
        <h2 class="text-2xl">Algorithms</h2>
        <div class="grow"></div>
        <!-- TODO: tri par score -->
    </div>

    {#each data.algos as algo}
        <CardAlgo {algo} />
    {:else}
        <div class="h-20 bg-base-200 grid place-content-center rounded-xl">
            <span class="opacity-70">No items</span>
        </div>
    {/each}
</div>
