
styles:
	./node_modules/.bin/stylus -o ui/_compressed/ -u ./node_modules/nib/ ui/styles/common.styl

views:
	./node_modules/.bin/js-yaml -j data.yaml > /tmp/data.json
	./node_modules/.bin/jade -o /tmp/data.json < views/index.jade > index.html

build: styles views

install:
	npm install stylus
	npm install nib
	npm install jade

.PHONY: views styles install
