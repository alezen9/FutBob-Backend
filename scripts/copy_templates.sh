echo "Copying templates"
rsync -avum --include='*.ejs' --include='*.css' --include='*.svg' --include='*/' --exclude='*' './src/' './dist'