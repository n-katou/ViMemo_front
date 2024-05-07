// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBTeINHuytWKsQdYLQn9WNqRwHKzwTUFA",
  authDomain: "vimemo-63237.firebaseapp.com",
  projectId: "vimemo-63237",
  storageBucket: "vimemo-63237.appspot.com",
  messagingSenderId: "658482743555",
  appId: "1:658482743555:web:1e03f3a90b97f560db0136",
  measurementId: "G-BSTSJJB3RF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
