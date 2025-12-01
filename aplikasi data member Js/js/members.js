// ===== MEMBERS CRUD LOGIC =====

let allMembers = [];
let filteredMembers = [];

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
        
        filteredMembers = [...allMembers];
        displayMembers(filteredMembers);
        updatePaginationInfo();
        
    } catch (error) {
        console.error('❌ Error loading members:', error);
        showErrorMessage('Gagal memuat data member: ' + error.message);
    }
}

// Display members in table
function displayMembers(members) {
    const tbody = document.getElementById('membersTableBody');
    
    if (!tbody) return;
    
    if (members.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="empty-state">Tidak ada data member yang sesuai</td></tr>';
        return;
    }
    
    tbody.innerHTML = members.map(member => `
        <tr>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.address || '-'}</td>
            <td>
                <span class="badge badge-${member.status === 'aktif' ? 'active' : 'inactive'}">
                    ${member.status}
                </span>
            </td>
            <td>${formatDate(member.joinDate)}</td>
            <td>
                <button class="btn btn-edit" onclick="openEditModal('${member.id}')">✏️ Edit</button>
                <button class="btn btn-delete" onclick="deleteMember('${member.id}')">🗑️ Hapus</button>
            </td>
        </tr>
    `).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Search members
function searchMembers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus') ? 
        document.getElementById('filterStatus').value : 'semua';
    
    filteredMembers = allMembers.filter(member => {
        const matchSearch = member.name.toLowerCase().includes(searchTerm) ||
                          member.email.toLowerCase().includes(searchTerm) ||
                          member.phone.includes(searchTerm);
        
        const matchStatus = statusFilter === 'semua' || member.status === statusFilter;
        
        return matchSearch && matchStatus;
    });
    
    displayMembers(filteredMembers);
    updatePaginationInfo();
}

// Filter by status
function filterByStatus() {
    searchMembers();
}

// Update pagination info
function updatePaginationInfo() {
    const info = document.getElementById('paginationInfo');
    if (info) {
        info.textContent = `Menampilkan ${filteredMembers.length} dari ${allMembers.length} member`;
    }
}

// Delete member
async function deleteMember(id) {
    if (!confirm('⚠️ Apakah Anda yakin ingin menghapus member ini?')) {
        return;
    }
    
    try {
        await db.collection('members').doc(id).delete();
        console.log('✅ Member deleted:', id);
        alert('✅ Member berhasil dihapus!');
        loadMembers();
    } catch (error) {
        console.error('❌ Error deleting member:', error);
        alert('❌ Gagal menghapus member: ' + error.message);
    }
}

// Open edit modal
function openEditModal(id) {
    const member = allMembers.find(m => m.id === id);
    if (!member) return;
    
    document.getElementById('editMemberId').value = id;
    document.getElementById('editMemberName').value = member.name;
    document.getElementById('editMemberEmail').value = member.email;
    document.getElementById('editMemberPhone').value = member.phone;
    document.getElementById('editMemberAddress').value = member.address || '';
    document.getElementById('editMemberStatus').value = member.status;
    document.getElementById('editMemberJoinDate').value = member.joinDate;
    
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    document.getElementById('editMemberForm').reset();
}

// Handle edit form submission
if (document.getElementById('editMemberForm')) {
    document.getElementById('editMemberForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('editMemberId').value;
        const memberData = {
            name: document.getElementById('editMemberName').value,
            email: document.getElementById('editMemberEmail').value,
            phone: document.getElementById('editMemberPhone').value,
            address: document.getElementById('editMemberAddress').value,
            status: document.getElementById('editMemberStatus').value,
            joinDate: document.getElementById('editMemberJoinDate').value,
            updatedAt: new Date().toISOString()
        };
        
        try {
            await db.collection('members').doc(id).update(memberData);
            console.log('✅ Member updated:', id);
            alert('✅ Member berhasil diupdate!');
            closeEditModal();
            loadMembers();
        } catch (error) {
            console.error('❌ Error updating member:', error);
            alert('❌ Gagal mengupdate member: ' + error.message);
        }
    });
}

// Show error message
function showErrorMessage(message) {
    const tbody = document.getElementById('membersTableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; color: #dc3545; padding: 20px;">
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

// Initialize members page
function initMembersPage() {
    console.log('🚀 Initializing members page...');
    
    setCurrentDate();
    setUserInfo();
    loadMembers();
    setupRealtimeListener();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMembersPage);
} else {
    initMembersPage();
}