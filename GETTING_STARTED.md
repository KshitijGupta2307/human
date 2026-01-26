# ⚡ Getting Started in 3 Steps

Welcome to **CogMech Analytics**! Follow these three simple steps to get started.

---

## Step 1️⃣: Install Dependencies (2 minutes)

Open PowerShell in this folder and run:

```powershell
npm install
```

Wait for installation to complete. You'll see a progress bar.

---

## Step 2️⃣: Configure Firebase (5 minutes)

### A. Get Your Firebase Credentials

1. Open: https://console.firebase.google.com/project/human-coginitive-science/settings/general
2. Scroll to "Your apps" section
3. If you don't have a web app, click the `</>` button to create one
4. Copy the `firebaseConfig` values

### B. Create Environment File

1. Copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Open `.env` in any text editor

3. Replace the placeholder values with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=human-coginitive-science.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=human-coginitive-science
   VITE_FIREBASE_STORAGE_BUCKET=human-coginitive-science.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789...
   VITE_FIREBASE_APP_ID=1:123456789...
   ```

### C. Enable Firebase Services

1. **Enable Google Authentication:**
   - Go to: https://console.firebase.google.com/project/human-coginitive-science/authentication
   - Click "Get Started" (if first time)
   - Click "Sign-in method" tab
   - Enable "Google"

2. **Create Firestore Database:**
   - Go to: https://console.firebase.google.com/project/human-coginitive-science/firestore
   - Click "Create database"
   - Choose "Start in test mode"
   - Click "Next" → "Enable"

3. **Enable Storage:**
   - Go to: https://console.firebase.google.com/project/human-coginitive-science/storage
   - Click "Get started"
   - Choose "Start in test mode"
   - Click "Done"

### D. Add Security Rules

**Firestore Rules:**
1. Go to Firestore → Rules tab
2. Copy content from `firestore.rules` file in this project
3. Paste and click "Publish"

**Storage Rules:**
1. Go to Storage → Rules tab
2. Copy content from `storage.rules` file in this project
3. Paste and click "Publish"

---

## Step 3️⃣: Run the App (1 minute)

```powershell
npm run dev
```

The app will open at: **http://localhost:3000**

---

## 🎯 First-Time Setup After Running

1. **Sign in** with Google
2. Go to Firebase Console → Firestore
3. Find your user in the `users` collection
4. Change `role` from `"student"` to `"admin"`
5. Refresh the app
6. You're now an admin! 🎉

---

## 🆘 Having Issues?

### "Module not found"
```powershell
npm install
```

### "Port 3000 is already in use"
```powershell
npm run dev -- --port 3001
```

### Can't sign in
- Check if Google OAuth is enabled in Firebase Console
- Verify `.env` file has correct values
- Try incognito/private browsing mode

### Still stuck?
Check **SETUP_GUIDE.md** for detailed troubleshooting.

---

## 📚 Next Steps

Once the app is running:

1. ✅ **Read README.md** - Complete documentation
2. ✅ **Check PROJECT_OVERVIEW.md** - Understand the architecture  
3. ✅ **Use CHEAT_SHEET.md** - Quick command reference
4. ✅ **Upload your first note** - Start using the platform!

---

## 🎨 Want to Customize?

- **Colors**: Edit `tailwind.config.js`
- **Name**: Search and replace "CogMech Analytics" in all files
- **Sections**: Modify `SECTIONS` array in dashboard files
- **Logo**: Replace `public/brain-icon.svg`

---

**Ready to revolutionize student learning tracking? Let's go! 🚀**
