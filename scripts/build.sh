#!/bin/bash
yellow=`tput setaf 3`
reset=`tput sgr0`

# install packages
echo "${yellow}[futbob] Installing packages...${reset}"
npm i
# compile typescript
echo "${yellow}[futbob] Transpiling...${reset}"
tsc
# copy ejs templates
echo "${yellow}[futbob] Copying templates...${reset}"
rsync -avum --include='*.ejs' --include='*/' --exclude='*' './src/' './dist/src'
# copy public dir
rsync -avum --include='*' './public/' './dist/public'