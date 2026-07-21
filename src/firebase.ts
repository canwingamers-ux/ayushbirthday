import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCNDPNKSRmyvS5ObuAjy_BpiAS-Y0Fy5bw",
  authDomain: "birthdayyyyyyyyyyyyyyyyyy.firebaseapp.com",
  databaseURL: "https://birthdayyyyyyyyyyyyyyyyyy-default-rtdb.firebaseio.com",
  projectId: "birthdayyyyyyyyyyyyyyyyyy",
  storageBucket: "birthdayyyyyyyyyyyyyyyyyy.firebasestorage.app",
  messagingSenderId: "314509441338",
  appId: "1:314509441338:web:6a4e72fde285cf0ed93803",
  measurementId: "G-BCV514WMDK"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
