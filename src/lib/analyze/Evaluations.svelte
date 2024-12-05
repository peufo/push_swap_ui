<script lang="ts">
    import { onMount, tick } from 'svelte'
    import type { Algo } from '$lib/algo'
    import { createValues, isSequenceOk } from '$lib/analyze'
    import Evaluation from '$lib/visual/Evaluation.svelte'

    const evals: Eval[] = [
        { nbValues: 3, limits: [3] },
        { nbValues: 5, limits: [12] },
        { nbValues: 100, limits: [700, 900, 1100, 1300, 1500] },
        { nbValues: 500, limits: [5500, 7000, 8500, 10000, 11500] },
    ]

    let {
        algo,
        isLoading = $bindable(false),
        nbRuns = 42,
        readOnly = false,
        mode = 'chart',
        onDone = () => {},
    }: {
        algo: Algo
        isLoading?: boolean
        nbRuns?: number
        readOnly?: boolean
        mode?: 'chart' | 'table'
        onDone?: (results: EvalResult[]) => unknown
    } = $props()

    type Eval = {
        nbValues: number
        limits: number[]
    }
    type EvalRun = { nbMoves: number; isOk: boolean; time: number }

    let evalsResults = $state<(EvalResult | null)[]>(evals.map(() => null))

    export type EvalResult = Eval & {
        runs: EvalRun[]
        max: number
        min: number
    }

    onMount(() => {
        if (!readOnly) refresh()
    })

    export async function refresh() {
        isLoading = true
        evalsResults = evals.map(() => null)
        await tick()
        for (let index = 0; index < evals.length; index++) {
            evalsResults[index] = await getEvalResult(evals[index])
            await tick()
        }
        onDone(evalsResults as EvalResult[])
        isLoading = false
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

    {#if !readOnly}
        <div class="flex gap-2 items-end pb-4">
            <label>
                <span class="label-text block"> Number of executions </span>
                <input
                    class="input input-bordered"
                    type="number"
                    disabled={isLoading}
                    bind:value={nbRuns}
                />
            </label>
            <button class="btn" onclick={refresh} disabled={isLoading}>
                Run
            </button>
            <div class="grow"></div>
            <button
                class="btn"
                class:outline={mode === 'chart'}
                onclick={() => (mode = 'chart')}
            >
                Charts
            </button>
            <button
                class="btn"
                class:outline={mode === 'table'}
                onclick={() => (mode = 'table')}
            >
                Table
            </button>
        </div>
    {/if}

    {#if mode === 'chart'}
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-x-6 gap-y-16 p-4">
            {#each evalsResults as results}
                {#if results}
                    <Evaluation {results} />
                {:else}
                    <div class="skeleton w-full h-full"></div>
                {/if}
            {/each}
        </div>
    {:else}
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>Values</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Time [ms]</th>
                    <th>Valid</th>
                </tr>
            </thead>
            <tbody>
                {#each evalsResults as results}
                    {#if results}
                        {@const oks = results.runs.filter((r) => r.isOk)}
                        {@const isOk = oks.length === results.runs.length}
                        <tr>
                            <td>{results.nbValues}</td>
                            <td>{results.min}</td>
                            <td>
                                <b>{results.max}</b>
                            </td>
                            <td>
                                {Math.ceil(
                                    Math.max(...results.runs.map((r) => r.time))
                                )}
                            </td>
                            <td>
                                <span
                                    class:text-error={!isOk}
                                    class:text-success={isOk}
                                >
                                    {oks.length} / {results.runs.length}
                                </span>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5" class="opacity-70 text-center">
                                Loading...
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
    {/if}
</fieldset>
