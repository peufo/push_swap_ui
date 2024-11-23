self.onmessage = function ({ data }) {
    console.log('ON WORKER', data)
    self.postMessage('HELLO')
}
