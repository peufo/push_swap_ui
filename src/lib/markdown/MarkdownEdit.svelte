<script lang="ts" module>
    import { Carta, MarkdownEditor } from 'carta-md'
    import { code } from '@cartamd/plugin-code'
    import DOMPurify from 'isomorphic-dompurify'
    import 'carta-md/default.css'
    import './github.scss'

    const carta = new Carta({
        sanitizer: DOMPurify.sanitize,
        extensions: [code({})],
    })
</script>

<script lang="ts">
    let { value = $bindable() }: { value: string } = $props()
</script>

<MarkdownEditor {carta} bind:value theme="github" />
