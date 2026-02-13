import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔹 METTRE ICI TON FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "TA_CLE",
  authDomain: "TON_AUTH",
  projectId: "TON_PROJECT_ID",
  storageBucket: "TON_BUCKET",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const postsRef = collection(db, "posts");

// Générer un ID unique pour le post
function generateID() {
    return "SN-" + Math.floor(Math.random() * 100000) + "-A";
}

// Choisir une classification aléatoire
function getClassification() {
    const levels = ["PUBLIC","CONFIDENTIEL","RESTREINT","SECRET"];
    return levels[Math.floor(Math.random() * levels.length)];
}

// Créer un post
window.createPost = async function() {
    const input = document.getElementById("postInput");
    if(input.value.trim() === "") return;

    await addDoc(postsRef, {
        id: generateID(),
        content: input.value,
        classification: getClassification(),
        likes: 0,
        time: new Date()
    });

    input.value = "";
};

// Afficher tous les posts en temps réel
const q = query(postsRef, orderBy("time","desc"));

onSnapshot(q, (snapshot) => {
    const container = document.getElementById("posts");
    container.innerHTML = "";

    snapshot.forEach((docSnap) => {
        const post = docSnap.data();
        container.innerHTML += `
            <div class="post">
                <div><strong>${post.id}</strong></div>
                <div class="classification">Niveau : ${post.classification}</div>
                <p>${post.content}</p>
                <small>${new Date(post.time.seconds * 1000).toLocaleString()}</small><br>
                <button onclick="likePost('${docSnap.id}', ${post.likes})">▲ ${post.likes}</button>
            </div>
        `;
    });
});

// Like d’un post
window.likePost = async function(docId, currentLikes){
    const docRef = doc(db, "posts", docId);
    await updateDoc(docRef, {likes: currentLikes + 1});
};
