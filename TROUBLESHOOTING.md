# 🔧 Troubleshooting Guide - CogMech Analytics

Common issues and their solutions.

---

## 🚨 Installation Issues

### Problem: "npm: command not found"
**Cause**: Node.js is not installed.

**Solution**:
1. Download Node.js from https://nodejs.org/
2. Install with default settings
3. Restart PowerShell
4. Verify: `node --version`

---

### Problem: "npm install" fails
**Possible causes**: Network issues, permissions, or corrupted cache.

**Solution**:
```powershell
# Clear npm cache
npm cache clean --force

# Delete existing modules
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

---

## 🔥 Firebase Issues

### Problem: "Firebase: Error (auth/unauthorized-domain)"
**Cause**: Your domain is not authorized in Firebase.

**Solution**:
1. Go to Firebase Console → Authentication
2. Click "Settings" tab
3. Scroll to "Authorized domains"
4. Add `localhost` and your production domain
5. Try logging in again

---

### Problem: "Permission denied" when accessing Firestore
**Cause**: Security rules are blocking access.

**Solution**:
1. Check if you're signed in
2. Verify Firestore rules in Firebase Console
3. Ensure rules match content in `firestore.rules` file
4. Click "Publish" after updating rules

---

### Problem: Can't upload files to Storage
**Cause**: Storage rules or user role issue.

**Solution**:
1. Verify you have admin role in Firestore
2. Check Storage rules in Firebase Console
3. Ensure rules match content in `storage.rules` file
4. Verify user document has `role: "admin"`

---

### Problem: "Firebase config is undefined"
**Cause**: Environment variables not loaded.

**Solution**:
1. Verify `.env` file exists in project root
2. All variables must start with `VITE_`
3. **Restart dev server** after changing `.env`
```powershell
# Stop server (Ctrl+C)
npm run dev
```

---

## 🔐 Authentication Issues

### Problem: Google Sign-in popup is blocked
**Cause**: Browser popup blocker.

**Solution**:
1. Allow popups for localhost
2. Or try a different browser
3. Check browser console for errors

---

### Problem: "User is null" after sign-in
**Cause**: User document not created in Firestore.

**Solution**:
1. Sign out completely
2. Clear browser cache
3. Sign in again
4. Check Firestore for user document

---

### Problem: Can't access admin dashboard
**Cause**: User role is not set to admin.

**Solution**:
1. Go to Firebase Console → Firestore
2. Navigate to `users` collection
3. Find your user document (by email)
4. Edit the document
5. Change `role` field to `"admin"`
6. Refresh the application

---

## 🎨 UI/Display Issues

### Problem: Styles not loading
**Cause**: Tailwind CSS not processing.

**Solution**:
```powershell
# Restart dev server
npm run dev
```

If problem persists:
```powershell
# Reinstall
npm install
npm run dev
```

---

### Problem: Icons not showing
**Cause**: Lucide React package issue.

**Solution**:
```powershell
npm install lucide-react --save
```

---

### Problem: Animations not working
**Cause**: Framer Motion not installed properly.

**Solution**:
```powershell
npm install framer-motion --save
```

---

## 📱 Responsive Design Issues

### Problem: Layout broken on mobile
**Cause**: Viewport or Tailwind breakpoints.

**Solution**:
1. Check browser DevTools mobile view
2. Verify Tailwind responsive classes (sm:, md:, lg:)
3. Test on actual mobile device

---

## 🚀 Build & Deployment Issues

### Problem: "npm run build" fails
**Cause**: Build errors or missing dependencies.

**Solution**:
```powershell
# Check for errors
npm run build

# If errors, fix them then rebuild
# Common: unused imports, missing dependencies

# Clear and rebuild
Remove-Item -Recurse -Force dist
npm run build
```

---

### Problem: Production build works locally but not when deployed
**Cause**: Environment variables not set in hosting platform.

**Solution**:
1. Add all `VITE_*` variables to hosting platform
2. Firebase Hosting: No env vars needed (uses same project)
3. Vercel/Netlify: Add in dashboard settings

---

### Problem: "firebase deploy" fails
**Cause**: Not logged in or wrong project.

**Solution**:
```powershell
# Login
firebase login

# Check current project
firebase projects:list

# Use correct project
firebase use human-coginitive-science

