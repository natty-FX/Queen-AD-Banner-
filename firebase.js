import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWb61uJSVQPDYyjl2JiPvlvzk0LVUddgI",
  authDomain: "queen-ad-banner-flex.firebaseapp.com",
  projectId: "queen-ad-banner-flex",
  storageBucket: "queen-ad-banner-flex.firebasestorage.app",
  messagingSenderId: "685559974760",
  appId: "1:685559974760:web:6c46e0b7f45ee2820a64dd"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);