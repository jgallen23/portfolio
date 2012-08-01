
mash:
	./node_modules/.bin/masher masher.yaml

views:
	./node_modules/.bin/markx -i views/index.html -d data.yaml > index.html

preview:
	./node_modules/.bin/markx -i views/index.html -d data.yaml -p

build: styles views

.PHONY: views mash build preview
