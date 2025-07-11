// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCp-u3tK4AU2ga4jK3-I4ElnoPtF5wdXA0",
  authDomain: "studynotes2-0-7.firebaseapp.com",
  projectId: "studynotes2-0-7",
  storageBucket: "studynotes2-0-7.firebasestorage.app",
  messagingSenderId: "772194245540",
  appId: "1:772194245540:web:8f2e0d8e4000333a6d3f31",
  measurementId: "G-MFNNPS0B05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, db };

