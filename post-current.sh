#!/bin/bash

TARGET_DIR="/usr/local/www/static.xsolla.com/htdocs/store-demo"

echo $VERSION

ln -svfn "$VERSION" "$TARGET_DIR"
