// Authentication management for Back4App
// Initialize Parse SDK
const APP_ID = "SMKd8ENI5PgH7Lm7gHPfImkFk8vYTPsqgspstdep";
const JAVASCRIPT_KEY = "rKGG3TWOFkZwN52rZgksNo2OyBHuPzEKo3lhsIHN";

// Initialize Parse when SDK is loaded
if (typeof Parse !== 'undefined') {
    Parse.initialize(APP_ID, JAVASCRIPT_KEY);
    Parse.serverURL = 'https://parseapi.back4app.com/';
} else {
    // Wait for Parse SDK to load
    window.addEventListener('load', function() {
        if (typeof Parse !== 'undefined') {
            Parse.initialize(APP_ID, JAVASCRIPT_KEY);
            Parse.serverURL = 'https://parseapi.back4app.com/';
        }
    });
}

// Check if user is authenticated
function isAuthenticated() {
    // Check localStorage for authentication status
    const authenticated = localStorage.getItem('authenticated');
    const currentUser = Parse.User.current();
    
    // If we have a current user in Parse session, sync with localStorage
    if (currentUser && authenticated !== 'true') {
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('username', currentUser.getUsername());
    }
    
    // If no current user but localStorage says authenticated, clear it
    if (!currentUser && authenticated === 'true') {
        localStorage.removeItem('authenticated');
        localStorage.removeItem('username');
    }
    
    return currentUser !== null || authenticated === 'true';
}

// Require authentication - redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        // Don't redirect if we're already on the login or register page
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('register.html')) {
            window.location.href = 'login.html';
        }
    }
}

// Logout function
async function logout() {
    try {
        await Parse.User.logOut();
    } catch (error) {
        console.error('Error logging out:', error);
    }
    // Clear localStorage
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    // Redirect to login
    window.location.href = 'login.html';
}

// Get current username
function getCurrentUsername() {
    const currentUser = Parse.User.current();
    if (currentUser) {
        return currentUser.getUsername();
    }
    return localStorage.getItem('username') || 'User';
}

// Initialize authentication check on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    if (typeof Parse !== 'undefined') {
        const currentUser = Parse.User.current();
        if (currentUser) {
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('username', currentUser.getUsername());
        }
    }
    
    // Add logout button to navbar if authenticated
    if (isAuthenticated()) {
        addLogoutButton();
    }
});

// Add logout button to navbar
function addLogoutButton() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks && !document.getElementById('logoutButton')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'logoutButton';
        logoutBtn.className = 'nav-link logout-button';
        logoutBtn.textContent = 'Logout';
        logoutBtn.style.cursor = 'pointer';
        logoutBtn.style.border = 'none';
        logoutBtn.style.background = 'transparent';
        logoutBtn.addEventListener('click', logout);
        navLinks.appendChild(logoutBtn);
    }
}
