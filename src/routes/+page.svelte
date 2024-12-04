
<div class="p-10 max-w-5xl mx-auto flex flex-col gap-10">

    <div>
        <a href="/analize" class="btn btn-primary w-full"> Go to analize page </a>
    </div>
    
    <div>
        <div class="py-4">For generate your .wasm, add this to your Makefile : </div>
        <pre class="border p-4 rounded">wasm: 
	docker run --rm -v $(shell pwd):/src emscripten/emsdk emcc $(SOURCES) -o $(NAME).wasm</pre>
    </div>
</div>
