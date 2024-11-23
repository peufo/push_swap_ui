import type { Algo } from '$lib/algo'
import GraphCandidates from './GraphCandidates.svelte'
import GraphScore from './GraphScore.svelte'
import Worker from './worker?worker'
export * from './resolve'

export const algoScore: Algo = {
    name: 'Score',
    resolve(values) {
        return new Promise((resolve) => {
            const worker = new Worker()
            worker.postMessage(values)
            worker.onmessage = ({ data }) => {
                worker.terminate()
                resolve(data)
            }
        })
    },
    charts: [GraphScore, GraphCandidates],
}
