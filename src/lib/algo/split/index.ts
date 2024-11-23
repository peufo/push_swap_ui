import type { Algo } from '$lib/algo'
import ResolveWorker from './resolve?worker'

export const algoSplit: Algo = {
    name: 'Split',
    resolve(values) {
        return new Promise((resolve) => {
            const worker = new ResolveWorker()
            worker.postMessage(values)
            worker.onmessage = (event) => {
                console.log(event)
                resolve(['pa'])
            }
        })
    },
}
