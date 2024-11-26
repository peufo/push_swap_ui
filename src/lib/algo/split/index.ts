import { createResolver, type Algo } from '$lib/algo'
import { resolve } from './resolve'

export const algoSplit: Algo = {
    name: 'Split',
    resolve: createResolver(resolve),
}
