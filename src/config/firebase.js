// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1LAbc1vBzU7z4brVLRZ3gNFc3AjbPldk",
  authDomain: "show-me-stl.firebaseapp.com",
  projectId: "show-me-stl",
  storageBucket: "show-me-stl.firebasestorage.app",
  messagingSenderId: "915773859776",
  appId: "1:915773859776:web:b1bf9c5f70c35a57b5ca25",
  measurementId: "G-6B7NH1E88R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export { app, auth };