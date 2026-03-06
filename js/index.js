import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
        import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyB3YsqmPng3BdsgbZXs-Ok1c5Z4e1HZhkY",
            authDomain: "mewnly.firebaseapp.com",
            projectId: "mewnly",
            storageBucket: "mewnly.firebasestorage.app",
            messagingSenderId: "854522459869",
            appId: "1:854522459869:web:edc0df5aad55ca1f4e8d34"
        };

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = getAuth(app);

        window.isUsernameTaken = async (username) => {
            const q = query(collection(db, "users"), where("username", "==", username.toLowerCase()));
            const querySnapshot = await getDocs(q);
            return !querySnapshot.empty;
        };

        window.firebaseLogin = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
        window.firebaseRegister = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
        window.saveUserData = (uid, data) => setDoc(doc(db, "users", uid), data);
        window.getUserByNick = async (nick) => {
            const q = query(collection(db, "users"), where("username", "==", nick.toLowerCase()));
            return await getDocs(q);
        };