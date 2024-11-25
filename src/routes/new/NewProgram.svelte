<script lang="ts">
    async function selectProgram() {
        console.log(Module)
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'Web Assembly Push Swap',
                    accept: { 'application/wasm': '.wasm' },
                },
            ],
            multiple: false,
        })
        const file = await fileHandle.getFile()
        const buffer = await file.arrayBuffer()
        const importObject = {
            wasi_snapshot_preview1: {
                imported_func: (arg) => console.log('imported_func', arg),
                args_sizes_get: (arg) => console.log('args_sizes_get', arg),
                args_get: (arg) => console.log('args_get', arg),
                proc_exit: (arg) => console.log('proc_exit', arg),
                fd_write: (arg) => console.log('fd_write', arg),
            },
        }
        const obj = await WebAssembly.instantiate(buffer, importObject)
        const res = obj.instance.exports._start()
        console.log(res)
    }
</script>

<fieldset class="p-4 border rounded border-primary">
    <legend>New Program</legend>

    <button class="btn" onclick={selectProgram}> Import </button>
</fieldset>
