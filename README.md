# 328T628T Starter Repo

Starter template for class projects using Vite, vanilla JS, and CSS.

## What this repo is for

- Build your project locally with Vite.
- Publish your project manually to GitHub Pages.
- Share your live URL for review.

## Requirements

- Node.js 18+ (or newer LTS)
- npm
- A GitHub account

## 0. Install node.js and npm

1. Install [node.js](https://nodejs.org/en/download). Make sure you don't click any boxes or buttons to omit npm.
  - Alternatively, Mac users can run the following in a terminal instance:

```bash
brew install node
```

2. Open a terminal (Mac) or Powershell (PC) instance.
3. Run the following commands, one at a time:

```bash
node -v
npm -v
```

Make sure you get a version number of some kind.

## 1. Fork this repo

1. Click **Use This Template > Create a new repository** in the top right of this GitHub repo. *Do not edit this repo in codespaces*.
2. Make sure you have `Include all branches` turned ON.

## 2. Clone and run locally

You'll need to run the following two lines if you're working in a local IDE.

```bash
git clone https://github.com/<your-username>/<your-fork-repo>.git
cd <your-fork-repo>
```

Whether you're on your local machine or in codespaces, you'll then run these three lines:

```bash
npm install
nvm use
npm run dev
```

Open the local URL shown in your terminal (usually http://localhost:5173). You can `Ctrl + Click` (PC)/`Cmd + Click` (Mac) on the link in the terminal, as well.

## 3. One-time setup for GitHub Pages (manual deploy)

In your fork on GitHub:

- Go to Settings -> Pages.
- Under Build and deployment:
- Source: Deploy from a branch
- Branch: main
- Folder: /docs
- Click Save.

## 4. Make sure Vite builds for subfolders

Your vite.config.js should include:

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
})
```

This prevents broken JS/CSS paths on GitHub Pages in forks.

## 5. Publish to Pages manually (every time you want to deploy)

After making code changes:

```bash
npm run build
rm -rf docs
cp -R dist docs
touch docs/.nojekyll
git add docs
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Then wait about 1-2 minutes and refresh your Pages URL. You may use GitHub Desktop instead of command line git if you wish.

## 6. Your Live Site URL

Your site is typically:

https://<your-username>.github.io/<your-fork-repo>/

Find the exact URL in Settings -> Pages.

## 7. Class submission checklist

Submit both:

- Your fork repository URL
- Your live GitHub Pages URL

## Troubleshooting

### Page is blank or assets 404

- Confirm vite.config.js uses base: './'.
- Rebuild and redeploy with the commands above.
- Hard refresh browser (Cmd+Shift+R on macOS).

### Old version still showing 

- Wait another minute.
- Hard refresh.
- Confirm latest commit includes updated docs/ files.

### Pages not updating

- Check Settings -> Pages is set to main + /docs.
- Confirm you pushed to main.
