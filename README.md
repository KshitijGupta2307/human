# 🧠 CogMech Analytics - Student Progress Tracking Platform

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kshitijgupta2307.github.io/human/)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/KshitijGupta2307/human)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-ffca28.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-blue)](https://kshitijgupta2307.github.io/human/)

> A modern, full-stack web application for tracking student learning progress across different engineering sections (Electrical, Mechanical, and Operator). Built with React, Firebase, and Tailwind CSS, featuring Google Authentication and real-time progress tracking.

## 🚀 Live Demo

**Production Site:** [https://kshitijgupta2307.github.io/human/](https://kshitijgupta2307.github.io/human/)

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Architecture](#️-architecture)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 🌟 Features

### 🔐 Authentication
- **Google Sign-In**: Seamless authentication using Google OAuth
- **Persistent Sessions**: Users stay logged in until they explicitly sign out
- **Role-Based Access**: Separate interfaces for students and administrators

### 📚 For Students
- **Section-Based Learning**: Access notes organized by Electrical, Mechanical, and Operator sections
- **Progress Tracking**: Mark notes as Not Started, In Progress, or Completed
- **Real-Time Stats**: View completion rates and learning analytics
- **Multiple Resource Types**: Access both PDF documents and external links
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Animated UI**: Smooth transitions and engaging animations using Framer Motion

### 👨‍💼 For Administrators
- **Upload Notes**: Add PDF files or external links for students
- **Manage Sections**: Organize content across three engineering sections
- **User Management**: Assign roles (student/admin) and sections to users
- **Analytics Dashboard**: Monitor overall progress and student engagement
- **Content Control**: Edit and delete notes as needed
- **Student Overview**: Track progress of individual students

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 18.2**: Modern UI library with hooks
- **React Router DOM 6.21**: Client-side routing
- **Framer Motion 10.16**: Animation library
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Vite 5.0**: Next-generation build tool

#### Backend & Services
- **Firebase Authentication**: Google OAuth integration
- **Firebase Firestore**: NoSQL cloud database
- **Firebase Storage**: File storage for PDFs

### Database Structure

#### Collections

**1. users**
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,            // User email
  displayName: string,      // User's full name
  photoURL: string,         // Profile picture URL
  role: 'student' | 'admin', // User role
  section: string | null,   // 'electrical' | 'mechanical' | 'operator'
  createdAt: timestamp,     // Account creation date
  lastLogin: timestamp,     // Last login timestamp
  updatedAt: timestamp      // Last profile update
}
```

**2. notes**
```javascript
{
  title: string,            // Note title
  description: string,      // Note description
  section: string,          // Section identifier
  type: 'pdf' | 'link',    // Resource type
  url: string,              // Resource URL
  fileName: string,         // Original filename (for PDFs)
  storagePath: string,      // Firebase Storage path (for PDFs)
  uploadedBy: string,       // Admin UID who uploaded
  uploaderName: string,     // Admin name
  createdAt: timestamp,     // Upload date
  updatedAt: timestamp      // Last modification date
}
```

**3. progress**
```javascript
{
  userId: string,           // Student UID
  noteId: string,           // Reference to note
  status: string,           // 'not-started' | 'in-progress' | 'completed'
  createdAt: timestamp,     // First interaction date
  updatedAt: timestamp      // Last status change
}
```

### Application Flow

```
User Access
    │
    ├─→ Not Authenticated → Login Page
    │                          │
    │                          ├─→ Click "Sign in with Google"
    │                          │
    │                          └─→ Firebase Auth → Create/Update User Doc
    │
    └─→ Authenticated
           │
           ├─→ Role: Student → Student Dashboard
           │                       │
           │                       ├─→ View Notes by Section
           │                       ├─→ Track Progress
           │                       └─→ View Analytics
           │
           └─→ Role: Admin → Admin Dashboard
                                   │
                                   ├─→ Upload Notes
                                   ├─→ Manage Users
                                   ├─→ View Analytics
                                   └─→ Delete Content
```

## 📦 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google Cloud Console project (for OAuth)

### Local Development

**Step 1: Clone the Repository**
```bash
cd "d:\human cognitive science"
# Repository is already set up
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Firebase Configuration

#### 3.1 Enable Firebase Services
1. Go to [Firebase Console](https://console.firebase.google.com/project/human-coginitive-science)
2. Enable **Authentication** → Sign-in method → Google
3. Enable **Firestore Database** → Create database
4. Enable **Storage** → Create storage bucket

#### 3.2 Configure Firestore Security Rules
In Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read their own data, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId || 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Notes collection - authenticated users can read, admins can write
    match /notes/{noteId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Progress collection - users can manage their own progress
    match /progress/{progressId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

#### 3.3 Configure Storage Security Rules
In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /notes/{allPaths=**} {
      // Admins can upload, everyone can read
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### 3.4 Get Firebase Credentials
1. Go to Project Settings → General
2. Scroll to "Your apps" → Web app
3. Copy the configuration object

### Step 4: Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=human-coginitive-science.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=human-coginitive-science
VITE_FIREBASE_STORAGE_BUCKET=human-coginitive-science.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 5: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project (or create new one)
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - Your production domain (when deployed)
6. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `https://human-coginitive-science.firebaseapp.com/__/auth/handler`

### Step 6: Create First Admin User

After the app is running, you'll need to manually set the first admin:

1. Sign in with Google
2. Go to Firebase Console → Firestore Database
3. Find your user document in the `users` collection
4. Edit the document and change `role` from `"student"` to `"admin"`
5. Refresh the application - you should now see the Admin Dashboard

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
The application will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```
This creates an optimized build in the `dist` folder.

### Preview Production Build
```bash
npm run preview
```

## 📱 Usage Guide

### For Students

#### 1. Sign In
- Click "Sign in with Google" on the login page
- Authenticate with your Google account
- You'll be automatically redirected to the Student Dashboard

#### 2. Navigate Sections
- View the three section cards: Electrical, Mechanical, Operator
- Click on any section to view its notes
- Your assigned section (if any) will be pre-selected

#### 3. Access Notes
- Each note card shows:
  - Title and description
  - Type (PDF or LINK)
  - Current progress status
- Click "Open PDF" or "Open Link" to access the resource

#### 4. Track Progress
- Use the status dropdown to mark your progress:
  - **Not Started**: Haven't started this note yet
  - **In Progress**: Currently studying this note
  - **Completed**: Finished studying this note
- Your progress is saved automatically to Firebase

#### 5. View Analytics
- Top stats cards show:
  - Total notes available
  - Notes completed
  - Notes in progress
  - Overall completion percentage
- Completion bar shows visual progress

### For Administrators

#### 1. Access Admin Dashboard
- Sign in with an account that has admin role
- You'll be redirected to the Admin Dashboard

#### 2. Upload Notes

**Upload PDF:**
1. Click "Add Note" button
2. Select "PDF Upload"
3. Choose section (Electrical/Mechanical/Operator)
4. Enter title and description
5. Select PDF file from your computer
6. Click "Upload Note"
7. PDF is uploaded to Firebase Storage and metadata saved to Firestore

**Add Link:**
1. Click "Add Note" button
2. Select "External Link"
3. Choose section
4. Enter title and description
5. Paste the external URL
6. Click "Upload Note"

#### 3. Manage Notes
- Switch to "Manage Notes" tab
- View all uploaded notes
- Click "View" to open a note
- Click trash icon to delete (requires confirmation)

#### 4. Manage Users
- Switch to "Manage Users" tab
- View all registered users
- Change user roles (Student/Admin) using dropdown
- Assign users to sections using dropdown
- Changes are saved automatically

#### 5. View Analytics
- Switch to "Analytics" tab
- See section-wise statistics:
  - Total notes per section
  - Completed notes count
  - In-progress notes count
- Monitor overall platform usage

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',  // Main brand color
        600: '#0284c7',  // Darker shade
        // Add more shades as needed
      },
    },
  },
}
```

### Adding New Sections

Edit section definitions in both dashboard files:

In `src/pages/AdminDashboard.jsx` and `src/pages/StudentDashboard.jsx`:

```javascript
const SECTIONS = [
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'mechanical', name: 'Mechanical', icon: Cog, color: 'from-blue-400 to-cyan-500' },
  { id: 'operator', name: 'Operator', icon: UsersIcon, color: 'from-green-400 to-emerald-500' },
  // Add new section:
  { id: 'civil', name: 'Civil', icon: Building, color: 'from-purple-400 to-pink-500' },
];
```

### Modifying Animations

Animations are defined in `tailwind.config.js` and use Framer Motion:

```javascript
// Tailwind animations
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
}

// Framer Motion example
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
```

## 📂 Project Structure

```
d:\human cognitive science\
│
├── public/                      # Static files
│
├── src/
│   ├── components/              # Reusable components
│   │   └── ProtectedRoute.jsx   # Route protection HOC
│   │
│   ├── context/                 # React Context
│   │   └── AuthContext.jsx      # Authentication state management
│   │
│   ├── firebase/                # Firebase configuration
│   │   ├── config.js            # Firebase initialization
│   │   ├── auth.js              # Authentication functions
│   │   └── firestore.js         # Database operations
│   │
│   ├── pages/                   # Page components
│   │   ├── Login.jsx            # Login page
│   │   ├── Dashboard.jsx        # Router component
│   │   ├── StudentDashboard.jsx # Student interface
│   │   └── AdminDashboard.jsx   # Admin interface
│   │
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
│
├── .env                         # Environment variables (create this)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
└── README.md                    # This file
```

## 🔒 Security Considerations

### Authentication
- Uses Firebase Authentication with Google OAuth
- Sessions persist locally until explicit sign-out
- All routes are protected by authentication checks

### Authorization
- Role-based access control (Student vs Admin)
- Firestore security rules prevent unauthorized data access
- Storage rules restrict uploads to admin users only

### Data Protection
- Environment variables for sensitive credentials
- HTTPS enforced in production
- No sensitive data exposed in client code

### Best Practices
- Never commit `.env` file to version control
- Regularly update dependencies for security patches
- Use Firebase Security Rules for server-side validation
- Implement rate limiting for Firebase operations (optional)

## 🐛 Troubleshooting

### Issue: "Firebase: Error (auth/unauthorized-domain)"
**Solution**: Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Issue: "Permission denied" when uploading files
**Solution**: Check Firebase Storage rules and ensure user has admin role in Firestore

### Issue: Environment variables not loading
**Solution**: 
- Ensure `.env` file exists in root directory
- Variables must start with `VITE_`
- Restart dev server after changing `.env`

### Issue: "Cannot read property 'role' of null"
**Solution**: User profile might not be created yet. Sign out and sign in again.

### Issue: Notes not appearing for students
**Solution**: 
- Check Firestore security rules
- Verify notes have correct section field
- Ensure student is authenticated

### Issue: Build fails
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🚢 Deployment

### Option 1: Automated GitHub Pages Deployment (Recommended)

This project includes automated GitHub Actions workflow for seamless deployment.

**Setup:**

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Under "Source", select: **GitHub Actions**
   - Save the changes

2. **Add Firebase Domain:**
   - Go to [Firebase Console](https://console.firebase.google.com/project/human-coginitive-science/authentication/settings)
   - Add authorized domain: `<your-username>.github.io`

3. **Push to Main Branch:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```

4. **Automatic Deployment:**
   - GitHub Actions will automatically build and deploy
   - Check Actions tab for deployment status
   - Site will be live at: `https://<your-username>.github.io/<repo-name>/`

**Current Live Site:** [https://kshitijgupta2307.github.io/human/](https://kshitijgupta2307.github.io/human/)

### Option 2: Manual GitHub Pages Deployment

```bash
# Build and deploy manually
npm run deploy
```

This command:
- Builds the production bundle
- Pushes to `gh-pages` branch
- Deploys automatically

### Option 3: Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

4. Build the app:
```bash
npm run build
```

5. Deploy:
```bash
firebase deploy --only hosting
```

### Option 4: Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard

### Option 5: Netlify

1. Build the app:
```bash
npm run build
```

2. Drag and drop `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact & Support

**Developer:** Kshitij Gupta  
**Email:** [guptakshitij266@gmail.com](mailto:guptakshitij266@gmail.com)  
**GitHub:** [KshitijGupta2307](https://github.com/KshitijGupta2307)  
**Project Link:** [https://github.com/KshitijGupta2307/human](https://github.com/KshitijGupta2307/human)

For questions or issues:
- 📝 Create an issue in the [GitHub repository](https://github.com/KshitijGupta2307/human/issues)
- 📧 Email support at guptakshitij266@gmail.com
- 📚 Check [documentation files](./DEPLOYMENT_GUIDE.md)
- 🔧 See [troubleshooting guide](./GITHUB_PAGES_TROUBLESHOOTING.md)

## 🙏 Acknowledgments

- React team for the amazing framework
- Firebase for backend infrastructure
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- Lucide React for beautiful icons

---

**Built with ❤️ for Human Cognitive Science**

*Last Updated: January 2026*
