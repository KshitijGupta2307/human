# 🌐 GitHub Pages Accessibility Troubleshooting

## Quick Check - Is Your Site Live?

**Your site URL:** https://kshitijgupta2307.github.io/human/

### ✅ How to Verify It's Working:

1. **Check GitHub Pages Status:**
   - Go to: https://github.com/KshitijGupta2307/human/settings/pages
   - You should see: **"Your site is live at https://kshitijgupta2307.github.io/human/"**
   - If you see an error or it's not configured, follow Step 1 below

2. **Test from Multiple Devices:**
   - Open in Incognito/Private browsing mode
   - Try from mobile device
   - Try from different network

---

## 🔧 Step-by-Step Fix

### Step 1: Enable GitHub Pages (CRITICAL)

1. Go to your repository: **https://github.com/KshitijGupta2307/human**
2. Click **Settings** tab (top right)
3. Scroll down left sidebar → Click **Pages**
4. Under **"Build and deployment"**:
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `gh-pages` and `/ (root)`
   - Click **Save**
5. Wait 2-3 minutes
6. Refresh the page - you should see a green banner: **"Your site is live at..."**

### Step 2: Add Domain to Firebase (CRITICAL for Login)

1. Go to Firebase Console: https://console.firebase.google.com/project/human-coginitive-science/authentication/settings
2. Scroll to **"Authorized domains"** section
3. Click **"Add domain"**
4. Enter: `kshitijgupta2307.github.io`
5. Click **"Add"**
6. Verify you see it in the list

### Step 3: Verify Deployment

Run this command to check deployment:
```powershell
npm run deploy
```

This will:
- Build your production site
- Push to gh-pages branch
- Make it available within 1-2 minutes

### Step 4: Clear DNS/Browser Cache

**On the computer that can't access the site:**

1. **Clear Browser Cache:**
   - Chrome/Edge: `Ctrl + Shift + Delete` → Clear "Cached images and files"
   - Or use Incognito: `Ctrl + Shift + N`

2. **Flush DNS Cache:**
   ```powershell
   # On Windows (run as Administrator)
   ipconfig /flushdns
   ```

3. **Try Different Browser:**
   - If Chrome doesn't work, try Edge, Firefox, or mobile browser

---

## 🚨 Common Issues & Solutions

### Issue: "404 - Page Not Found"

**Cause:** GitHub Pages not enabled or wrong branch selected

**Solution:**
1. Verify Settings → Pages → Branch is set to `gh-pages`
2. Wait 2-3 minutes after changing settings
3. Visit: https://kshitijgupta2307.github.io/human/ (note the trailing slash)

### Issue: "Blank White Page"

**Cause:** Firebase credentials not loading or JavaScript error

**Solution:**
1. Open browser console (F12 → Console tab)
2. Check for errors
3. If you see Firebase errors, verify authorized domain is added (Step 2)
4. Hard refresh: `Ctrl + Shift + R`

### Issue: "Works on One PC but Not Another"

**Possible Causes:**
- DNS cache on the non-working PC
- Firewall/Antivirus blocking
- Network restrictions (corporate/school network)

**Solutions:**
1. **Flush DNS** (see Step 4)
2. **Try Mobile Hotspot** - If it works on mobile data but not WiFi, it's a network restriction
3. **Check Firewall:**
   - Windows Defender might be blocking
   - Try temporarily disabling to test
4. **Use VPN:** If network is blocking GitHub Pages
5. **Try Different Browser:** Some networks block certain browsers

### Issue: "Login Button Doesn't Work"

**Cause:** Firebase domain not authorized

**Solution:**
1. Add `kshitijgupta2307.github.io` to Firebase authorized domains (Step 2)
2. Wait 1 minute for changes to propagate
3. Clear browser cache and try again

### Issue: "Site Was Working Yesterday but Not Today"

**Cause:** GitHub Pages deployment issue or DNS propagation

**Solution:**
1. Redeploy:
   ```powershell
   npm run deploy
   ```
2. Wait 3-5 minutes
3. Clear browser cache
4. Try accessing again

---

## 📱 Testing from Different Devices

### Desktop (Different Network)
1. Use mobile hotspot OR
2. Visit a café/library with public WiFi
3. Test the URL: https://kshitijgupta2307.github.io/human/

### Mobile Device
1. Open mobile browser (Chrome/Safari)
2. Visit: https://kshitijgupta2307.github.io/human/
3. Should load and work normally

### Different PC on Same Network
1. If it works on PC A but not PC B on same network:
   - Clear DNS cache on PC B
   - Clear browser cache on PC B
   - Try incognito mode

---

## 🔍 Diagnostic Commands

### Check if site is accessible:
```powershell
# Test DNS resolution
nslookup kshitijgupta2307.github.io

# Test connectivity
ping kshitijgupta2307.github.io

# Test HTTP response
curl -I https://kshitijgupta2307.github.io/human/
```

### Verify GitHub Pages deployment:
```powershell
# Check gh-pages branch exists
git ls-remote --heads origin gh-pages

# Redeploy
npm run deploy
```

---

## 🌍 Network-Specific Issues

### Corporate/School Network
- **Problem:** Network administrator may block GitHub Pages
- **Solution:** 
  - Use mobile hotspot
  - Request IT to whitelist `github.io`
  - Use VPN

### Public WiFi (Hotel/Airport)
- **Problem:** Captive portal or restrictions
- **Solution:**
  - Complete WiFi login/registration first
  - Try HTTPS version explicitly: https://kshitijgupta2307.github.io/human/

### ISP Blocking
- **Problem:** Some ISPs block certain domains
- **Solution:**
  - Change DNS to Google DNS (8.8.8.8) or Cloudflare (1.1.1.1)
  - Use VPN
  - Contact ISP

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] GitHub Pages is enabled in repository settings
- [ ] Branch is set to `gh-pages` / `root`
- [ ] Firebase authorized domains includes `kshitijgupta2307.github.io`
- [ ] Latest deployment ran successfully (`npm run deploy`)
- [ ] Waited at least 3 minutes after deployment
- [ ] Cleared browser cache or tried incognito mode
- [ ] Tried different browser
- [ ] Flushed DNS cache
- [ ] Tested from mobile device/different network
- [ ] Checked browser console for errors (F12)

---

## 🆘 If Still Not Working

1. **Check GitHub Status:**
   - Visit: https://www.githubstatus.com/
   - Verify GitHub Pages is operational

2. **Check Repository Visibility:**
   - Go to: https://github.com/KshitijGupta2307/human/settings
   - Ensure repository is **Public** (not Private)
   - GitHub Pages doesn't work on private repos (free tier)

3. **Verify Build Output:**
   - Check if `dist` folder was created: `ls dist`
   - Verify index.html exists: `cat dist/index.html`

4. **Manual Deployment:**
   ```powershell
   # Build
   npm run build
   
   # Deploy
   npx gh-pages -d dist
   ```

---

## 📧 Support

If you've tried everything and it still doesn't work:

**Email:** guptakshitij266@gmail.com

**Include in your email:**
1. Which device/network it's NOT working on
2. Any error messages from browser console (F12)
3. Screenshot of GitHub Pages settings
4. Screenshot of the error you're seeing

---

## 🎯 Expected Result

When everything is working correctly:

1. Visit https://kshitijgupta2307.github.io/human/
2. See the CogMech Analytics login page
3. Click "Sign in with Google"
4. Successfully log in and see your dashboard
5. All this works from any device, any network worldwide
