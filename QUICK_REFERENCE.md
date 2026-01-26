# ⚡ Quick Command Reference - CogMech Analytics

## 🚀 Essential Commands

### First Time Setup
```powershell
# 1. Install dependencies
npm install

# 2. Create environment file
Copy-Item .env.example .env
# Then edit .env with your Firebase credentials

# 3. Run development server
npm run dev
```

### Daily Development
```powershell
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Firebase Deployment
```powershell
# Login to Firebase
firebase login

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting

# Deploy only rules
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## 📂 Important File Locations

```
Config:
  .env                          ← Your Firebase credentials
  tailwind.config.js            ← Color customization
  vite.config.js                ← Build settings

Code:
  src/pages/StudentDashboard.jsx ← Student UI
  src/pages/AdminDashboard.jsx   ← Admin UI
  src/firebase/firestore.js      ← Database functions
  src/firebase/auth.js           ← Auth functions

Docs:
  START_HERE.md                  ← Begin here!
  GETTING_STARTED.md             ← Quick setup
  README.md                      ← Complete guide
  TROUBLESHOOTING.md             ← Fix problems
```

## 🔧 Common Tasks

### Change Colors
```javascript
// Edit tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#YOUR_COLOR',
        600: '#YOUR_DARKER_COLOR',
      }
    }
  }
}
```

### Add New Section
```javascript
// Edit both dashboard files
const SECTIONS = [
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'mechanical', name: 'Mechanical', icon: Cog, color: 'from-blue-400 to-cyan-500' },
  { id: 'operator', name: 'Operator', icon: UsersIcon, color: 'from-green-400 to-emerald-500' },
  { id: 'newSection', name: 'New Section', icon: YourIcon, color: 'from-purple-400 to-pink-500' },
];
```

### Make User Admin
1. Go to: https://console.firebase.google.com/project/human-coginitive-science/firestore
2. Navigate to `users` collection
3. Find user by email
4. Edit document
5. Change `role` to `"admin"`

## 🐛 Quick Fixes

### Port Already in Use
```powershell
# Use different port
npm run dev -- --port 3001
```

### Dependencies Issue
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Environment Variables Not Loading
```powershell
# Restart dev server (Ctrl+C then run again)
npm run dev
```

### Build Fails
```powershell
Remove-Item -Recurse -Force dist
npm run build
```

## 📱 Testing

### Test Locally
```powershell
npm run dev
# Open: http://localhost:3000
```

### Test Production Build
```powershell
npm run build
npm run preview
# Open: http://localhost:4173
```

## 📚 Documentation Quick Links

| Need | Read This |
|------|-----------|
| Get started | START_HERE.md |
| Setup guide | GETTING_STARTED.md |
| Full docs | README.md |
| Fix problems | TROUBLESHOOTING.md |
| Commands | CHEAT_SHEET.md |
| Architecture | PROJECT_OVERVIEW.md |

## 🔑 Key URLs

### Local Development
- App: http://localhost:3000
- Vite Server: http://localhost:3000

### Firebase Console
- Main: https://console.firebase.google.com/project/human-coginitive-science
- Auth: https://console.firebase.google.com/project/human-coginitive-science/authentication
- Firestore: https://console.firebase.google.com/project/human-coginitive-science/firestore
- Storage: https://console.firebase.google.com/project/human-coginitive-science/storage
- Settings: https://console.firebase.google.com/project/human-coginitive-science/settings/general

## ⚡ Pro Tips

1. **Bookmark this file** for quick reference
2. **Keep dev server running** while coding
3. **Check browser console** for errors (F12)
4. **Use Git** to track your changes
5. **Test on mobile** using DevTools

## 🆘 Emergency Commands

### Nuclear Reset
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json, dist
npm cache clean --force
npm install
npm run dev
```

### Clear Browser Data
- Open DevTools (F12)
- Application tab → Clear storage
- Or use Incognito mode

---

**Print this page for offline reference!**

*Quick Reference v1.0 - January 2026*
