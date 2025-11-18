<script lang="ts" module>
    import { Carta, Markdown } from 'carta-md'
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
    let { value }: { value: string } = $props()
</script>

<Markdown {carta} {value} theme="github" />