# Deploy
firebase deploy
```

---

## 💾 Data Issues

### Problem: Notes not appearing for students
**Cause**: Section mismatch or Firestore query issue.

**Solution**:
1. Check note's `section` field in Firestore
2. Verify student's assigned `section`
3. Check browser console for errors
4. Verify Firestore security rules

---

### Problem: Progress not saving
**Cause**: Firestore permissions or offline mode.

**Solution**:
1. Check internet connection
2. Verify Firestore rules allow progress writes
3. Check browser console for errors
4. Try signing out and back in

---

### Problem: User can't see uploaded files
**Cause**: Storage permissions or wrong URL.

**Solution**:
1. Check Storage rules in Firebase Console
2. Verify file exists in Firebase Storage
3. Check if URL is accessible in new tab
4. Ensure user is authenticated

---

## 🌐 Network Issues

### Problem: "Failed to fetch" errors
**Cause**: Network connectivity or CORS.

**Solution**:
1. Check internet connection
2. Verify Firebase project is active
3. Check Firebase Console for service outages
4. Try different network (mobile hotspot)

---

### Problem: Slow loading times
**Cause**: Large files or slow connection.

**Solution**:
1. Optimize uploaded PDFs (compress)
2. Use pagination for large note lists
3. Check Firebase quota/usage
4. Consider CDN for static assets

---

## 🐛 Development Issues

### Problem: "Port 3000 is already in use"
**Cause**: Another process using the port.

**Solution**:
```powershell
# Option 1: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Option 2: Use different port
npm run dev -- --port 3001
```

---

### Problem: Hot reload not working
**Cause**: File watcher or Vite cache issue.

**Solution**:
```powershell
# Stop server
# Delete Vite cache
Remove-Item -Recurse -Force node_modules/.vite

# Restart
npm run dev
```

---

### Problem: ESLint errors everywhere
**Cause**: Linting rules too strict or wrong config.

**Solution**:
```powershell
# Fix auto-fixable issues
npm run lint -- --fix

# Or disable specific rules in files:
/* eslint-disable react/prop-types */
```

---

## 🔍 Debugging Tips

### Enable Detailed Logging

Add to your component:
```javascript
console.log('User:', user);
console.log('User Profile:', userProfile);
console.log('Notes:', notes);
```

### Check Firebase Console

1. **Authentication** tab - View signed-in users
2. **Firestore** tab - View database contents
3. **Storage** tab - View uploaded files
4. **Usage** tab - Check quotas

### Use Browser DevTools

1. **Console** tab - See errors and logs
2. **Network** tab - Check API calls
3. **Application** tab - Check localStorage
4. **Sources** tab - Set breakpoints

---

## 🆘 Emergency Reset

If everything is broken, nuclear option:

```powershell
# 1. Delete everything
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
Remove-Item -Recurse -Force dist
Remove-Item -Recurse -Force .vite

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall
npm install

# 4. Clear browser data
# Go to browser settings → Clear browsing data
# Select: Cookies, Cache, Site data

# 5. Restart dev server
npm run dev

# 6. Sign out and sign in again
```

---

## 📞 Getting More Help

### Check Logs

**Browser Console**:
- Right-click → Inspect → Console tab
- Look for red errors

**Firebase Console**:
- Check Authentication, Firestore, Storage tabs
- Look for error messages or warnings

### Search Error Messages

1. Copy exact error message
2. Search on:
   - Stack Overflow
   - Firebase documentation
   - GitHub issues

### Common Error Messages Decoded

| Error | Meaning | Fix |
|-------|---------|-----|
| `auth/popup-blocked` | Browser blocked popup | Allow popups |
| `auth/unauthorized-domain` | Domain not authorized | Add to Firebase |
| `permission-denied` | Firestore rules blocking | Check rules |
| `storage/unauthorized` | Can't upload | Check role |
| `Module not found` | Missing package | `npm install` |

---

## 📚 Helpful Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind Docs**: https://tailwindcss.com

---

## ✅ Verification Checklist

When troubleshooting, verify:

- [ ] Node.js installed (`node --version`)
- [ ] Dependencies installed (`node_modules` exists)
- [ ] `.env` file created with correct values
- [ ] Firebase services enabled (Auth, Firestore, Storage)
- [ ] Security rules deployed
- [ ] Internet connection working
- [ ] Signed in with Google
- [ ] User has correct role in Firestore
- [ ] Browser allows popups
- [ ] No console errors

---

## 🎯 Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Can't install | `npm cache clean --force && npm install` |
| Can't sign in | Check Firebase console, allow popups |
| No admin access | Set role to "admin" in Firestore |
| Styles broken | Restart dev server |
| Build fails | Delete `dist/` and rebuild |
| Port in use | Use different port or kill process |
| Env vars not loading | Restart dev server |

---

**Still stuck? Check the main README.md or review Firebase Console for specific error messages.**

---

*Last Updated: January 25, 2026*
