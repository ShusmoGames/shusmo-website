// components.js - Universal component loader
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Function to load component with error handling
    async function loadComponent(selector, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = html;
                // Initialize functionality after loading
                initComponentFunctionality();
            }
        } catch (error) {
            console.warn(`Failed to load ${filePath}:`, error);
            // Fallback: create basic element if fetch fails
            const element = document.querySelector(selector);
            if (element) {
                element.innerHTML = '<div style="background: #f8f8f8; padding: 10px; text-align: center; color: #666;">Content loading...</div>';
            }
        }
    }
    
    // Initialize functionality after components are loaded
    function initComponentFunctionality() {
        // Mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
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
        const navLinksElements = document.querySelectorAll('.nav-links a');
        navLinksElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });
        
        // Animation observer
        const elements = document.querySelectorAll('.game-card, .about');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '0px 0px -50px 0px' 
        });
        
        elements.forEach(el => {
            if (el.style) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(el);
            }
        });
    }
    
    // Load components
    if (document.getElementById('header-placeholder')) {
        loadComponent('#header-placeholder', 'components/header.html');
    }
    
    if (document.getElementById('footer-placeholder')) {
        loadComponent('#footer-placeholder', 'components/footer.html');
    }
});