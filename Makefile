
mash:
	@./node_modules/.bin/masher --out ui/_dist --name common masher.yaml

views:
	@./node_modules/.bin/markx -i views/index.html -d data.yaml > index.html

preview:
	@./node_modules/.bin/markx -i views/index.html -d data.yaml -p

build: styles mash views

.PHONY: views mash build preview styles
