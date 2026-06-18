import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCA5R27TjMXBSY6zL8VQz66k-0QtM6lcpQ",
  authDomain: "gen-lang-client-0695756962.firebaseapp.com",
  projectId: "gen-lang-client-0695756962",
  storageBucket: "gen-lang-client-0695756962.firebasestorage.app",
  messagingSenderId: "120851955030",
  appId: "1:120851955030:web:c519fda0a6e441946daaf7"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-3ce236b0-0415-41dc-904c-6f4eab4e4c4d");
