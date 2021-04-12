#!/bin/bash
yellow=`tput setaf 3`
reset=`tput sgr0`

# find and kill all processes on port 27017
echo "${yellow}[futbob] Clearing old mongo instance...${reset}"
lsof -ti tcp:27017 | xargs kill
# start mongodb in background on port 27017
echo "${yellow}[futbob] Starting new mongo instance...${reset}"
mongod --fork --port=27017 --logpath ./data/mongod.log --dbpath=./data