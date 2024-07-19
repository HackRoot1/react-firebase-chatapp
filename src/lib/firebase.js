import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-b706e.firebaseapp.com",
  projectId: "chatapp-b706e",
  storageBucket: "chatapp-b706e.appspot.com",
  messagingSenderId: "980026167293",
  appId: "1:980026167293:web:3da84c3411c61764809394"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();