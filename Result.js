// uploadResult.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBydmpGMF48fQ4tf_bCXkwSFoMAaIIOOEk",
  authDomain: "my-pro-1-62aa0.firebaseapp.com",
  projectId: "my-pro-1-62aa0",
  storageBucket: "my-pro-1-62aa0.firebasestorage.app",
  messagingSenderId: "717474281266",
  appId: "1:717474281266:web:70b498994e8e4a4134492b",
  measurementId: "G-0NB0BQJFZZ"
};

// Firebase initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Upload function
const uploadResult = async () => {
  try {
    await addDoc(collection(db, "results"), {
      name: "সাইফুল ইসলাম",
      fatherName: "আব্দুল হাকিম",
      class: "ইফতা",
      idNo: "৪৩০৩২৬",
      exam: "বার্ষিক",
      year: "১৪৪২-১৪৪৩ মোতাবেক ২০২১-২০২২",
      subjects: [
        { name: "আল-আশবাহ", fullMarks: 100, obtained: 83 },
        { name: "মুকাদ্দামাহ", fullMarks: 100, obtained: 90 },
        { name: "উসুলুল ইফতা", fullMarks: 100, obtained: 76 },
        { name: "সিরাজি", fullMarks: 100, obtained: 79 },
        { name: "কাওয়াইদুল ফিকহ", fullMarks: 100, obtained: 62 },
        { name: "শরহুল উকুদ", fullMarks: 100, obtained: 90 },
        { name: "কিরাআত", fullMarks: 100, obtained: 0 },
        { name: "তামরিন", fullMarks: 100, obtained: 43 },
      ],
      total: 733,
      grade: "জায়্যিদ জিদ্দান",
      position: "প্রজোয্য নয়"
    });

    await addDoc(collection(db, "results"), {
      name: "সানাউল্লাহ মারুফ",
      fatherName: "মো: আ:কুদ্দুস",
      class: "ইফতা",
      idNo: "৪৪০৩০১",
      exam: "বার্ষিক",
      year: "১৪৪৩-১৪৪৫ মোতাবেক ২০২২-২০২৩",
      subjects: [
        { name: "আল-আশবাহ", fullMarks: 100, obtained: 97 },
        { name: "মুকাদ্দামাহ", fullMarks: 100, obtained: 91 },
        { name: "উসুলুল ইফতা", fullMarks: 100, obtained: 94 },
        { name: "সিরাজি", fullMarks: 100, obtained: 93 },
        { name: "কাওয়াইদুল ফিকহ", fullMarks: 100, obtained: 90 },
        { name: "শরহুল উকুদ", fullMarks: 100, obtained: 88 },
        { name: "কিরাআত", fullMarks: 100, obtained: 90 },
        { name: "তামরিন", fullMarks: 100, obtained: 90 },
      ],
      total: 733,
      grade: "মুমতাজ",
      position: "প্রথম"
    });



    console.log("✅ ডেটা সফলভাবে আপলোড হয়েছে!");
  } catch (error) {
    console.error("❌ ডেটা আপলোডে সমস্যা:", error);
  }
};

uploadResult();
