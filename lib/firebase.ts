// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1nZ7W6TxTCKcqkogtpRS5q_TJDsxcBmY",
  authDomain: "runteq-417906.firebaseapp.com",
  projectId: "runteq-417906",
  storageBucket: "runteq-417906.appspot.com",
  messagingSenderId: "976355655065",
  appId: "1:976355655065:web:82b9e08c717939f404e708",
  measurementId: "G-K8S07YXGZ5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);

if (!getApps()?.length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();


export default firebaseApp;
