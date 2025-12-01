// ===== DASHBOARD LOGIC =====

let allMembers = [];

// Set current date
function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = new Date().toLocaleDateString('id-ID', options);
    }
}

// Set user info
function setUserInfo() {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        const emailElement = document.getElementById('userEmail');
        const avatarElement = document.getElementById('userAvatar');
        
        if (emailElement) {
            emailElement.textContent = userEmail;
        }
        
        if (avatarElement) {
            avatarElement.textContent = userEmail.charAt(0).toUpperCase();
        }
    }
}

// Load all members
async function loadMembers() {
    try {
        const snapshot = await db.collection('members')
            .orderBy('joinDate', 'desc')
            .get();
        
        allMembers = [];
        
        snapshot.forEach((doc) => {
            allMembers.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Loaded ${allMembers.length} members`);
        
        updateStatistics();
        displayRecentMembers();
        
    } catch (error) {
        console.error('❌ Error loading members:', error);
        showErrorMessage('Gagal memuat data member: ' + error.message);
    }
}

// Update statistics
function updateStatistics() {
    const total = allMembers.length;
    const active = allMembers.filter(m => m.status === 'aktif').length;
    const inactive = total - active;
    
    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Count new members this month
    const newThisMonth = allMembers.filter(member => {
        const joinDate = new Date(member.joinDate);
        return joinDate.getMonth() === currentMonth && 
               joinDate.getFullYear() === currentYear;
    }).length;
    
    // Update DOM
    document.getElementById('totalMembers').textContent = total;
    document.getElementById('activeMembers').textContent = active;
    document.getElementById('inactiveMembers').textContent = inactive;
    document.getElementById('newMembers').textContent = newThisMonth;
}

// Display recent members (top 5)
function displayRecentMembers() {
    const tbody = document.getElementById('recentMembersBody');
    
    if (!tbody) return;
    
    if (allMembers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Belum ada data member</td></tr>';
        return;
    }
    
    // Get top 5 recent members
    const recentMembers = allMembers.slice(0, 5);
    
    tbody.innerHTML = recentMembers.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>
                <span class="badge badge-${member.status === 'aktif' ? 'active' : 'inactive'}">
                    ${member.status}
                </span>
            </td>
            <td>${formatDate(member.joinDate)}</td>
        </tr>
    `).join('');
}

// Format date to Indonesian format
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Show error message
function showErrorMessage(message) {
    const tbody = document.getElementById('recentMembersBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #dc3545; padding: 20px;">
                    ❌ ${message}
                </td>
            </tr>
        `;
    }
}

// Setup real-time listener
function setupRealtimeListener() {
    db.collection('members').onSnapshot((snapshot) => {
        console.log('📡 Real-time update detected');
        loadMembers();
    }, (error) => {
        console.error('❌ Real-time listener error:', error);
    });
}

// Initialize dashboard
function initDashboard() {
    console.log('🚀 Initializing dashboard...');
    
    setCurrentDate();
    setUserInfo();
    loadMembers();
    setupRealtimeListener();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}