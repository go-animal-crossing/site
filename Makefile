OS = $(shell uname -s)
ARCH = $(shell uname -m)
DOWNLOADER = https://github.com/go-animal-crossing/download/releases/latest/download/download_$(OS)_$(ARCH).tar.gz
CONVERTOR = https://github.com/go-animal-crossing/convert/releases/latest/download/convert_$(OS)_$(ARCH).tar.gz
POSTER = https://github.com/go-animal-crossing/posts/releases/latest/download/posts_$(OS)_$(ARCH).tar.gz
COMPRESSOR = https://github.com/tarampampam/tinifier/releases/download/v3.0.1/tinifier-darwin-amd64

.PHONY: all
all:
	@${MAKE} prep
	@${MAKE} getDownloader
	@${MAKE} getConvertor
	@${MAKE} getPoster
	@${MAKE} getCompressor	
	@${MAKE} runBinarys
	@${MAKE} mover
	@${MAKE} imagecompression
	@${MAKE} generate
	@${MAKE} cleanup


.PHONY: prep
prep:
	rm -Rf ./_site
	mkdir -p ./_site
	rm -Rf ./_posts
	rm -Rf ./_binarys
	rm -Rf ./assets/images
	mkdir -p ./_binarys/downloader/ ./_binarys/convertor/ ./_binarys/poster/ ./_binarys/compressor/
	mkdir -p ./_source
	mkdir -p ./_posts

.PHONY: getDownloader
getDownloader:
	rm -Rf ./_binarys/downloader/*
	curl $(DOWNLOADER) -L  --silent --output "./_binarys/downloader/dl.tar.gz"
	tar xvzf ./_binarys/downloader/dl.tar.gz --directory ./_binarys/downloader/
	chmod +x ./_binarys/downloader/download
	mv ./_binarys/downloader/download .

.PHONY: getConvertor
getConvertor:
	rm -Rf ./_binarys/convertor/*
	curl $(CONVERTOR) -L  --silent --output "./_binarys/convertor/dl.tar.gz"
	tar xvzf ./_binarys/convertor/dl.tar.gz --directory ./_binarys/convertor/
	chmod +x ./_binarys/convertor/convert
	mv ./_binarys/convertor/convert .

.PHONY: getPoster
getPoster:
	rm -Rf ./_binarys/poster/*
	curl $(POSTER) -L  --silent --output "./_binarys/poster/dl.tar.gz"
	tar xvzf ./_binarys/poster/dl.tar.gz --directory ./_binarys/poster/
	chmod +x ./_binarys/poster/posts
	mv ./_binarys/poster/posts .

.PHONY: getCompressor
getCompressor:
	rm -Rf ./_binarys/compressor/*
	curl $(COMPRESSOR) -L  --silent --output "./_binarys/compressor/compressor"
	chmod +x ./_binarys/compressor/compressor
	mv ./_binarys/compressor/compressor .

.PHONY: runBinarys
runBinarys:
	./download
	./convert
	./posts

.PHONY: mover
mover:
	mv -f _source/converted/out.json ./_data/critters.json
	mv -f _source/images ./assets/images
	mv -f _source/posts/*  ./_posts/

.PHONY: imagecompression
imagecompression:
	./compressor compress -k "${TINYPNG_KEY}" -e png -r ./assets/images || true


.PHONY: generate
generate:
	npm run build

.PHONY: cleanup
cleanup:
	rm -Rf ./_binarys
	rm -f ./download ./convert ./posts ./compressor
	rm -Rf ./_source
	rm -Rf ./_posts/*
