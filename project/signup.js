// DOM Elements
const donorToggle = document.getElementById('donor-toggle');
const receiverToggle = document.getElementById('receiver-toggle');
const userTypeInput = document.getElementById('user-type');
const signupForm = document.getElementById('signup-form');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');

// Error elements
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const phoneError = document.getElementById('phone-error');
const addressError = document.getElementById('address-error');

// Toggle between Donor and Receiver
donorToggle.addEventListener('click', () => {
    donorToggle.classList.add('active');
    receiverToggle.classList.remove('active');
    userTypeInput.value = 'donor';
});

receiverToggle.addEventListener('click', () => {
    receiverToggle.classList.add('active');
    donorToggle.classList.remove('active');
    userTypeInput.value = 'receiver';
});

// Form Validation
function validateForm() {
    let isValid = true;
    
    // Reset error messages
    nameError.textContent = '';
    emailError.textContent = '';
    passwordError.textContent = '';
    phoneError.textContent = '';
    addressError.textContent = '';
    
    // Validate Full Name
    if (!fullNameInput.value.trim()) {
        nameError.textContent = 'Full name is required';
        isValid = false;
    }
    
    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value)) {
        emailError.textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate Password
    if (passwordInput.value.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        isValid = false;
    }
    
    // Validate Phone
    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(phoneInput.value.replace(/\D/g, ''))) {
        phoneError.textContent = 'Please enter a valid 10-digit phone number';
        isValid = false;
    }
    
    // Validate Address
    if (!addressInput.value.trim()) {
        addressError.textContent = 'Address is required';
        isValid = false;
    }
    
    return isValid;
}

// Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        // Create user object
        const userData = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            phone: phoneInput.value.trim(),
            address: addressInput.value.trim(),
            userType: userTypeInput.value
        };
        
        // Store user data in localStorage
        saveUser(userData);
        
        // Show success message
        alert('Account created successfully! Please login.');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
});

// Save user to localStorage
function saveUser(userData) {
    // Get existing users or initialize empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Add new user
    users.push(userData);
    
    // Save back to localStorage
    localStorage.setItem('users', JSON.stringify(users));
}