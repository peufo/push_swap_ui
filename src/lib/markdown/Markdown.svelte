<script lang="ts">
    import { Carta, MarkdownEditor } from 'carta-md'
    import 'carta-md/default.css'
    import DOMPurify from 'isomorphic-dompurify'
    import './github.scss'
    import { code } from '@cartamd/plugin-code'

    let { value = $bindable() }: { value: string } = $props()
    const carta = new Carta({
        sanitizer: DOMPurify.sanitize,
        extensions: [code({})],
    })
</script>

<MarkdownEditor {carta} bind:value theme="github" />
