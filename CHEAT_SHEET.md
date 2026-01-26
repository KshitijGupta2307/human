# 🛠️ Developer Cheat Sheet - CogMech Analytics

Quick reference for common tasks and commands.

## 📦 NPM Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🔥 Firebase CLI Commands

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only Storage rules
firebase deploy --only storage

# Open Firebase console
firebase open

# View logs
firebase functions:log
```

## 🗂️ File Structure Quick Reference

```
Key Files:
├── src/App.jsx                   - Main app router
├── src/main.jsx                  - Entry point
├── src/firebase/config.js        - Firebase initialization
├── src/firebase/auth.js          - Auth functions
├── src/firebase/firestore.js     - Database functions
├── src/context/AuthContext.jsx   - Auth state management
├── src/pages/Login.jsx           - Login page
├── src/pages/StudentDashboard.jsx - Student interface
└── src/pages/AdminDashboard.jsx  - Admin interface

Config Files:
├── .env                          - Environment variables
├── vite.config.js                - Vite configuration
├── tailwind.config.js            - Tailwind CSS config
├── firebase.json                 - Firebase deployment config
├── firestore.rules               - Firestore security rules
└── storage.rules                 - Storage security rules
```

## 🎨 Tailwind CSS Classes Quick Reference

### Colors
```jsx
// Primary colors
className="text-primary-600 bg-primary-100"

// Gradients
className="bg-gradient-to-r from-primary-600 to-purple-600"
```

### Layout
```jsx
// Flex
className="flex items-center justify-between gap-4"

// Grid
className="grid grid-cols-1 md:grid-cols-3 gap-6"

// Spacing
className="p-6 m-4 px-8 py-4"
```

### Rounded Corners
```jsx
className="rounded-lg"      // Medium
className="rounded-xl"      // Large
className="rounded-full"    // Circle
```

### Shadows
```jsx
className="shadow-md"       // Medium
className="shadow-lg"       // Large
className="shadow-xl"       // Extra large
```

## 🔄 Framer Motion Animations

### Basic Fade In
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
```

### Slide Up
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

### Button Hover
```jsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

## 📊 Firestore Operations

### Add Document
```javascript
import { addDoc, collection } from 'firebase/firestore';

await addDoc(collection(db, 'notes'), {
  title: 'Example',
  section: 'electrical',
  createdAt: serverTimestamp()
});
```

### Update Document
```javascript
import { updateDoc, doc } from 'firebase/firestore';

await updateDoc(doc(db, 'users', userId), {
  role: 'admin'
});
```

### Query Documents
```javascript
import { getDocs, query, where } from 'firebase/firestore';

const q = query(
  collection(db, 'notes'),
  where('section', '==', 'electrical')
);
const docs = await getDocs(q);
```

### Delete Document
```javascript
import { deleteDoc, doc } from 'firebase/firestore';

await deleteDoc(doc(db, 'notes', noteId));
```

## 🔐 Common Auth Operations

### Sign In
```javascript
import { signInWithPopup } from 'firebase/auth';

const result = await signInWithPopup(auth, googleProvider);
const user = result.user;
```

### Sign Out
```javascript
import { signOut } from 'firebase/auth';

await signOut(auth);
```

### Get Current User
```javascript
import { auth } from './firebase/config';

const user = auth.currentUser;
```

## 🐛 Debugging Tips

### Check Firebase Auth State
```javascript
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  console.log('Current user:', user);
});
```

### Check Firestore Data
```javascript
const userDoc = await getDoc(doc(db, 'users', userId));
console.log('User data:', userDoc.data());
```

### Check Environment Variables
```javascript
console.log('Firebase Config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
});
```

### Clear Browser Cache
1. Open DevTools (F12)
2. Right-click refresh button
3. Click "Empty Cache and Hard Reload"

## 🔧 Common Fixes

### Fix: Module not found
```bash
npm install
```

### Fix: Port already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Use different port
npm run dev -- --port 3001
```

### Fix: Build fails
```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Fix: Firebase permissions error
- Check Firestore rules in Firebase Console
- Verify user role in Firestore
- Check Storage rules for file uploads

## 📱 Responsive Design Breakpoints

```
sm:  640px   @media (min-width: 640px)
md:  768px   @media (min-width: 768px)
lg:  1024px  @media (min-width: 1024px)
xl:  1280px  @media (min-width: 1280px)
2xl: 1536px  @media (min-width: 1536px)
```

Example:
```jsx
className="text-sm md:text-base lg:text-lg"
```

## 🎯 Performance Tips

1. **Lazy Load Components**
```javascript
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

2. **Optimize Images**
- Use WebP format
- Compress before upload
- Use appropriate sizes

3. **Memoize Components**
```javascript
import { memo } from 'react';
const NoteCard = memo(({ note }) => { ... });
```

4. **Firestore Query Optimization**
- Use indexes for complex queries
- Limit results: `query(ref, limit(10))`
- Use pagination with `startAfter()`

## 🚀 Deployment Checklist

- [ ] Update `.env` with production Firebase config
- [ ] Build project: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Update Firebase security rules
- [ ] Configure custom domain (optional)
- [ ] Deploy: `firebase deploy`
- [ ] Test authentication flow
- [ ] Verify file uploads work
- [ ] Check all routes load correctly

## 📊 Useful Firebase Console Links

- [Authentication](https://console.firebase.google.com/project/human-coginitive-science/authentication)
- [Firestore Database](https://console.firebase.google.com/project/human-coginitive-science/firestore)
- [Storage](https://console.firebase.google.com/project/human-coginitive-science/storage)
- [Hosting](https://console.firebase.google.com/project/human-coginitive-science/hosting)
- [Project Settings](https://console.firebase.google.com/project/human-coginitive-science/settings/general)

## 🔍 Testing User Roles

### Make User Admin
1. Firebase Console → Firestore
2. Navigate to `users` collection
3. Find user document
4. Edit `role` field to `"admin"`

### Make User Student
1. Same as above
2. Set `role` to `"student"`

### Assign Section
1. Edit user document
2. Set `section` to `"electrical"`, `"mechanical"`, or `"operator"`

## 💡 Pro Tips

1. **Hot Reload**: Changes auto-refresh during development
2. **React DevTools**: Install browser extension for debugging
3. **Console Logs**: Use `console.log()` to debug issues
4. **Network Tab**: Check Firebase API calls in DevTools
5. **Version Control**: Commit often with clear messages

## 🆘 Emergency Commands

### Reset Everything
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

### Force Firebase Logout
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

**Keep this handy for quick reference during development!**
