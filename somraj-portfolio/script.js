document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Theme Toggle (Light / Dark Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    // Default theme is dark, so if saved is 'light' or no saved but system is light:
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        document.body.classList.add('light-theme');
    }
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('portfolio-theme', 'light');
        } else {
            localStorage.setItem('portfolio-theme', 'dark');
        }
    });

    /* ==========================================================================
       2. Mobile Navigation Drawer
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
        
        // Simple hamburger transition states
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'translateY(7px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile nav when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                navMenu.classList.remove('open');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    /* ==========================================================================
       3. Testimonials Carousel
       ========================================================================== */
    const track = document.getElementById('carousel-track');
    const slides = Array.from(track.children);
    const dotsContainer = document.getElementById('carousel-dots-container');
    
    let currentIndex = 0;
    let autoSlideInterval;
    
    // Create dots based on slide count
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Go to testimonial slide ${index + 1}`);
        if (index === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
        
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoSlide();
        });
    });
    
    const dots = Array.from(dotsContainer.children);
    
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        
        // Update active dot
        dots.forEach(d => d.classList.remove('active'));
        dots[currentIndex].classList.add('active');
    }
    
    function nextSlide() {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) {
            nextIndex = 0;
        }
        goToSlide(nextIndex);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
    
    // Pause auto slide on hover
    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
    
    startAutoSlide();

    /* ==========================================================================
       4. Scroll Animation & Radial Progress Meters
       ========================================================================== */
    const reveals = document.querySelectorAll('.reveal');
    const radialProgresses = document.querySelectorAll('.radial-progress');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a timeline item with a radial progress indicator, trigger its animation
                const radial = entry.target.querySelector('.radial-progress');
                if (radial && !radial.classList.contains('animated')) {
                    animateRadial(radial);
                }
                
                // Unobserve once animated
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(element => {
        revealObserver.observe(element);
    });
    
    function animateRadial(radial) {
        radial.classList.add('animated');
        const percentage = parseInt(radial.getAttribute('data-percentage'), 10);
        const circle = radial.querySelector('.val-circle');
        const valText = radial.querySelector('.radial-val');
        
        // Stroke dash offset calculation (circumference is 125.6px)
        const circumference = 125.6;
        const offset = circumference - (percentage / 100) * circumference;
        
        // Animate stroke dash
        circle.style.strokeDashoffset = offset;
        
        // Animate text counter
        let count = 0;
        const duration = 1200; // ms
        const stepTime = Math.abs(Math.floor(duration / percentage));
        
        const timer = setInterval(() => {
            count++;
            valText.textContent = `${count}%`;
            if (count >= percentage) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    /* ==========================================================================
       5. Subscribe Form Submission (Simulated)
       ========================================================================== */
    const subscribeForm = document.getElementById('subscribe-form');
    const toast = document.getElementById('toast');
    
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('subscribe-email');
        const emailValue = emailInput.value.trim();
        
        if (emailValue) {
            // Show toast notification
            toast.classList.add('show');
            
            // Clear input
            emailInput.value = '';
            
            // Dismiss toast after 4 seconds
            setTimeout(() => {
                toast.classList.remove('show');
            }, 4000);
        }
    });
});
