<script lang="ts">
    import { Carta, MarkdownEditor } from 'carta-md'
    import { code } from '@cartamd/plugin-code'
    import DOMPurify from 'isomorphic-dompurify'
    import 'carta-md/default.css'
    import './github.scss'

    let { value = $bindable() }: { value: string } = $props()
    const carta = new Carta({
        sanitizer: DOMPurify.sanitize,
        extensions: [code({})],
    })
</script>

<MarkdownEditor {carta} bind:value theme="github" />
