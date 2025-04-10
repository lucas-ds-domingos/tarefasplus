import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX6nOBtU5qk9tsJMzs5d7rwpplcw7d3LM",
  authDomain: "tarefasd.firebaseapp.com",
  projectId: "tarefasd",
  storageBucket: "tarefasd.firebasestorage.app",
  messagingSenderId: "834095855057",
  appId: "1:834095855057:web:598ac7fa2d47b4ad81dcf0",
  measurementId: "G-G886W5TCSQ"
};
const FirebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(FirebaseApp)


export {db};
