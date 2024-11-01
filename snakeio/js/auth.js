document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginContainer = document.querySelector('.login-container');
    const registerContainer = document.querySelector('.register-container');
    const validationMessage = document.getElementById('validationMessage');

    // Redirect if a user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'game.html';
    }

    // Display a temporary validation message
    function showValidationMessage(message) {
        validationMessage.textContent = message;
        validationMessage.style.display = 'block';
        setTimeout(() => {
            validationMessage.style.display = 'none';
        }, 3000);
    }

    // Check password requirements
    function validatePassword(password) {
        if (password.length < 8) {
            showValidationMessage('Password must be at least 8 characters long');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            showValidationMessage('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[a-z]/.test(password)) {
            showValidationMessage('Password must contain at least one lowercase letter');
            return false;
        }
        if (!/\d/.test(password)) {
            showValidationMessage('Password must contain at least one number');
            return false;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            showValidationMessage('Password must contain at least one special character');
            return false;
        }
        return true;
    }

    // Check email format
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showValidationMessage('Please enter a valid email address (e.g., user@example.com)');
            return false;
        }
        return true;
    }

    // Check phone number format (11 digits)
    function validatePhone(phone) {
        const phoneRegex = /^\d{11}$/;
        if (!phoneRegex.test(phone)) {
            showValidationMessage('Phone number must be exactly 11 digits');
            return false;
        }
        return true;
    }

    // Toggle between login and registration forms
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.classList.add('hidden');
        registerContainer.classList.remove('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'game.html';
        } else {
            showValidationMessage('Invalid username or password');
        }
    });

    // Handle registration form submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const email = document.getElementById('newEmail').value;
        const phone = document.getElementById('newNumber').value;

        // Validate email, phone, and password
        if (!validateEmail(email)) return;
        if (!validatePhone(phone)) return;
        if (!validatePassword(password)) return;

        if (password !== confirmPassword) {
            showValidationMessage('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Check for existing username or email
        if (users.some(u => u.username === username)) {
            showValidationMessage('Username already exists');
            return;
        }

        if (users.some(u => u.email === email)) {
            showValidationMessage('Email already registered');
            return;
        }

        // Add new user to local storage
        const newUser = { 
            username, 
            password, 
            email, 
            phone, 
            highScore: 0 
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        window.location.href = 'game.html';
    });
});
