// DOM Elements
const donorNameSpan = document.getElementById('donor-name');
const donationForm = document.getElementById('donation-form');
const foodNameInput = document.getElementById('food-name');
const quantityInput = document.getElementById('quantity');
const pickupAddressInput = document.getElementById('pickup-address');
const donationsContainer = document.getElementById('donations-container');
const logoutLink = document.getElementById('logout-link');

// Check if user is logged in and is a donor
function checkLoggedInDonor() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    if (currentUser.userType !== 'donor') {
        // Redirect to appropriate dashboard
        window.location.href = currentUser.userType === 'receiver' ? 
                              'receiver-dashboard.html' : 'login.html';
        return;
    }
    
    // Display donor name
    donorNameSpan.textContent = `Welcome, ${currentUser.fullName}`;
    
    // Load donations
    loadDonations();
}

// Run on page load
checkLoggedInDonor();

// Donation Form Submission
donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Create donation object
    const donation = {
        id: Date.now(),
        foodName: foodNameInput.value.trim(),
        quantity: quantityInput.value.trim(),
        pickupAddress: pickupAddressInput.value.trim(),
        donor: {
            id: currentUser.email,
            name: currentUser.fullName,
            phone: currentUser.phone
        },
        status: 'available',
        date: new Date().toISOString()
    };
    
    // Save donation
    saveDonation(donation);
    
    // Reset form
    donationForm.reset();
    
    // Reload donations list
    loadDonations();
    
    // Show success message
    alert('Donation submitted successfully!');
});

// Save donation to localStorage
function saveDonation(donation) {
    // Get existing donations or initialize empty array
    let donations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Add new donation
    donations.push(donation);
    
    // Save back to localStorage
    localStorage.setItem('donations', JSON.stringify(donations));
}

// Load donations for current donor
function loadDonations() {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Get all donations
    const allDonations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Filter donations by current donor
    const myDonations = allDonations.filter(donation => 
        donation.donor.id === currentUser.email
    );
    
    // Display donations
    displayDonations(myDonations);
}

// Display donations in the list
function displayDonations(donations) {
    // Clear the container
    donationsContainer.innerHTML = '';
    
    if (donations.length === 0) {
        donationsContainer.innerHTML = '<p>No donations yet.</p>';
        return;
    }
    
    // Sort by date (newest first)
    donations.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create donation items
    donations.forEach(donation => {
        const donationItem = document.createElement('div');
        donationItem.classList.add('donation-item');
        
        donationItem.innerHTML = `
            <h4>${donation.foodName} (${donation.quantity})</h4>
            <p><strong>Pickup Address:</strong> ${donation.pickupAddress}</p>
            <p><strong>Status:</strong> ${donation.status}</p>
            <p><strong>Date:</strong> ${new Date(donation.date).toLocaleDateString()}</p>
        `;
        
        donationsContainer.appendChild(donationItem);
    });
}


logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear user data
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Redirect to login page
    window.location.href = 'login.html';
});