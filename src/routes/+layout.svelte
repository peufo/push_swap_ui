<script lang="ts">
    import '../app.css'
    import { ToggleMode } from '$lib/material'

    let { children } = $props()
</script>

<div class="flex border-b shadow-md items-center px-4 py-2">
    <a href="/">
        <h2 class="text-2xl text-indigo-500">PUSH SWAP UI</h2>
    </a>

    <div class="ml-auto">
        <ToggleMode />
    </div>
</div>

{@render children()}
