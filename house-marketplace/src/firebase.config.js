// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT8-8gtL6hF0byv9NxQ4a1frwO8Oxkb1o",
  authDomain: "house-marketplace-app-c49b0.firebaseapp.com",
  projectId: "house-marketplace-app-c49b0",
  storageBucket: "house-marketplace-app-c49b0.appspot.com",
  messagingSenderId: "304707065079",
  appId: "1:304707065079:web:8eea5cba3135b28fa6eff2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
