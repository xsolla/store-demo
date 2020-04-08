#!/bin/bash

TARGET_DIR="/usr/local/www-usa/livedemo.xsolla.com/htdocs/store-demo-$VERSION"
APP_PATH="$WORKDIR/$VERSION"

ln -svfn "$APP_PATH" "$TARGET_DIR"
