// ===== FIREBASE CONFIGURATION =====
// Konfigurasi Firebase Anda

const firebaseConfig = {
  apiKey: "AIzaSyDHZmmpr-1_X7ysBoLpSbFeSKeB5uR6Z2g",
  authDomain: "data-member-8ca70.firebaseapp.com",
  projectId: "data-member-8ca70",
  storageBucket: "data-member-8ca70.firebasestorage.app",
  messagingSenderId: "916173243280",
  appId: "1:916173243280:web:122d20b2f2296b33576915",
  measurementId: "G-LYKQN9S27H"
};

// Initialize Firebase
let app;
let auth;
let db;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log("✅ Firebase berhasil diinisialisasi");
} catch (error) {
    console.error("❌ Error inisialisasi Firebase:", error);
}
