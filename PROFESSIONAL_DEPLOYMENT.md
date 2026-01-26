# 🚀 Production Deployment Guide

## Overview

This guide covers professional deployment strategies for CogMech Analytics across both **main** and **gh-pages** branches with automated CI/CD using GitHub Actions.

---

## 🏗️ Branch Strategy

### Main Branch (`main`)
- **Purpose:** Source code repository
- **Contains:** All project source files, configuration, and documentation
- **Deployment:** Automatically triggers GitHub Actions on push
- **Protection:** Should be protected with branch rules

### GitHub Pages Branch (`gh-pages`)
- **Purpose:** Production build hosting
- **Contains:** Compiled static files (`dist` folder)
- **Deployment:** Auto-updated by GitHub Actions
- **Managed by:** GitHub Actions workflow (automated)

---

## ⚙️ Automated Deployment Setup

### Step 1: Configure GitHub Repository Settings

1. **Go to Repository Settings:**
   ```
   https://github.com/KshitijGupta2307/human/settings
   ```

2. **Enable GitHub Pages:**
   - Navigate to: **Settings → Pages**
   - Under **"Build and deployment"**:
     - Source: **GitHub Actions** (recommended)
     - This allows the workflow to deploy automatically

3. **Enable Actions (if not already enabled):**
   - Go to: **Settings → Actions → General**
   - Ensure **"Allow all actions and reusable workflows"** is selected
   - Under **Workflow permissions**, select:
     - ✅ **Read and write permissions**
     - ✅ **Allow GitHub Actions to create and approve pull requests**

4. **Add Branch Protection (Optional but Recommended):**
   - Go to: **Settings → Branches**
   - Add rule for `main`:
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging

### Step 2: Configure Firebase

1. **Add Authorized Domains:**
   ```
   Firebase Console → Authentication → Settings → Authorized domains
   ```
   Add:
   - `kshitijgupta2307.github.io`
   - `localhost` (for development)

2. **Verify Security Rules:**
   Ensure Firestore and Storage rules are production-ready (see README.md)

### Step 3: Verify Workflow File

The GitHub Actions workflow is located at:
```
.github/workflows/deploy.yml
```

**Workflow Trigger:**
- Automatically runs on every push to `main` branch
- Can be manually triggered from Actions tab

**What it does:**
1. Checks out the code
2. Sets up Node.js environment
3. Installs dependencies
4. Builds production bundle
5. Deploys to GitHub Pages

---

## 🔄 Deployment Workflow

### Automated Deployment (Recommended)

Every time you push to `main`, the following happens automatically:

```bash
# Make your changes locally
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

**Then automatically:**
1. ✅ GitHub Actions workflow starts
2. ✅ Code is checked out
3. ✅ Dependencies installed
4. ✅ Production build created (`npm run build`)
5. ✅ Built files deployed to `gh-pages` branch
6. ✅ GitHub Pages updated
7. ✅ Site live within 1-2 minutes

**Monitor Deployment:**
- Go to: `https://github.com/KshitijGupta2307/human/actions`
- See real-time deployment progress
- Check for any errors

### Manual Deployment (Fallback)

If automated deployment fails or you need manual control:

```bash
# Option 1: Using npm script
npm run deploy

# Option 2: Using GitHub CLI
npm run build
npx gh-pages -d dist

# Option 3: Manual workflow trigger
# Go to Actions tab → Deploy to GitHub Pages → Run workflow
```

---

## 📊 Deployment Status & Monitoring

### Check Deployment Status

1. **GitHub Actions Tab:**
   ```
   https://github.com/KshitijGupta2307/human/actions
   ```
   - Green ✅ = Successful
   - Red ❌ = Failed (click for logs)
   - Yellow ⚠️ = In Progress

2. **GitHub Pages Status:**
   ```
   https://github.com/KshitijGupta2307/human/settings/pages
   ```
   - Shows current deployment status
   - Displays live URL
   - Shows build history

3. **Live Site:**
   ```
   https://kshitijgupta2307.github.io/human/
   ```
   - Should reflect latest changes within 2-3 minutes
   - Clear browser cache if old version appears

### Deployment Logs

View detailed logs:
1. Go to Actions tab
2. Click on the latest workflow run
3. Expand "build" and "deploy" steps
4. Review console output for errors

---

## 🛠️ Professional Best Practices

### Code Quality Checks (Future Enhancement)

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Run linting
  run: npm run lint

- name: Run tests
  run: npm test
```

### Environment Variables

**For GitHub Actions:**
1. Go to: **Settings → Secrets and variables → Actions**
2. Add repository secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - etc.

**Update workflow to use secrets:**
```yaml
- name: Build
  env:
    VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
  run: npm run build
