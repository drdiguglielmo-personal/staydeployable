// Save scroll position before navigation
function saveScrollPosition() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    sessionStorage.setItem('scrollPosition', scrollPosition);
}

// Restore scroll position on page load - additional restoration after DOM loads
function restoreScrollPosition() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition !== null) {
        // Additional restoration after DOM is ready (inline script in head handles initial restore)
        setTimeout(function() {
            window.scrollTo(0, parseInt(savedPosition));
        }, 0);
    }
}

// Add click listeners to navigation links to save scroll position
document.addEventListener('DOMContentLoaded', function() {
    // Restore scroll position first
    restoreScrollPosition();
    
    // Save scroll position when clicking navigation links
    const navLinks = document.querySelectorAll('.section-nav-link, .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only save if it's not a logout link
            if (!this.id || this.id !== 'logoutLink') {
                saveScrollPosition();
            }
        });
    });
    
    // Also save scroll position on scroll (debounced)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(saveScrollPosition, 150);
    });
});

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

// Custom scrollbar functionality
document.addEventListener('DOMContentLoaded', function() {
    const bottomRight = document.querySelector('.bottom-right');
    const scrollbarThumb = document.getElementById('scrollbarThumb');
    const scrollbarTrack = document.querySelector('.scrollbar-track');
    
    if (bottomRight && scrollbarThumb && scrollbarTrack) {
        let isUpdating = false;
        
        function updateScrollbar() {
            if (isUpdating) return;
            isUpdating = true;
            
            requestAnimationFrame(function() {
                const container = bottomRight;
                const scrollHeight = container.scrollHeight;
                const clientHeight = container.clientHeight;
                const scrollTop = container.scrollTop;
                
                // Get container position to align scrollbar
                const containerRect = container.getBoundingClientRect();
                
                // Track should be the VISIBLE viewport height (standard scrollbar behavior)
                const trackHeight = clientHeight;
                
                // Position scrollbar to align with the container, with a small buffer from the edge
                const customScrollbar = scrollbarTrack.parentElement;
                if (customScrollbar) {
                    // Position it relative to the container's position
                    customScrollbar.style.position = 'fixed';
                    customScrollbar.style.top = containerRect.top + 'px';
                    customScrollbar.style.height = trackHeight + 'px';
                    customScrollbar.style.right = (window.innerWidth - containerRect.right + 2) + 'px'; // 2px buffer from edge
                }
                scrollbarTrack.style.height = trackHeight + 'px';
                
                if (scrollHeight > clientHeight) {
                    // Thumb height should be proportional: visible height / total scrollable height
                    // Example: If 500px visible out of 2000px total, thumb = 25% of track (125px)
                    const thumbHeightRatio = clientHeight / scrollHeight;
                    const thumbHeightPx = Math.max(trackHeight * thumbHeightRatio, 30);
                    scrollbarThumb.style.height = thumbHeightPx + 'px';
                    
                    // Calculate thumb position based on scroll position
                    const maxScroll = scrollHeight - clientHeight;
                    if (maxScroll > 0) {
                        const clampedScrollTop = Math.max(0, Math.min(scrollTop, maxScroll));
                        const scrollRatio = clampedScrollTop / maxScroll;
                        const maxThumbTop = trackHeight - thumbHeightPx;
                        const thumbTop = scrollRatio * maxThumbTop;
                        scrollbarThumb.style.top = thumbTop + 'px';
                    } else {
                        scrollbarThumb.style.top = '0px';
                    }
                    
                    scrollbarThumb.style.display = 'block';
                    scrollbarThumb.style.visibility = 'visible';
                } else {
                    // No overflow - thumb fills entire track
                    scrollbarThumb.style.height = trackHeight + 'px';
                    scrollbarThumb.style.top = '0px';
                    scrollbarThumb.style.display = 'block';
                    scrollbarThumb.style.visibility = 'visible';
                }
                
                isUpdating = false;
            });
        }
        
        // Update scrollbar on scroll (this is critical - updates thumb when user scrolls)
        bottomRight.addEventListener('scroll', function() {
            updateScrollbar();
        }, { passive: true });
        
        // Update scrollbar on resize and scroll (to keep it aligned)
        window.addEventListener('resize', function() {
            updateScrollbar();
        });
        
        window.addEventListener('scroll', function() {
            updateScrollbar();
        }, { passive: true });
        
        // Use MutationObserver to detect content changes
        const observer = new MutationObserver(function() {
            updateScrollbar();
        });
        observer.observe(bottomRight, { childList: true, subtree: true, attributes: true });
        
        // Initial update with multiple attempts to ensure it works
        setTimeout(updateScrollbar, 100);
        setTimeout(updateScrollbar, 300);
        updateScrollbar();
        
        // Make scrollbar draggable
        let isDragging = false;
        let startY = 0;
        let startScrollTop = 0;
        let startThumbTop = 0;
        
        scrollbarThumb.addEventListener('mousedown', function(e) {
            isDragging = true;
            startY = e.clientY;
            startScrollTop = bottomRight.scrollTop;
            startThumbTop = parseFloat(scrollbarThumb.style.top) || 0;
            e.preventDefault();
            e.stopPropagation();
            scrollbarThumb.style.transition = 'background 0.2s';
        });
        
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const trackHeight = scrollbarTrack.clientHeight;
            const thumbHeight = parseFloat(scrollbarThumb.style.height) || 30;
            const maxThumbTop = trackHeight - thumbHeight;
            
            const deltaY = e.clientY - startY;
            let newThumbTop = startThumbTop + deltaY;
            
            // Constrain thumb to track bounds
            newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
            
            // Update thumb position immediately
            scrollbarThumb.style.top = newThumbTop + 'px';
            
            // Update scroll position based on thumb position
            const scrollRatio = maxThumbTop > 0 ? newThumbTop / maxThumbTop : 0;
            const maxScroll = bottomRight.scrollHeight - bottomRight.clientHeight;
            const newScrollTop = scrollRatio * maxScroll;
            
            // Update scroll position
            bottomRight.scrollTop = newScrollTop;
            
            e.preventDefault();
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                scrollbarThumb.style.transition = 'background 0.2s, top 0s linear';
            }
        });
        
        // Allow clicking on track to scroll
        scrollbarTrack.addEventListener('click', function(e) {
            if (e.target === scrollbarTrack) {
                const trackRect = scrollbarTrack.getBoundingClientRect();
                const clickY = e.clientY - trackRect.top;
                const clickRatio = clickY / trackRect.height;
                const maxScroll = bottomRight.scrollHeight - bottomRight.clientHeight;
                bottomRight.scrollTop = clickRatio * maxScroll;
            }
        });
    }
});
