import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUiqx9rtISssTf7ziaBpB1qAlvBG5iQuI",
  authDomain: "allinone-b56a2.firebaseapp.com",
  projectId: "allinone-b56a2",
  storageBucket: "allinone-b56a2.appspot.com",
  messagingSenderId: "833395790049",
  appId: "1:833395790049:web:4b2e18ae0561e60c0767a0",
  measurementId: "G-V7JJ8NBSD5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google Sign-In Function
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Return user details
    return {
      success: true,
      user: {
        googleId: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      },
    };
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);

    // Return structured error response
    return {
      success: false,
      error: error.message,
    };
  }
};

export default app;
