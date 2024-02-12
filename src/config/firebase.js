// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFRz_wwAG9fzrxsdw4iv6_HxHorTeW7zU",
  authDomain: "task-tracker-34bfc.firebaseapp.com",
  projectId: "task-tracker-34bfc",
  storageBucket: "task-tracker-34bfc.appspot.com",
  messagingSenderId: "75969722037",
  appId: "1:75969722037:web:65f88a1832c15162a070fc",
  measurementId: "G-MM9F9D39CZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const googleProvider = new GoogleAuthProvider();