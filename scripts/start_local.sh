#!/bin/bash
yellow=`tput setaf 3`
reset=`tput sgr0`
MONGO_SCRIPT_PATH="./scripts/start_mongo.sh"


# # find and kill all processes on port 27017
# echo "${yellow}- Clearing old mongo instance...${reset}"
# lsof -ti tcp:27017 | xargs kill
# # start mongodb in background on port 27017
# echo "${yellow}- Starting new mongo instance...${reset}"
# mongod --fork --port=27017 --logpath ./data/mongod.log --dbpath=./data


# mongo
$MONGO_SCRIPT_PATH
# compile typescript
echo "${yellow}[futbob] Transpiling...${reset}"
tsc
# copy ejs templates
echo "${yellow}[futbob] Copying templates...${reset}"
rsync -avum --include='*.ejs' --include='*/' --exclude='*' './src/' './dist/src'
# copy public dir
rsync -avum --include='*' './public/' './dist/public'
# start server with nodemon
echo "${yellow}[futbob] Starting app...${reset}"
nodemon dist/index.js