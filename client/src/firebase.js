// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCl9PteJwq_EZ6VbhVoLHG9mWQbWGdyztQ",
  authDomain: "real-estate-bdee6.firebaseapp.com",
  projectId: "real-estate-bdee6",
  storageBucket: "real-estate-bdee6.appspot.com",
  messagingSenderId: "162384438525",
  appId: "1:162384438525:web:8a89cfddc127124ed78a94",
  measurementId: "G-GE13NFBEQL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
