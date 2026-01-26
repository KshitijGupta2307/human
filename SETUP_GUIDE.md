# 🚀 Quick Setup Guide - CogMech Analytics

This guide will help you set up the CogMech Analytics platform in **under 10 minutes**!

## ⚡ Quick Start Checklist

- [ ] Node.js installed (v16+)
- [ ] Firebase project created
- [ ] Google OAuth configured
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] First admin user created

## 📋 Step-by-Step Setup

### 1️⃣ Install Node.js (if not already installed)

Download from: https://nodejs.org/
Verify installation:
```bash
node --version
npm --version
```

### 2️⃣ Install Dependencies

```bash
cd "d:\human cognitive science"
npm install
```

Wait for all packages to install (~2-3 minutes).

### 3️⃣ Firebase Setup

#### A. Access Your Firebase Project
1. Open: https://console.firebase.google.com/project/human-coginitive-science
2. You should see your project dashboard

#### B. Enable Authentication
1. Click "Authentication" in left sidebar
2. Click "Get Started" (if first time)
3. Click "Sign-in method" tab
4. Click "Google"
5. Toggle "Enable"
6. Click "Save"

#### C. Create Firestore Database
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select your preferred location
5. Click "Enable"

#### D. Enable Storage
1. Click "Storage" in left sidebar
2. Click "Get started"
3. Choose "Start in test mode"
4. Click "Next" → "Done"

#### E. Add Security Rules

**For Firestore:**
1. Go to "Firestore Database" → "Rules" tab
2. Replace the content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /notes/{noteId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /progress/{progressId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click "Publish"

**For Storage:**
1. Go to "Storage" → "Rules" tab
2. Replace the content with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /notes/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. Click "Publish"

#### F. Get Firebase Config
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app (nickname: "CogMech Analytics")
5. Copy the `firebaseConfig` object

### 4️⃣ Configure Environment Variables

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` file and add your Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=human-coginitive-science.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=human-coginitive-science
VITE_FIREBASE_STORAGE_BUCKET=human-coginitive-science.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

### 5️⃣ Configure Google OAuth (IMPORTANT!)

1. Go to: https://console.cloud.google.com
2. Select your Firebase project
3. Navigate: "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add Authorized JavaScript origins:
   - `http://localhost:3000`
7. Add Authorized redirect URIs:
   - `http://localhost:3000`
   - `https://human-coginitive-science.firebaseapp.com/__/auth/handler`
8. Click "Create"

### 6️⃣ Run the Application

```bash
npm run dev
```

The app will open at: http://localhost:3000

### 7️⃣ Create First Admin User

1. Open http://localhost:3000 in your browser
2. Click "Sign in with Google"
3. Authenticate with your Google account
4. Go to Firebase Console → Firestore Database
5. Click on "users" collection
6. Find your user document (click on it)
7. Click "Edit" (pencil icon)
8. Change `role` from `"student"` to `"admin"`
9. Click "Update"
10. Go back to the app and refresh the page
11. You should now see the Admin Dashboard! 🎉

## ✅ Verification

After setup, verify everything works:

### As Admin:
- [ ] Can access Admin Dashboard
- [ ] Can upload a test note
- [ ] Can see stats on dashboard
- [ ] Can manage users

### As Student (use a different Google account):
- [ ] Can sign in
- [ ] Can see student dashboard
- [ ] Can view notes
- [ ] Can update progress status

## 🎯 Next Steps

1. **Customize**: Change colors, add more sections (see README)
2. **Content**: Upload your first set of notes for each section
3. **Users**: Invite students to sign in
4. **Assign**: Set student sections in User Management
5. **Monitor**: Track progress in Analytics tab

## 🆘 Common Issues

### "Unauthorized domain" error
→ Add your domain in Firebase Console → Authentication → Settings → Authorized domains

### Can't sign in
→ Check Google OAuth configuration in Google Cloud Console

### Notes not showing
→ Verify Firestore security rules are published

### Environment variables not loading
→ Make sure `.env` file exists and restart the dev server

## 📚 Resources

- Full Documentation: See README.md
- Firebase Docs: https://firebase.google.com/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs

## 🎉 You're Done!

Your CogMech Analytics platform is now ready to use!

For detailed information about features and usage, refer to the main README.md file.

---

**Need Help?**
- Check the troubleshooting section in README.md
- Review Firebase console for any errors
- Ensure all steps were completed correctly
