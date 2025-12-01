// ===== AUTHENTICATION HANDLER =====

// Check if user is already logged in
function checkAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            console.log("✅ User logged in:", user.email);
            
            // Save user info to localStorage
            localStorage.setItem('userEmail', user.email);
            localStorage.setItem('userId', user.uid);
            
            // Redirect to dashboard if on login page
            if (window.location.pathname.endsWith('index.html') || 
                window.location.pathname === '/') {
                window.location.href = 'dashboard.html';
            }
        } else {
            // User is signed out
            console.log("⚠️ No user logged in");
            
            // Clear localStorage
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userId');
            
            // Redirect to login if not on login page
            if (!window.location.pathname.endsWith('index.html') && 
                window.location.pathname !== '/') {
                window.location.href = 'index.html';
            }
        }
    });
}

// Login function
function loginUser(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

// Logout function
function logoutUser() {
    return firebase.auth().signOut();
}

// Register function
function registerUser(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

// Show message
function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('messageBox');
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = 'message-box show ' + type;
        
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, 5000);
    }
}

// ===== EVENT LISTENERS FOR LOGIN PAGE =====
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        try {
            // Set persistence
            const persistence = rememberMe ? 
                firebase.auth.Auth.Persistence.LOCAL : 
                firebase.auth.Auth.Persistence.SESSION;
            
            await firebase.auth().setPersistence(persistence);
            
            // Login
            await loginUser(email, password);
            
            showMessage('✅ Login berhasil! Mengalihkan...', 'success');
            
            // Redirect after 1 second
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
            
        } catch (error) {
            console.error('Login error:', error);
            
            let errorMessage = '❌ Login gagal! ';
            
            switch(error.code) {
                case 'auth/user-not-found':
                    errorMessage += 'Email tidak terdaftar.';
                    break;
                case 'auth/wrong-password':
                    errorMessage += 'Password salah.';
                    break;
                case 'auth/invalid-email':
                    errorMessage += 'Format email tidak valid.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage += 'Terlalu banyak percobaan. Coba lagi nanti.';
                    break;
                default:
                    errorMessage += error.message;
            }
            
            showMessage(errorMessage, 'error');
        }
    });
}

// Register link handler (optional)
if (document.getElementById('registerLink')) {
    document.getElementById('registerLink').addEventListener('click', (e) => {
        e.preventDefault();
        
        const email = prompt('Masukkan email untuk registrasi:');
        if (!email) return;
        
        const password = prompt('Masukkan password (min. 6 karakter):');
        if (!password) return;
        
        if (password.length < 6) {
            alert('Password minimal 6 karakter!');
            return;
        }
        
        registerUser(email, password)
            .then(() => {
                alert('✅ Registrasi berhasil! Silakan login.');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Register error:', error);
                
                let errorMessage = '❌ Registrasi gagal! ';
                
                switch(error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage += 'Email sudah terdaftar.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage += 'Format email tidak valid.';
                        break;
                    case 'auth/weak-password':
                        errorMessage += 'Password terlalu lemah.';
                        break;
                    default:
                        errorMessage += error.message;
                }
                
                alert(errorMessage);
            });
    });
}

// ===== LOGOUT HANDLER =====
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        logoutUser()
            .then(() => {
                console.log('✅ Logout berhasil');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Logout error:', error);
                alert('❌ Logout gagal: ' + error.message);
            });
    }
}

// Initialize auth check
checkAuth();