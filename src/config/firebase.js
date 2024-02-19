
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUd8zChw3L2Og9MHPPdv1WKstrAC-tNxw",
  authDomain: "invoice-generator-a335d.firebaseapp.com",
  projectId: "invoice-generator-a335d",
  storageBucket: "invoice-generator-a335d.appspot.com",
  messagingSenderId: "50199359484",
  appId: "1:50199359484:web:dc3a176b520cba6c5b8c79",
  measurementId: "G-XV96W56WW0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);