npm run build
git push origin --delete gh-pages
git add -f ./dist
git commit -m "deploy"
git subtree push --prefix dist origin gh-pages
git reset HEAD^