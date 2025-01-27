import type { Move } from '$lib/move'

export type AlgoResult = {
    sequence: Move[]
    time: number
    error?: Error
}

export type Resolver = (values: number[]) => Promise<AlgoResult>

export function createResolver(
    resolve: (values: number[]) => Move[] | Promise<Move[]>
): Resolver {
    return async (values: number[]) => {
        let start = performance.now()
        const TIMEOUT = 5
        let timeout = setTimeout(() => {
            throw Error(`Resolve timeout reached (${TIMEOUT} secondes)`)
        }, TIMEOUT * 1000)
        try {
            const sequence = await resolve(values)
            const time = performance.now() - start
            clearTimeout(timeout)
            return { sequence, time }
        } catch (error) {
            clearTimeout(timeout)
            return {
                sequence: [] as Move[],
                time: performance.now() - start,
                error:
                    error instanceof Error ? error : new Error('Unknown error'),
            }
        }
    }
}

export * from './compileWasm'
export * from './algoToResolver'
export { default as NewResolver } from './NewResolver.svelte'
export { default as SelectResolver } from './SelectResolver.svelte'
export { default as CardAlgo } from './CardAlgo.svelte'
