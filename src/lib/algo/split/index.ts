import type { Algo } from '$lib/algo'
import Worker from './worker?worker'

export const algoSplit: Algo = {
    name: 'Split',
    resolve(values) {
        return new Promise((resolve) => {
            const worker = new Worker({ name: 'split resolver' })
            worker.postMessage(values)
            worker.onmessage = ({ data }) => {
                worker.terminate()
                resolve(data)
            }
        })
    },
}
