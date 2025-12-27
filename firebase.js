// Firebase Configuration

import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCWyVKASd98VSRDMs9paouY6orCQmv5tDs",
  authDomain: "smart-medicine-box-7e584.firebaseapp.com",
  projectId: "smart-medicine-box-7e584",
  storageBucket: "smart-medicine-box-7e584.firebasestorage.app",
  messagingSenderId: "204063795670",
  appId: "1:204063795670:web:bf53d75092922600a31c77"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();




