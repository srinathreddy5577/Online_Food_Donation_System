// DOM Elements
const receiverNameSpan = document.getElementById('receiver-name');
const foodsContainer = document.getElementById('foods-container');
const searchInput = document.getElementById('search-food');
const logoutLink = document.getElementById('logout-link');

// Check if user is logged in and is a receiver
function checkLoggedInReceiver() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Redirect to login if not logged in
        window.location.href = 'login.html';
        return;
    }
    
    if (currentUser.userType !== 'receiver') {
        // Redirect to appropriate dashboard
        window.location.href = currentUser.userType === 'donor' ? 
                              'donor-dashboard.html' : 'login.html';
        return;
    }
    
    // Display receiver name
    receiverNameSpan.textContent = `Welcome, ${currentUser.fullName}`;
    
    // Load available foods
    loadAvailableFoods();
}

// Run on page load
checkLoggedInReceiver();

// Load available foods
function loadAvailableFoods() {
    // Get all donations
    const allDonations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Filter available donations
    const availableFoods = allDonations.filter(donation => 
        donation.status === 'available'
    );
    
    // Display available foods
    displayFoods(availableFoods);
}

// Display foods in the list
function displayFoods(foods) {
    // Clear the container
    foodsContainer.innerHTML = '';
    
    if (foods.length === 0) {
        foodsContainer.innerHTML = '<p>No food items available at the moment.</p>';
        return;
    }
    
    // Sort by date (newest first)
    foods.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create food items
    foods.forEach(food => {
        const foodItem = document.createElement('div');
        foodItem.classList.add('food-item');
        
        foodItem.innerHTML = `
            <h4>${food.foodName} (${food.quantity})</h4>
            <p><strong>Donor:</strong> ${food.donor.name}</p>
            <p><strong>Pickup Address:</strong> ${food.pickupAddress}</p>
            <p><strong>Contact:</strong> ${food.donor.phone}</p>
            <button class="btn request-btn" data-id="${food.id}">Request This</button>
        `;
        
        foodsContainer.appendChild(foodItem);
    });
    
    // Add event listeners to request buttons
    document.querySelectorAll('.request-btn').forEach(button => {
        button.addEventListener('click', handleFoodRequest);
    });
}

// Handle food request
function handleFoodRequest(e) {
    const foodId = parseInt(e.target.getAttribute('data-id'));
    
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Get all donations
    const allDonations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Find the requested food
    const foodIndex = allDonations.findIndex(food => food.id === foodId);
    
    if (foodIndex !== -1) {
        // Update status
        allDonations[foodIndex].status = 'requested';
        allDonations[foodIndex].requestedBy = {
            id: currentUser.email,
            name: currentUser.fullName,
            phone: currentUser.phone
        };
        
        // Save back to localStorage
        localStorage.setItem('donations', JSON.stringify(allDonations));
        
        // Reload available foods
        loadAvailableFoods();
        
        // Show success message
        alert('Food requested successfully! Please contact the donor for pickup arrangements.');
    }
}

// Search functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Get all donations
    const allDonations = JSON.parse(localStorage.getItem('donations')) || [];
    
    // Filter available and matching donations
    const filteredFoods = allDonations.filter(donation => 
        donation.status === 'available' && 
        (donation.foodName.toLowerCase().includes(searchTerm) || 
         donation.donor.name.toLowerCase().includes(searchTerm))
    );
    
    // Display filtered foods
    displayFoods(filteredFoods);
});

// Logout functionality
logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Clear user data
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    
    // Redirect to login page
    window.location.href = 'login.html';
});