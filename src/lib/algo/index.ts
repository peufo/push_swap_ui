import type { Move } from '$lib/move'
import { algoScore } from './score'
import { algoExec } from './exec'

export type Sequence = Move[]

export type Algo = {
    name: string
    resolve: (values: number[]) => Promise<Sequence>
}

export const algos = [
    algoScore,
    algoExec
] satisfies Algo[]