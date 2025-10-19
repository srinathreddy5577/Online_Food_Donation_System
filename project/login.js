// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const rememberMeCheckbox = document.getElementById('remember-me');
const emailError = document.getElementById('login-email-error');
const passwordError = document.getElementById('login-password-error');

// Check if user is already logged in
function checkLoggedInUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        redirectToDashboard(currentUser.userType);
    }
}

// Run on page load
checkLoggedInUser();

// Form Validation
function validateForm() {
    let isValid = true;
    
    // Reset error messages
    emailError.textContent = '';
    passwordError.textContent = '';
    
    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate Password
    if (!passwordInput.value) {
        passwordError.textContent = 'Password is required';
        isValid = false;
    }
    
    return isValid;
}

// Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Check credentials
        const user = authenticateUser(email, password);
        
        if (user) {
            // Store current user in localStorage
            if (rememberMeCheckbox.checked) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(user));
            }
            
            // Redirect to appropriate dashboard
            redirectToDashboard(user.userType);
        } else {
            // Show error message
            passwordError.textContent = 'Invalid email or password';
        }
    }
});

// Authenticate user
function authenticateUser(email, password) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email and password
    return users.find(user => user.email === email && user.password === password);
}

// Redirect to dashboard based on user type
function redirectToDashboard(userType) {
    if (userType === 'donor') {
        window.location.href = 'donor-dashboard.html';
    } else if (userType === 'receiver') {
        window.location.href = 'receiver-dashboard.html';
    }
}