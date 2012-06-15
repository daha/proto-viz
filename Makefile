all: \
	proto-viz.v0.js

.INTERMEDIATE proto-viz.v0.js: \
    src/start.js \
    src/protoViz.js \
    src/packet.js \
    src/window.js \
    src/end.js

proto-viz%.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a-w $@

clean:
	rm -f proto-viz*.js
