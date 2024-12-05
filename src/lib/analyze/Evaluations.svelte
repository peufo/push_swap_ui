<script lang="ts">
    import { onMount, tick } from 'svelte'

    import type { Algo } from '$lib/algo'
    import { createValues, isSequenceOk } from '$lib/analyze'
    import Evaluation from '$lib/visual/Evaluation.svelte'

    let { algo }: { algo: Algo } = $props()

    const evals: Eval[] = [
        { nbValues: 3, limits: [3] },
        { nbValues: 5, limits: [12] },
        { nbValues: 100, limits: [700, 900, 1100, 1300, 1500] },
        { nbValues: 500, limits: [5500, 7000, 8500, 10000, 11500] },
    ]
    let evalsResults = $state<(EvalResult | null)[]>(evals.map(() => null))
    let nbRuns = $state(42)

    type Eval = {
        nbValues: number
        limits: number[]
    }
    type EvalRun = { nbMoves: number; isOk: boolean; time: number }
    export type EvalResult = Eval & {
        runs: EvalRun[]
        max: number
        min: number
    }

    onMount(() => refresh())

    async function refresh() {
        evalsResults = evals.map(() => null)
        await tick()
        for (let index = 0; index < evals.length; index++) {
            evalsResults[index] = await getEvalResult(evals[index])
            await tick()
        }
    }

    async function getEvalResult({
        nbValues,
        limits,
    }: Eval): Promise<EvalResult> {
        const runs: EvalRun[] = []
        for (let index = 0; index < nbRuns; index++) {
            const values = createValues(nbValues)
            const res = await algo.resolve(values)
            if (res.error) {
                console.log(res.error)
                continue
            }
            runs.push({
                isOk: isSequenceOk({ values, cursor: 0 }, res.sequence),
                nbMoves: res.sequence.length,
                time: res.time,
            })
        }
        const nbMoves = runs.map((r) => r.nbMoves)
        return {
            nbValues,
            limits,
            runs,
            min: Math.min(...nbMoves),
            max: Math.max(...nbMoves),
        }
    }
</script>

<fieldset class="p-4 border rounded">
    <legend class="px-1">Evaluation</legend>

    <div class="flex gap-2 items-end px-10">
        <label>
            <span class="label-text block"> Number of executions </span>
            <input
                class="input input-bordered"
                type="number"
                bind:value={nbRuns}
            />
        </label>
        <button class="btn" onclick={refresh}>Run</button>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-16 p-4">
        {#each evalsResults as results}
            {#if results}
                <Evaluation {results} />
            {:else}
                <div class="skeleton w-full h-full"></div>
            {/if}
        {/each}
    </div>
</fieldset>
