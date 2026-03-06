import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { getFirestore, collection, query, where, getDocs, or } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

        // Функция глобального поиска
        window.findUsers = async (searchQuery) => {
            const q = query(
                collection(db, "users"),
                or(
                    where("username", "==", searchQuery.toLowerCase()),
                    where("realName", "==", searchQuery),
                    where("userId", "==", searchQuery) // Поиск по ID
                )
            );
            const snap = await getDocs(q);
            let results = [];
            snap.forEach(doc => results.push({ id: doc.id, ...doc.data() }));
            return results;
        };