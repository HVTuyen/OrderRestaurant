// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbL6eH9eWg4eCQb2gqmU0onlNev9XZ5bU",
  authDomain: "orderrestaurant-3dcf5.firebaseapp.com",
  projectId: "orderrestaurant-3dcf5",
  storageBucket: "orderrestaurant-3dcf5.appspot.com",
  messagingSenderId: "134272785788",
  appId: "1:134272785788:web:b7c9dad83b4894230a58f9",
  measurementId: "G-M3YXVWSPHD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);