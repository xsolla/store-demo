#!/bin/bash

TARGET_DIR="/usr/local/www/static.xsolla.com/htdocs/store-demo"
APP_PATH="$WORKDIR/$VERSION"

ln -svfn "$APP_PATH" "$TARGET_DIR"
