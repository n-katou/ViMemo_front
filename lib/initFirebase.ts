import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCBTeINHuytWKsQdYLQn9WNqRwHKzwTUFA",
  authDomain: "vimemo-63237.firebaseapp.com",
  projectId: "vimemo-63237",
  storageBucket: "vimemo-63237.appspot.com",
  messagingSenderId: "658482743555",
  appId: "1:658482743555:web:1e03f3a90b97f560db0136",
  measurementId: "G-BSTSJJB3RF"
};

const getFirebaseApp = () => {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  } else {
    return getApp();
  }
};

const app = getFirebaseApp();
export const auth = getAuth(app);

let analytics: Analytics | null = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { analytics };
