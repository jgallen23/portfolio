
build-styles:
	./node_modules/.bin/stylus -o ui/_compressed/ -u ./node_modules/nib/ ui/styles/

build-views:
	./node_modules/.bin/jade < views/index.jade > index.html

build: build-styles build-views

install:
	npm install stylus
	npm install nib
	npm install jade

.PHONY: build-styles install
