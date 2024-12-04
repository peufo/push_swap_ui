import { createResolver, type Algo } from '$lib/algo'
import { resolve } from './resolve'

export const algoSplit2: Algo = {
    name: 'Split 2',
    resolve: createResolver(resolve),
}
