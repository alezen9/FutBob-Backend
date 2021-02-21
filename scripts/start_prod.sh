#!/bin/bash
# compile typescript
tsc
# copy ejs templates
rsync -avum --include='*.ejs' --include='*/' --exclude='*' './src/' './dist/src'
# copy public dir
rsync -avum --include='*' './public/' './dist/public'
# start server with pm2
pm2 start dist/index.js