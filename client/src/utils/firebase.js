


import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-bface.firebaseapp.com",
  projectId: "interviewiq-bface",
  storageBucket: "interviewiq-bface.firebasestorage.app",
  messagingSenderId: "688318328364",
  appId: "1:688318328364:web:8d87f3d8441e6b4d3eeb89",
  measurementId: "G-7TDTZG4XXG"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export{auth , provider}
