<script lang="ts">
    import { Carta, Markdown } from 'carta-md'
    import { code } from '@cartamd/plugin-code'
    import DOMPurify from 'isomorphic-dompurify'
    import 'carta-md/default.css'
    import './github.scss'

    let { value }: { value: string } = $props()

    const carta = new Carta({
        sanitizer: DOMPurify.sanitize,
        extensions: [code({})],
    })
</script>

<Markdown {carta} {value} theme="github" />
