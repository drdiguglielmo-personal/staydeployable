// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    
    function toggleMenu() {
        const isActive = hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        if (navOverlay) {
            navOverlay.classList.toggle('active');
        }
        document.body.style.overflow = isActive ? 'hidden' : '';
    }

    function closeMenu() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        if (navOverlay) {
            navOverlay.classList.remove('active');
        }
        document.body.style.overflow = '';
    }
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking on a link
        const navLinksArray = navLinks.querySelectorAll('.nav-link');
        navLinksArray.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking on overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', closeMenu);
        }

        // Close menu when clicking outside (for keyboard navigation)
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);
            const isClickOnOverlay = navOverlay && navOverlay.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && !isClickOnOverlay && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }
    
    console.log('Website loaded successfully!');
});
