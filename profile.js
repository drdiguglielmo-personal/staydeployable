// Profile management functions

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('profileErrorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    } else {
        alert(message);
    }
}

// Load and display user profile
async function loadProfile() {
    // Wait for Parse to be initialized
    if (typeof Parse === 'undefined') {
        setTimeout(loadProfile, 100);
        return;
    }

    const currentUser = Parse.User.current();
    if (!currentUser) {
        console.log('No current user found');
        window.location.href = 'login.html';
        return;
    }

    // Try to fetch fresh user data if user has an ID
    try {
        // Only fetch if user has an ID
        if (currentUser.id) {
            await currentUser.fetch();
        }
        
        // Display user information
        const firstName = currentUser.get('firstName');
        const lastName = currentUser.get('lastName');
        const username = currentUser.getUsername();
        const mos = currentUser.get('mos');
        const whySignup = currentUser.get('whySignup');
        
        console.log('User data:', { firstName, lastName, username, mos, whySignup });
        
        // Update the DOM elements
        const firstNameEl = document.getElementById('viewFirstName');
        const lastNameEl = document.getElementById('viewLastName');
        const usernameEl = document.getElementById('viewUsername');
        const mosEl = document.getElementById('viewMOS');
        const whySignupEl = document.getElementById('viewWhySignup');
        
        if (firstNameEl) firstNameEl.textContent = firstName || 'Not set';
        if (lastNameEl) lastNameEl.textContent = lastName || 'Not set';
        if (usernameEl) usernameEl.textContent = username || 'Not set';
        if (mosEl) mosEl.textContent = mos || 'Not set';
        if (whySignupEl) whySignupEl.textContent = whySignup || 'Not set';
    } catch (error) {
        console.error('Error loading profile:', error);
        // Try to display what we have even if fetch failed
        const currentUser = Parse.User.current();
        if (currentUser) {
            document.getElementById('viewFirstName').textContent = currentUser.get('firstName') || 'Not set';
            document.getElementById('viewLastName').textContent = currentUser.get('lastName') || 'Not set';
            document.getElementById('viewUsername').textContent = currentUser.getUsername() || 'Not set';
            document.getElementById('viewMOS').textContent = currentUser.get('mos') || 'Not set';
            document.getElementById('viewWhySignup').textContent = currentUser.get('whySignup') || 'Not set';
        } else {
            showError('Failed to load profile information: ' + error.message);
        }
    }
}

// Switch to edit mode
function switchToEditMode() {
    const currentUser = Parse.User.current();
    if (!currentUser) return;

    // Populate edit form with current values
    document.getElementById('editFirstName').value = currentUser.get('firstName') || '';
    document.getElementById('editLastName').value = currentUser.get('lastName') || '';
    document.getElementById('editMOS').value = currentUser.get('mos') || '';
    document.getElementById('editWhySignup').value = currentUser.get('whySignup') || '';

    // Show edit form, hide view
    document.getElementById('profileView').style.display = 'none';
    document.getElementById('profileEdit').style.display = 'block';
}

// Switch back to view mode
function switchToViewMode() {
    document.getElementById('profileView').style.display = 'block';
    document.getElementById('profileEdit').style.display = 'none';
    document.getElementById('profileErrorMessage').style.display = 'none';
}

// Save profile changes
async function saveProfile() {
    const currentUser = Parse.User.current();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const firstName = document.getElementById('editFirstName').value;
    const lastName = document.getElementById('editLastName').value;
    const mos = document.getElementById('editMOS').value;
    const whySignup = document.getElementById('editWhySignup').value;
    const errorMessage = document.getElementById('profileErrorMessage');

    try {
        // Update user fields
        currentUser.set('firstName', firstName);
        currentUser.set('lastName', lastName);
        currentUser.set('mos', mos);
        currentUser.set('whySignup', whySignup);

        await currentUser.save();
        
        // Reload profile and switch to view mode
        await loadProfile();
        switchToViewMode();
    } catch (error) {
        console.error('Error saving profile:', error);
        errorMessage.textContent = error.message || 'Failed to save profile. Please try again.';
        errorMessage.style.display = 'block';
    }
}

// Delete account
async function deleteAccount() {
    const currentUser = Parse.User.current();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Confirm deletion
    const confirmMessage = 'Are you sure you want to delete your account? This action cannot be undone.';
    if (!confirm(confirmMessage)) {
        return;
    }

    // Double confirmation
    const doubleConfirm = 'This will permanently delete your account. Type "DELETE" to confirm:';
    const userInput = prompt(doubleConfirm);
    if (userInput !== 'DELETE') {
        return;
    }

    try {
        await currentUser.destroy();
        // Logout and redirect
        await logout();
        alert('Your account has been deleted.');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
    }
}

// Initialize profile page event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Edit button
    const editButton = document.getElementById('editButton');
    if (editButton) {
        editButton.addEventListener('click', switchToEditMode);
    }

    // Cancel button
    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.addEventListener('click', switchToViewMode);
    }

    // Save form
    const profileEditForm = document.getElementById('profileEditForm');
    if (profileEditForm) {
        profileEditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProfile();
        });
    }

    // Delete button
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', deleteAccount);
    }
});
