<script lang="ts">
    import '../app.css'
    let { children } = $props()
</script>

<div class="flex border-b shadow-md">
    <a href="/">
        <h2 class="p-4 text-2xl text-indigo-500">PUSH SWAP UI</h2>
    </a>
</div>

{@render children()}
