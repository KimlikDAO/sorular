include liste/Makefile

list-run: build/liste/liste.js
	node $^

clean:
	rm -rf build

.PHONY: list-run clean
