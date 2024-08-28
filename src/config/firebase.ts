import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAqsP0xAaecuB05WMruDnsimjC5mPC_bgA",
  authDomain: "beyond-profiler.firebaseapp.com",
  projectId: "beyond-profiler",
  storageBucket: "beyond-profiler.appspot.com",
  messagingSenderId: "968666768234",
  appId: "1:968666768234:web:cb4d6ef6afc99b6d207b13",
  measurementId: "G-ZCX5VLRQN3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
