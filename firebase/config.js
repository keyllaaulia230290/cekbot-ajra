// Firebase Config
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  push,
  get,
  child,
  update,
  remove,
  onValue
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGEqaywnEPBE65CxlzJYg9yTbyABebNuY",
  authDomain: "cekbot-2140c.firebaseapp.com",
  databaseURL: "https://cekbot-2140c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cekbot-2140c",
  storageBucket: "cekbot-2140c.firebasestorage.app",
  messagingSenderId: "589528051054",
  appId: "1:589528051054:web:9407654b666cbfe6c6e57f"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const auth = getAuth(app);

export {
  db,
  auth,
  ref,
  set,
  push,
  get,
  child,
  update,
  remove,
  onValue,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
};