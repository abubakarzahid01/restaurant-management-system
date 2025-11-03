// Toggle forms
document.getElementById('showSignup').addEventListener('click', () => {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
    document.getElementById('signupContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
});

// Login - UPDATED for new API
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            if (data.data.user.role === 'admin') {
                window.location.href = '/admin/index.html';
            } else {
                window.location.href = '/dashboard.html';
            }
        } else {
            document.getElementById('loginMessage').textContent = data.message || 'Login failed';
            document.getElementById('loginMessage').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('loginMessage').textContent = 'Error connecting to server';
        document.getElementById('loginMessage').style.color = 'red';
    }
});

// Signup - UPDATED for new API
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        
        if (data.success) {
            document.getElementById('signupMessage').textContent = 'Signup successful! Redirecting to login...';
            document.getElementById('signupMessage').style.color = 'green';
            
            setTimeout(() => {
                document.getElementById('signupContainer').style.display = 'none';
                document.getElementById('loginContainer').style.display = 'block';
                document.getElementById('signupMessage').textContent = '';
                document.getElementById('signupForm').reset();
            }, 2000);
        } else {
            document.getElementById('signupMessage').textContent = data.message || 'Signup failed';
            document.getElementById('signupMessage').style.color = 'red';
        }
    } catch (error) {
        document.getElementById('signupMessage').textContent = 'Error connecting to server';
        document.getElementById('signupMessage').style.color = 'red';
    }
});