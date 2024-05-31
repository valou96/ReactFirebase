// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAR4JMSlllhuXhZqL4uKNJDHxab_cBQGIQ",
  authDomain: "todolist-2226e.firebaseapp.com",
  projectId: "todolist-2226e",
  storageBucket: "todolist-2226e.appspot.com",
  messagingSenderId: "954134392436",
  appId: "1:954134392436:web:6aa07247fe179e9899ab21",
  measurementId: "G-CMCYW1XEXK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);