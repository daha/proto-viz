JS_COMPILER = ./assets/UglifyJS/bin/uglifyjs

all: \
    proto-viz.v0.js \
    proto-viz.v0.min.js

.INTERMEDIATE proto-viz.v0.js: \
    src/start.js \
    src/protoViz.js \
    src/packet.js \
    src/window.js \
    src/end.js

%.min.js: %.js Makefile
	@rm -f $@
	$(JS_COMPILER) < $< > $@
	@sed -i '1i\
// Copyright (c) 2012, David Haglund, license https://github.com/daha/proto-viz/blob/master/LICENSE' $@

proto-viz%.js: Makefile
	@rm -f $@
	cat $(filter %.js,$^) > $@
	@chmod a-w $@

clean:
	rm -f proto-viz*.js
