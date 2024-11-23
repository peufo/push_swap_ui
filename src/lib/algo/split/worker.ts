import { resolve } from './resolve'

self.onmessage = function ({ data }) {
    const values = data as number[]
    const result = resolve(values)
    self.postMessage(result)
}
