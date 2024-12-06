<script lang="ts">
    import { Form, FormControl, InputText } from 'fuma'
    import { MarkdownEdit } from '$lib/markdown'
    import { modelAlgorithmUpdate } from '$lib'

    let { data } = $props()

    let description = $state(data.algo.description)
</script>

<div class="max-w-lg mx-auto my-10">
    <h1 class="text-2xl pb-6">Edit algorithm</h1>

    <Form action="?/algo" model={modelAlgorithmUpdate} data={data.algo}>
        <InputText
            key="name"
            label="Name"
            input={{ autocomplete: 'off' }}
            value={data.algo.name}
        />
        <FormControl key="description" label="Description">
            <MarkdownEdit bind:value={description} />
            <input type="hidden" name="description" value={description} />
        </FormControl>
        <InputText
            key="repository"
            label="Repository"
            value={data.algo.repository}
            input={{ placeholder: 'https://github.com/peufo/42_push_swap' }}
        />
    </Form>
</div>
