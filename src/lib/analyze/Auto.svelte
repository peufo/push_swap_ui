<script lang="ts">
    import { linearRegression } from 'simple-statistics'
    import type { Algo } from '$lib/algo'
    import { AnalyzeAutoResults } from '$lib/visual'
    import { isSequenceOk } from './isSequenceOk'

    let { algo }: { algo: Algo } = $props()

    let results = $state<TestResult[]>([])
    let regression = $derived(
        linearRegression(results.map((r) => [r.nbValues, r.nbMoves]))
    )
    export type TestResult = {
        nbValues: number
        nbMoves: number
        time: number
        isOk: boolean
    }

    async function runTests(factor: number) {
        const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        const testsParam: number[] = digits.map((d) => d * factor)
        const len = testsParam.length
        results = []
        for (let index = 0; index < len; index++) {
            results[index] = await runTest(testsParam[index])
        }
    }

    function createValues(nb: number): number[] {
        if (nb < 1) return []
        const numbers = Array(nb)
            .fill(1)
            .map(() => Math.random())
        const sorted = numbers.toSorted()
        return numbers.map((n, i) => sorted.indexOf(n))
    }

    async function runTest(nb: number): Promise<TestResult> {
        const values = createValues(nb)
        const res = await algo.resolve(values)
        const isOk = isSequenceOk({ values, cursor: 0 }, res.sequence)
        return {
            nbValues: values.length,
            nbMoves: res.sequence.length,
            time: res.time,
            isOk,
        }
    }
</script>

<div>
    <div class="flex gap-2 items-center">
        <button class="btn" onclick={() => runTests(1)}>Run (10)</button>
        <button class="btn" onclick={() => runTests(10)}>Run (100)</button>
        <button class="btn" onclick={() => runTests(100)}>Run (1000)</button>
        <button class="btn" onclick={() => runTests(1000)}>Run (10000)</button>

        <div class="ml-auto">
            Score: <b>
                {regression.m.toFixed(2)}
            </b>
        </div>
    </div>
    <AnalyzeAutoResults {results} />
</div>
