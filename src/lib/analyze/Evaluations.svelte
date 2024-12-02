<script lang="ts">
    import type { Algo } from '$lib/algo'
    import { createValues, isSequenceOk } from '$lib/analyze'
    import Evaluation from '$lib/visual/Evaluation.svelte'

    let { algo }: { algo: Algo } = $props()

    const nbRuns = 10

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

    const evals: Eval[] = [
        { nbValues: 3, limits: [3] },
        { nbValues: 5, limits: [12] },
        { nbValues: 100, limits: [700, 900, 1100, 1300, 1500] },
        { nbValues: 500, limits: [5500, 7000, 8500, 10000, 11500] },
    ]

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

{#each evals as e}
    {@const res = getEvalResult(e)}
    <Evaluation />
{/each}
