<div class="p-10 max-w-5xl mx-auto flex flex-col gap-10">
    <div>
        <a href="/analyze" class="btn btn-primary w-full">
            Go to analyze page
        </a>
    </div>

    <div>
        <div class="py-4">
            For generate your .wasm, add and adapt this to your Makefile :
        </div>
        <pre class="border p-4 rounded overflow-auto">wasm: 
	docker run --rm -v $(shell pwd):/src emscripten/emsdk emcc $(SOURCES) -o $(NAME).wasm</pre>
    </div>
</div>
