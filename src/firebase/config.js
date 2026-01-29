import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
// Note: These credentials are safe to expose in client-side code
// Security is enforced through Firebase Security Rules
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyADSwp3ljnWHXjoy9Jr2T1gB-sdl19_iMc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "human-coginitive-science.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "human-coginitive-science",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "human-coginitive-science.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1022609127800",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1022609127800:web:c02a110c4edfb4ff5af08d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-CP4JH46BP4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Force account selection on every sign-in
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics (optional)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Set persistence to LOCAL (stays logged in until explicit logout)
setPersistence(auth, browserLocalPersistence);

export default app;
