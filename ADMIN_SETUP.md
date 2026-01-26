# 🔐 Admin Setup Guide

## Make Yourself an Admin

To get admin access to the CogMech Analytics platform, follow these simple steps:

### Step 1: Sign In First
1. Open your browser and go to `http://localhost:3000`
2. Click "Sign in with Google"
3. Sign in with your email: **guptskshitij266@gmail.com**

### Step 2: Set Admin Role in Firebase

#### Option A: Using Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/project/human-coginitive-science)
2. Click on **Firestore Database** in the left menu
3. Click on the **users** collection
4. Find your user document (it will have your email: guptskshitij266@gmail.com)
   - You can search by clicking the filter icon and searching for your email
5. Click on your user document to open it
6. Find the `role` field and click the edit icon (pencil)
7. Change the value from `"student"` to `"admin"` (keep the quotes)
8. Click **Update**

#### Option B: Using Firestore Rules (Alternative)
If you want to make yourself admin automatically on first login, you can temporarily modify the Firestore rules:

1. Go to [Firebase Console](https://console.firebase.google.com/project/human-coginitive-science)
2. Click on **Firestore Database** → **Rules**
3. Temporarily add a rule to set your role (do this CAREFULLY):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     (request.auth.uid == userId || 
                      request.auth.token.email == 'guptskshitij266@gmail.com');
    }
    
    match /notes/{noteId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    match /progress/{progressId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
  }
}
```

4. Then in your browser console (F12), run:
```javascript
// Update your role to admin
fetch('https://firestore.googleapis.com/v1/projects/human-coginitive-science/databases/(default)/documents/users/YOUR_USER_ID', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fields: {
      role: { stringValue: 'admin' }
    }
  })
});
```

### Step 3: Verify Admin Access
1. Sign out and sign back in to refresh your session
2. After signing in, you should see:
   - **"Admin"** badge next to your name in the header
   - Admin Dashboard with tabs: Upload Notes, Manage Notes, Manage Users, Analytics
   - Ability to upload, edit, and delete notes
   - User management features

### Step 4: Secure Your Firestore Rules (Important!)
After setting yourself as admin, update your Firestore rules to be secure:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Notes collection - only admins can write
    match /notes/{noteId} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    
    // Progress collection - users manage their own progress
    match /progress/{progressId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Admin Features

Once you're an admin, you can:

### ✅ Upload Notes
- Upload PDF files or add external links
- Organize by section (Electrical, Mechanical, Operator)
- Add titles and descriptions

### ✅ Manage Notes
- View all notes across all sections
- Filter by specific section
- Delete notes (also removes from database and storage)
- Edit note details

### ✅ Manage Users
- View all registered users
- Assign user roles (Student/Admin)
- Assign users to sections
- Track user activity

### ✅ View Analytics
- See summary statistics by section
- Monitor student progress
- View detailed student activity
- Track completion rates

---

## Important Notes

### When You Delete a Note:
✅ **The note is deleted from Firestore database**
✅ **The PDF file is deleted from Firebase Storage** (if applicable)
✅ **All student progress records for that note are deleted**
✅ **Changes are immediate and permanent**

### When You Add a Note:
✅ **The note is added to Firestore database**
✅ **It's assigned to the section you selected**
✅ **Students in that section can immediately see it**
✅ **PDF files are uploaded to Firebase Storage**
✅ **External links are saved directly**

---

## Troubleshooting

### Problem: I don't see the Admin Dashboard after signing in
**Solution**: 
1. Check that your `role` field in Firestore is exactly `"admin"` (lowercase, with quotes)
2. Sign out and sign back in
3. Clear your browser cache (Ctrl+Shift+Delete)

### Problem: I can't upload notes
**Solution**:
1. Check Firebase Storage is enabled
2. Verify your Firestore rules allow admin writes
3. Check browser console (F12) for errors

### Problem: Deleted notes still appear
**Solution**:
1. Refresh the page (F5)
2. Check Firestore console to verify deletion
3. Clear browser cache

### Problem: Notes aren't appearing in the correct section
**Solution**:
1. Check that you selected the correct section when uploading
2. Verify the `section` field in Firestore matches: "electrical", "mechanical", or "operator"
3. Section names are case-sensitive and must be lowercase

---

## Quick Reference

**Your Admin Email**: guptskshitij266@gmail.com  
**Firebase Project**: human-coginitive-science  
**Firebase Console**: https://console.firebase.google.com/project/human-coginitive-science  
**Local Dev Server**: http://localhost:3000  

---

**Need Help?** Check the main [README.md](README.md) for detailed documentation.
