import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "...",
  vapidKey: "...", // optional, used in getToken()
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };
