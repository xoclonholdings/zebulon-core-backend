#!/bin/bash

set -e

echo "Checking for .gitmodules file..."
if [ -f .gitmodules ]; then
    echo ".gitmodules exists. Checking for apps/zed submodule entry..."
    if grep -q '\[submodule "apps/zed"\]' .gitmodules; then
        echo "apps/zed submodule entry found."
        url=$(grep -A2 '\[submodule "apps/zed"\]' .gitmodules | grep 'url =' | awk -F'= ' '{print $2}')
        if [ -z "$url" ]; then
            echo "URL for apps/zed is missing. Updating to https://github.com/xoclonholdings/zed.git..."
            sed -i '/\[submodule "apps\/zed"\]/,/^$/s|url =.*|url = https://github.com/xoclonholdings/zed.git|' .gitmodules
        else
            echo "URL for apps/zed is present: $url"
        fi
    else
        echo "apps/zed submodule entry not found. Adding entry..."
        echo -e '\n[submodule "apps/zed"]\n\tpath = apps/zed\n\turl = https://github.com/xoclonholdings/zed.git' >> .gitmodules
    fi
else
    echo ".gitmodules does not exist. Creating with apps/zed entry..."
    echo -e '[submodule "apps/zed"]\n\tpath = apps/zed\n\turl = https://github.com/xoclonholdings/zed.git' > .gitmodules
fi

echo "Syncing submodule configuration..."
git submodule sync

echo "Staging and committing changes..."
git add .gitmodules
git commit -m "Fix submodule URL for apps/zed" || echo "No changes to commit."

echo "Pushing to current branch..."
git push

echo "Initializing and updating submodule..."
git submodule update --init --recursive

echo "Submodule fix complete. Status:"
git submodule status

echo "Done."
