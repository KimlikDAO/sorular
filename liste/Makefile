build/liste/liste.js: liste/liste.js \
    lib/api/jsonrpc.d.js lib/api/jsonrpc.js \
		lib/crosschain/*.js \
		lib/crypto/sha3.js \
		lib/crypto/modular.js lib/crypto/secp256k1.js \
		lib/ethereum/*.js \
		lib/util/çevir.js
	yarn google-closure-compiler -W VERBOSE -O ADVANCED --charset UTF-8 \
	                             --emit_use_strict \
	                             --module_resolution NODE \
	                             --assume_function_wrapper \
	                             --dependency_mode PRUNE \
	                             --entry_point $< \
	                             --js $^ \
	                             --js_output_file $@
	yarn uglifyjs $@ -m -c toplevel,unsafe -o $@
