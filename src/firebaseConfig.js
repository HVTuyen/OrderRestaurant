// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDT69ojFXftlaXUrQT6SOpM5XNf9bhp0ZI",
  authDomain: "file-eb9e1.firebaseapp.com",
  projectId: "file-eb9e1",
  storageBucket: "file-eb9e1.appspot.com",
  messagingSenderId: "241714522619",
  appId: "1:241714522619:web:eeadef09b3e5fc30ccc35e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);