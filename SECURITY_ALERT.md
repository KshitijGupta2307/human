# 🔐 IMPORTANT SECURITY NOTICE

## Your Firebase Credentials Were Exposed

Your Firebase credentials were previously committed to the repository in `.env.example`. While the file has now been cleaned, **the credentials remain in the git history**.

## Immediate Actions Required:

### 1. **Rotate Your Firebase API Keys** (CRITICAL)
Go to Firebase Console and regenerate your credentials:

1. Visit [Firebase Console](https://console.firebase.google.com/project/human-coginitive-science/settings/general)
2. Go to **Project Settings** → **General**
3. Under "Your apps", click on your web app
4. Click **"Regenerate API Key"** or create a new web app
5. Update your local `.env` file with the new credentials

### 2. **Configure Firebase Security Rules**
Ensure your Firestore and Storage rules are properly secured:

**Firestore Rules** - Update in Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Storage Rules**:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. **Setup Environment Variables for GitHub Pages**

Since GitHub Pages is a static hosting, you'll need to use GitHub Secrets for secure deployments:

1. Go to your repository: https://github.com/KshitijGupta2307/human
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`

### 4. **Optional: Clean Git History** (Advanced)

To completely remove credentials from git history:

```powershell
# WARNING: This rewrites history and requires force push
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env.example" --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

⚠️ **Note**: Only do this if you understand the implications of rewriting git history.

## Current Security Status:

✅ `.env` file is now gitignored (won't be committed)  
✅ `.env.example` has been cleaned of real credentials  
✅ Enhanced `.gitignore` includes all credential file patterns  
⚠️ **Old credentials still exist in git history** - ROTATE THEM!

## Local Development Setup:

After rotating credentials, create a `.env` file in the root directory:

```bash
# Copy from example
cp .env.example .env

# Edit with your NEW credentials
# Never commit this file!
```

## Questions?

If you need help securing your Firebase project, consult the [Firebase Security Documentation](https://firebase.google.com/docs/rules).
