.PHONY: all clean demo

JS_INPUT_PATH := src/index.js
JS_OUTPUT_PATH := line-chart.js

DEMO_INPUT_PATH := src/demo.js
DEMO_OUTPUT_PATH := demo/index.js

all: $(JS_OUTPUT_PATH) $(DEMO_OUTPUT_PATH)

$(JS_OUTPUT_PATH):
	browserify \
		--standalone line-chart \
		--external react \
		--debug \
		--entry $(JS_INPUT_PATH) \
		--outfile $(JS_OUTPUT_PATH) \
		--verbose \
		--transform [ babelify --presets [ es2015 react ] ]

$(DEMO_OUTPUT_PATH):
	browserify \
		--debug \
		--entry $(DEMO_INPUT_PATH) \
		--outfile $(DEMO_OUTPUT_PATH) \
		--verbose \
		--transform [ babelify --presets [ es2015 react ] ]

demo: $(DEMO_OUTPUT_PATH)

clean:
	rm -rf $(JS_OUTPUT_PATH)
	rm -rf $(DEMO_OUTPUT_PATH)
