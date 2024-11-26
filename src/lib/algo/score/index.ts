import { createResolver, type Algo } from '$lib/algo'
import GraphCandidates from './GraphCandidates.svelte'
import GraphScore from './GraphScore.svelte'
import { resolve } from './resolve'

export * from './resolve'
export const algoScore: Algo = {
    name: 'Score',
    resolve: createResolver(resolve),
    charts: [GraphScore, GraphCandidates],
}
