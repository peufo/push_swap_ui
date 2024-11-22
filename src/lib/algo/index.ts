import type { Move, Stack } from '$lib/move'
import { algoScore } from './score'

export type Sequence = Move[]

export type Algo = {
    name: string
    resolve: (values: number[]) => Promise<Sequence>
}

export const algos = [
    algoScore
] satisfies Algo[]