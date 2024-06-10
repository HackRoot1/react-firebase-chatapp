import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-fc54b.firebaseapp.com",
  projectId: "reactchat-fc54b",
  storageBucket: "reactchat-fc54b.appspot.com",
  messagingSenderId: "13951374590",
  appId: "1:13951374590:web:f196f7c88ed5bd756a41af"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();