```

### Versioning Strategy

Use semantic versioning in `package.json`:

```bash
# Patch release (bug fixes)
npm version patch
git push --tags

# Minor release (new features)
npm version minor
git push --tags

# Major release (breaking changes)
npm version major
git push --tags
```

---

## 🔒 Security Checklist

Before going to production:

- [ ] ✅ Firebase security rules are configured
- [ ] ✅ Environment variables are not committed
- [ ] ✅ `.env` is in `.gitignore`
- [ ] ✅ Firebase authorized domains include production URL
- [ ] ✅ HTTPS is enforced (automatic with GitHub Pages)
- [ ] ✅ No sensitive data in client code
- [ ] ✅ Dependencies are up to date (`npm audit`)
- [ ] ✅ Branch protection rules enabled

---

## 📈 Performance Optimization

### Current Build Size

The build produces:
- `index.html`: ~1.17 KB
- `CSS bundle`: ~23 KB (gzipped: ~4.8 KB)
- `JS bundle`: ~820 KB (gzipped: ~216 KB)

### Optimization Tips

1. **Code Splitting:**
   ```javascript
   // Use dynamic imports in vite.config.js
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           firebase: ['firebase/app', 'firebase/auth']
         }
       }
     }
   }
   ```

2. **Image Optimization:**
   - Use WebP format
   - Implement lazy loading
   - Compress images before upload

3. **Caching Strategy:**
   - GitHub Pages automatically caches static assets
   - Use cache-busting via Vite's built-in hashing

---

## 🚨 Troubleshooting Deployment Issues

### Workflow Fails to Run

**Check:**
- Actions are enabled in repository settings
- Workflow file syntax is correct (YAML)
- Branch name matches trigger (`main`)

**Fix:**
```bash
# Validate workflow locally
npm install -g @github/workflow-validator
gh workflow view
```

### Build Fails

**Common Issues:**
1. **Dependencies missing:**
   ```bash
   npm ci  # Use clean install
   ```

2. **Environment variables:**
   - Check fallback values in `src/firebase/config.js`
   - Verify secrets are set in GitHub

3. **Linting errors:**
   ```bash
   npm run lint:fix
   ```

### Deployment Succeeds but Site Shows Old Version

**Solutions:**
1. **Hard refresh browser:** `Ctrl + Shift + R`
2. **Clear cache:** `Ctrl + Shift + Delete`
3. **Wait 3-5 minutes** for CDN propagation
4. **Try incognito mode**
5. **Check different device/network**

### 404 Error on Routes

**Cause:** Client-side routing not configured for GitHub Pages

**Already Fixed:**
- ✅ `404.html` redirect script
- ✅ `.nojekyll` file
- ✅ Router `basename="/human"`

If still occurring:
- Verify `vite.config.js` has correct `base` path
- Check `App.jsx` has correct `basename`

---

## 📝 Deployment Checklist

Before each deployment:

- [ ] Test locally (`npm run dev`)
- [ ] Build succeeds (`npm run build`)
- [ ] Preview build locally (`npm run preview`)
- [ ] No console errors in browser
- [ ] Firebase connection works
- [ ] Authentication flow works
- [ ] All features functional
- [ ] Responsive on mobile
- [ ] Update version in `package.json`
- [ ] Commit with meaningful message
- [ ] Push to main branch
- [ ] Monitor GitHub Actions
- [ ] Verify live site after 2-3 minutes
- [ ] Test from different device/network

---

## 📚 Related Documentation

- [README.md](./README.md) - Complete project documentation
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Step-by-step deployment
- [GITHUB_PAGES_TROUBLESHOOTING.md](./GITHUB_PAGES_TROUBLESHOOTING.md) - Troubleshooting guide
- [SECURITY_ALERT.md](./SECURITY_ALERT.md) - Security considerations

---

## 🎯 Success Metrics

After deployment, verify:

- ✅ GitHub Actions workflow shows green checkmark
- ✅ Site accessible at production URL
- ✅ No 404 errors on refresh
- ✅ Google Sign-In works
- ✅ Firebase data loads correctly
- ✅ All routes work properly
- ✅ Mobile responsive
- ✅ Fast load times (<3 seconds)

---

## 📞 Support

If you encounter deployment issues:

1. Check [GitHub Actions logs](https://github.com/KshitijGupta2307/human/actions)
2. Review [troubleshooting guide](./GITHUB_PAGES_TROUBLESHOOTING.md)
3. Email: [guptakshitij266@gmail.com](mailto:guptakshitij266@gmail.com)

---

**Last Updated:** January 2026  
**Deployment Status:** ✅ Automated via GitHub Actions  
**Live URL:** https://kshitijgupta2307.github.io/human/
