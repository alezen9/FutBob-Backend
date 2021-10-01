#!/bin/bash
yellow=`tput setaf 3`
reset=`tput sgr0`

# install packages
echo "${yellow}[futbob] Installing packages...${reset}"
yarn
# compile typescript
echo "${yellow}[futbob] Transpiling...${reset}"
tsc
# copy ejs templates
echo "${yellow}[futbob] Copying templates...${reset}"
rsync -avum --include='*.ejs' --include='*/' --exclude='*' './src/' './dist/src'
# copy public dir
rsync -avum --include='*' './public/' './dist/public'
# start server with pm2
echo "${yellow}[futbob] Starting app...${reset}"
pm2 start dist/index.js
# save pm2 snapshot
echo "${yellow}[futbob] Saving pm2 snapshot...${reset}"
pm2 save