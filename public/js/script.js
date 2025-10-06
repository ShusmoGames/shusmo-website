// script.js

// DOMContentLoaded ensures the DOM is fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Toggle aria-expanded for accessibility
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }
    
    // Set active link based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinksElements = document.querySelectorAll('.nav-links a');
    
    navLinksElements.forEach(link => {
        // Remove active class from all links
        link.classList.remove('active');
        
        // Add active class to the link that matches current page
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Animation on scroll
    const gameCards = document.querySelectorAll('.game-card');
    const aboutCards = document.querySelectorAll('.about');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    [...gameCards, ...aboutCards].forEach(card => {
        if (card.style) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        }
    });
    
    // Ensure mobile compatibility - prevent overscroll
    document.addEventListener('touchmove', function (e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function () {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    });
});