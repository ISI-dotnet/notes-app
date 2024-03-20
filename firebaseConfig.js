import { getAuth } from '@firebase/auth';
import { initializeApp } from '@firebase/app';
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: 'AIzaSyC_A0Ov-pIP4wN2tuq3WuEwR4fvYLADcuE',
    authDomain: 'vu-noteapp-v2.firebaseapp.com',
    databaseURL: 'https://vu-noteapp-v2-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'vu-noteapp-v2',
    storageBucket: 'vu-noteapp-v2.appspot.com',
    messagingSenderId: '683996676974',
    appId: '1:683996676974:android:e3e50105f4fccae6a3777f',
    measurementId: 'G-measurement-id',
  };


export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);