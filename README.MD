WEBSITE DATA MEMBER — Manajemen Data Member
1. Nama Project

Manajemen Data Member – WEBSITE DATA MEMBER

2. Nama Kelompok & Anggota

Kelompok 7 – Prodi Sistem Informasi
Anggota:

Julianda – Coding & Implementasi

Faidan AlHaqiqi – Dokumen SRS

Deliya – Dokumen SRS

Fiya Irhamna – Desain UI

3. Deskripsi Singkat Aplikasi

Modul Data Member adalah fitur untuk mengelola data pelanggan yang terdaftar sebagai member. Admin dapat:

✔ Menambah member
✔ Mengedit data member
✔ Menghapus member
✔ Melihat daftar member
✔ Mencari berdasarkan nama/email
✔ Menyimpan data ke database (Firebase / MySQL)

Aplikasi ini membantu toko dalam melakukan pengelolaan data member secara cepat, terstruktur, dan aman.

4. Tujuan Sistem
Permasalahan:

Data member masih dicatat manual

Sulit mencari data tertentu

Data tidak terpusat

Potensi hilang/berganda

Tujuan Sistem:

Membuat sistem CRUD member

Database real-time

Memudahkan administrasi

Menjadi dasar untuk membership/promo

5. Teknologi yang Digunakan
Arsitektur

Client → Firebase (Serverless)

Alternatif: PHP + MySQL

Bahasa & Tools

HTML

CSS

JavaScript

Firebase Authentication

Firebase Firestore

Deployment via GitHub Pages

Struktur Data Member
id         : auto-generated  
name       : string  
email      : string  
phone      : string  
address    : string  
join_date  : timestamp  
status     : active / inactive

6. Cara Menjalankan Aplikasi
A. Instalasi

Clone repository:

git clone https://github.com/hanansaladbuah-bit/WEBSITE-DATA-MEMBER

B. File Utama

index.html

members.html

add-member.html

dashboard.html

js/member-crud.js

js/firebase-config.js

C. Konfigurasi Firebase

Edit file:

js/firebase-config.js


Contoh format:

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

D. Menjalankan

Buka index.html

Login sebagai admin

Masuk menu Data Member

7. Akun Admin (Hanya 1 Admin)
Role	Email	Password
Admin Utama	liahanan51@gmail.com
	210705
8. Link Repository / Deployment

GitHub Repository:
🔗 https://github.com/hanansaladbuah-bit/WEBSITE-DATA-MEMBER

9. Screenshot Halaman

Tabel Member → images/members-list.png

Form Tambah/Edit Member → images/members-form.png

(opsional, tambahkan nanti)

10. Catatan Penting

Akses hanya untuk admin

Data tersimpan otomatis

Validasi input tersedia

Dapat dikembangkan menjadi sistem loyalty/promo

11. Keterangan Tugas

Dokumentasi dibuat untuk tugas Final Project – Rekayasa Perangkat Lunak (RPL).
Dosen: Dila Nurlaila, M.Kom.