import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1pt7_n5oce3NiwfmVJxR0pI7DsRV1PXU",
  authDomain: "paipersum-eedba.firebaseapp.com",
  projectId: "paipersum-eedba",
  storageBucket: "paipersum-eedba.firebasestorage.app",
  messagingSenderId: "1022508900305",
  appId: "1:1022508900305:web:4203a4962cd7f5e78e8af0",
  measurementId: "G-R0FC8CQ5FG"
};

const app = initializeApp(firebaseConfig);

// Initialize analytics only if supported (i.e., in browser)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
