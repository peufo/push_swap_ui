import type { Move, Stack } from '$lib/move'
import { algoSplit } from './split'
import { algoScore } from './score'
import { algoExec } from './exec'
import type { Component } from 'svelte'

export type Sequence = Move[]

export type Algo = {
    name: string
    resolve: (values: number[]) => Promise<Sequence>
    charts?: Component<{ stack: Stack }>[]
}

export const algos = [algoSplit, algoScore, algoExec] satisfies Algo[]
