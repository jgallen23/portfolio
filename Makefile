
build:
	@git fetch origin
	@git checkout origin/master ui/_dist
	@git checkout origin/master ui/images
	@git checkout origin/master index.html

.PHONY: build
