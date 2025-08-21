// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// project's firebaseConfig
const firebaseConfig = {
  apiKey: "AIzaSyBydmpGMF48fQ4tf_bCXkwSFoMAaIIOOEk",
  authDomain: "my-pro-1-62aa0.firebaseapp.com",
  projectId: "my-pro-1-62aa0",
  storageBucket: "my-pro-1-62aa0.appspot.com",
  messagingSenderId: "717474281266",
  appId: "1:717474281266:web:70b498994e8e4a4134492b",
  measurementId: "G-0NB0BQJFZZ"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
