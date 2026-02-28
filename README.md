# CogMech Analytics - Student Progress Tracking Platform

> A full-stack web application for tracking student learning progress across engineering sections (Electrical, Mechanical, Computer Operator). Built with React, Firebase, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Framer Motion, Tailwind CSS, Lucide Icons |
| Backend | Firebase Auth (Google OAuth), Firestore, Firebase Storage |
| Build | Vite 5, PostCSS, Autoprefixer |
| Hosting | Vercel / Firebase Hosting / GitHub Pages |

---

## Project Structure

```
├── public/                     Static assets
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx  Auth-guarded route wrapper
│   ├── context/
│   │   └── AuthContext.jsx     Auth state provider
│   ├── firebase/
│   │   ├── config.js           Firebase initialization
│   │   ├── auth.js             Sign-in / sign-out logic
│   │   └── firestore.js        Firestore CRUD operations
│   ├── pages/
│   │   ├── Login.jsx           Login page with Google sign-in
│   │   ├── Dashboard.jsx       Role-based router
│   │   ├── StudentDashboard.jsx Student interface
│   │   └── AdminDashboard.jsx  Admin interface
│   ├── App.jsx                 Root component + routes
│   ├── main.jsx                Entry point
│   └── index.css               Global styles + Tailwind
├── .env                        Environment variables (not committed)
├── .env.example                Environment template
├── firebase.json               Firebase hosting config
├── firestore.rules             Firestore security rules (production)
├── storage.rules               Storage security rules (production)
├── firestore.indexes.json      Firestore composite indexes
├── vercel.json                 Vercel rewrite config
├── vite.config.js              Vite build config
├── tailwind.config.js          Tailwind theme config
├── postcss.config.js           PostCSS config
├── package.json                Dependencies & scripts
└── LICENSE                     MIT license
```

---

## Database Schema

### `users` collection
```
uid           string        Firebase Auth UID
email         string        User email
displayName   string        Full name
photoURL      string        Google profile picture
role          string        "student" | "admin"
section       string|null   "electrical" | "mechanical" | "operator"
createdAt     timestamp
lastLogin     timestamp
```

### `notes` collection
```
title         string        Note title
description   string        Description
section       string        Section identifier
type          string        "pdf" | "link"
url           string        Download/view URL
fileName      string        Original filename (PDFs)
storagePath   string        Firebase Storage path (PDFs)
uploadedBy    string        Admin UID
uploaderName  string        Admin display name
createdAt     timestamp
updatedAt     timestamp
```

### `progress` collection
```
userId        string        Student UID
noteId        string        Reference to note document
status        string        "not-started" | "in-progress" | "completed"
studentName   string        Cached student name
createdAt     timestamp
updatedAt     timestamp
```

---

## Setup

### Prerequisites
- Node.js 18+
- Firebase project with Auth, Firestore, and Storage enabled

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Fill in your Firebase credentials (all prefixed with `VITE_`).

### 3. Firebase setup
1. Enable **Google sign-in** in Firebase Console → Authentication → Sign-in method
2. Create **Firestore Database** in production mode
3. Create **Storage** bucket
4. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

### 4. Create first admin
1. Sign in with Google
2. In Firebase Console → Firestore → `users` collection
3. Find your user document, change `role` to `"admin"`
4. Refresh the app

### 5. Run locally
```bash
npm run dev          # Development server at http://localhost:3000
npm run build        # Production build → dist/
npm run preview      # Preview production build
```

---

## Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```
Add environment variables in the Vercel dashboard.

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --only hosting
```

### GitHub Pages
```bash
npm run deploy       # Builds and pushes to gh-pages branch
```

---

## Security Rules

Production-hardened rules are in `firestore.rules` and `storage.rules`:

- **Users**: Can read all profiles; can only create own profile as `student`; cannot self-promote to `admin`
- **Notes**: Read by authenticated users; write only by admins with required fields
- **Progress**: Users create/update only own progress; status must be valid enum; rate-limited updates
- **Storage**: PDFs only, max 20 MB; profile images max 5 MB; admin-only uploads for notes
- **Default deny**: All unmatched paths are blocked

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `auth/unauthorized-domain` | Add your domain in Firebase Console → Auth → Settings → Authorized domains |
| Permission denied on upload | Verify user has `role: "admin"` in Firestore `users` collection |
| Env vars not loading | Prefix with `VITE_`, restart dev server |
| Notes not appearing | Check Firestore rules; verify `section` field matches |
| Build fails | `rm -rf node_modules package-lock.json && npm install && npm run build` |

---

## Contact

**Developer:** Kshitij Gupta
**Email:** guptakshitij266@gmail.com
**Phone:** 8679930799
**GitHub:** [KshitijGupta2307](https://github.com/KshitijGupta2307)

---

## License

MIT - see [LICENSE](LICENSE)
