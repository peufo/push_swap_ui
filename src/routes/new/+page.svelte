<script lang="ts">
    import { Form, FormControl, InputText } from 'fuma'
    import { modelAlgorithm } from '$lib'
    import { Markdown } from '$lib/markdown'

    let description = $state('')
</script>

<div class="max-w-lg mx-auto my-10">
    <h1 class="text-2xl">New algorithm</h1>

    <Form action="/new?algo" model={modelAlgorithm}>
        <InputText key="name" label="Name" input={{ autocomplete: 'off' }} />
        <FormControl key="description" label="Description">
            <Markdown bind:value={description} />
            <input type="hidden" name="description" value={description} />
        </FormControl>
    </Form>
</div>
