// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "photobooth-laba-2ca9f.firebaseapp.com",
  projectId: "photobooth-laba-2ca9f",
  storageBucket: "photobooth-laba-2ca9f.firebasestorage.app",
  messagingSenderId: "143520660072",
  appId: "1:143520660072:web:587350d075f83bf94f19dd",
  measurementId: "G-70RQDF3V0V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };