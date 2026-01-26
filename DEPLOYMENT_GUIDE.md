# 🚀 GitHub Pages Deployment Guide

## Current Deployment Status

✅ **Site URL**: https://kshitijgupta2307.github.io/human/  
✅ **Repository**: https://github.com/KshitijGupta2307/human  
✅ **Branch**: `gh-pages` (auto-deployed)

---

## How to Verify GitHub Pages is Working

### Step 1: Check GitHub Pages Settings

1. Go to your repository: https://github.com/KshitijGupta2307/human
2. Click **Settings** (top menu)
3. Scroll down and click **Pages** (left sidebar)
4. Verify these settings:
   - **Source**: Deploy from a branch
   - **Branch**: `gh-pages` / `root`
   - **Custom domain**: (leave empty)

### Step 2: Wait for Deployment

After running `npm run deploy`, GitHub Pages takes **1-5 minutes** to update. You'll see a message like:
```
✅ Your site is live at https://kshitijgupta2307.github.io/human/
```

### Step 3: Clear Browser Cache

GitHub Pages and browsers cache aggressively:

**Chrome/Edge:**
- Press `Ctrl + Shift + Delete`
- Select "Cached images and files"
- Click "Clear data"
- Or use **Hard Refresh**: `Ctrl + Shift + R`

**Or use Incognito/Private mode:**
- `Ctrl + Shift + N` (Chrome/Edge)
- `Ctrl + Shift + P` (Firefox)

---

## How to Deploy Updates

Whenever you make changes to your code:

```powershell
# Deploy to GitHub Pages
npm run deploy

# This does:
# 1. npm run build (creates production build in /dist)
# 2. gh-pages -d dist (pushes dist folder to gh-pages branch)

# Then commit your source code
git add .
git commit -m "Your commit message"
git push
```

---

## Common Issues & Solutions

### Issue 1: "Site not loading" or "Blank page"

**Solution:**
1. Check browser console for errors (`F12` → Console tab)
2. Verify you're visiting the correct URL: https://kshitijgupta2307.github.io/human/ (with `/human/` at the end)
3. Clear cache and hard refresh (`Ctrl + Shift + R`)
4. Wait 2-3 minutes after deployment

### Issue 2: "Routes not working" (404 on refresh)

**Solution:**
✅ Already fixed with:
- `404.html` redirect script
- `.nojekyll` file
- Router basename="/human"

### Issue 3: "Firebase not connecting"

**Solution:**
✅ Already fixed with fallback credentials in `config.js`

If still not working, check Firebase Console:
1. Go to https://console.firebase.google.com/project/human-coginitive-science
2. Check **Authentication** → **Sign-in method** → Ensure Google is enabled
3. Add authorized domain: `kshitijgupta2307.github.io`

### Issue 4: "Old version showing"

**Solution:**
```powershell
# Rebuild and force deploy
npm run deploy

# Check deployment
git ls-remote --heads origin
# Should show updated gh-pages branch
```

---

## Testing Locally Before Deploying

```powershell
# Build production version
npm run build

# Preview production build locally
npm run preview

# Opens at: http://localhost:4173/human/
# Test everything works before deploying
```

---

## Project Structure

```
├── src/               # Source code
├── dist/              # Production build (auto-generated)
├── public/            # Static assets
│   ├── .nojekyll      # Tells GitHub Pages to not use Jekyll
│   └── 404.html       # Handles client-side routing
├── vite.config.js     # base: '/human/' for GitHub Pages
└── package.json       # deploy script
```

---

## Deployment Checklist

Before deploying, ensure:

- [ ] Code builds without errors: `npm run build`
- [ ] Firebase credentials are in config
- [ ] `.env` file exists locally (not committed)
- [ ] Router has correct basename
- [ ] vite.config.js has correct base path
- [ ] Test locally with `npm run preview`
- [ ] Run `npm run deploy`
- [ ] Wait 2-3 minutes
- [ ] Clear browser cache
- [ ] Test on incognito mode

---

## Quick Deploy Command

```powershell
# One-line deploy (builds, deploys, commits)
npm run deploy; git add .; git commit -m "Update deployment"; git push
```

---

## Monitoring Deployment

Check deployment status:
1. Go to: https://github.com/KshitijGupta2307/human/deployments
2. Or check Actions tab for any errors

---

## Contact & Support

📧 **Email**: guptakshitij266@gmail.com

If the site is still not working after following all steps:
1. Check browser console for specific errors
2. Verify GitHub Pages is enabled in repository settings
3. Ensure the gh-pages branch exists and has recent commits
4. Try accessing from different browser/device
5. Check Firebase Console for authentication errors
