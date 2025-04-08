import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC5ACIyr1lpbw5asUP-J7l36uluaE1DyCA",
  authDomain: "decatron1-2b8cd.firebaseapp.com",
  projectId: "decatron1-2b8cd",
  storageBucket: "decatron1-2b8cd.firebasestorage.app",
  messagingSenderId: "581268509906",
  appId: "1:581268509906:web:8826b8c859fef88b5f090b",
};

const app = initializeApp(firebaseConfig);
const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export { messaging, onMessage, getToken };
