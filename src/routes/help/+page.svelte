<div class="p-10 max-w-2xl mx-auto">
    <p class="py-4">
        To compile your source code in
        <a
            href="https://developer.mozilla.org/en-US/docs/WebAssembly"
            target="_blank"
            class="link"
        >
            WebAssembly
        </a>, you need
        <a href="https://emscripten.org/" target="_blank" class="link">
            the emscripten sdk
        </a>. The quickest way to use it is to use
        <a
            href="https://hub.docker.com/r/emscripten/emsdk"
            target="_blank"
            class="link"
        >
            their docker image
        </a>.<br />
        You can add and adapt the following command to your makefile :
    </p>

    <p>Makefile</p>
    <pre class="border px-4 py-2 rounded overflow-auto">wasm: 
	docker run --rm -v $(shell pwd):/src emscripten/emsdk emcc $(SOURCES) -o $(NAME).wasm</pre>

    <p class="pb-4 pt-8">
        Tipically, if you include your libft, you can simply add it with
        <span class="rounded-sm bg-base-200 px-2 text-sm">lib/libft/*.c</span>.
    </p>
</div>
