// Admin Panel JavaScript - Common Functions

// Check authentication on page load
(function checkAuth() {
    const token = localStorage.getItem('adminToken');
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    
    // If not on login page and no token, redirect to login
    if (!window.location.pathname.includes('admin-login.html') && !token) {
        window.location.href = '/admin/admin-login.html';
        return;
    }
    
    // Check if user is admin
    if (!window.location.pathname.includes('admin-login.html') && user.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        logout();
        return;
    }
})();

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/admin-login.html';
}

// Get auth header
function getAuthHeader() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4CAF50' : '#F44336'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Confirm dialog
function confirmAction(message) {
    return confirm(message);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);