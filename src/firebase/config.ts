import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyCdLVcIy5j3JIh1Is0s2KSIq2OKoJo0sXA",
    authDomain: "mkt-alimentos-a-vencer.firebaseapp.com",
    projectId: "mkt-alimentos-a-vencer",
    storageBucket: "mkt-alimentos-a-vencer.firebasestorage.app",
    messagingSenderId: "328877125256",
    appId: "1:328877125256:web:1a205c79a1e684212e793d"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage }