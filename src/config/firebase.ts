import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAaISC6rD8iposOcQ5svohCFegV1i6JeYk",
  authDomain: "beyondprofiler.firebaseapp.com",
  projectId: "beyondprofiler",
  storageBucket: "beyondprofiler.appspot.com",
  messagingSenderId: "1011632206176",
  appId: "1:1011632206176:web:cc8603a2356c380702ee05",
  measurementId: "G-M2TPD88KTR",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
