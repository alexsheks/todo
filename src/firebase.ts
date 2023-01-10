// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyATWCJuqPYa6h1pN4EHjzqsPu5eGPBk37o',
  authDomain: 'todo-9d851.firebaseapp.com',
  projectId: 'todo-9d851',
  storageBucket: 'todo-9d851.appspot.com',
  messagingSenderId: '147982034854',
  appId: '1:147982034854:web:6c2f9589c4c952b9e85167'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
