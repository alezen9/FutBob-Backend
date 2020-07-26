#!/bin/bash
# find and kill all processes on port 27017
lsof -ti tcp:27017 | xargs kill
# start mongodb in background on port 27017
mongod --fork --port=27017 --logpath ./data/mongod.log --dbpath=./data
# compile typescript
tsc
# start server with nodemon
nodemon dist/index.js