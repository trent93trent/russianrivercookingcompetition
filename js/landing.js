document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced CTA button interaction
    const ctaButton = document.querySelector('.hero-cta .cta-button');
    if (ctaButton) {
        // Add pulse animation after page load
        setTimeout(() => {
            ctaButton.classList.add('pulse-attention');
            
            // Remove the pulse class after animation completes
            setTimeout(() => {
                ctaButton.classList.remove('pulse-attention');
            }, 1500);
        }, 2000);
    }

    // Enhanced parallax effect for hero section
    const heroImage = document.querySelector('.hero-image');
    const heroContent = document.querySelector('.hero-content');
    
    if (heroImage && heroContent) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const opacity = Math.max(0.3, 1 - scrollPosition / 700);
            
            // Parallax effect for hero image
            heroImage.style.transform = `translateY(${scrollPosition * 0.2}px)`;
            
            // Fade effect for hero content
            heroContent.style.opacity = opacity;
            heroContent.style.transform = `translateY(${scrollPosition * 0.1}px)`;
        });
    }

    // Add animation to elements when they come into view with enhanced timing
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.about-card, .timeline-item, .chef-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.1;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };

    // Add subtle movement to section backgrounds on mouse move
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        aboutSection.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
            const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
            
            aboutSection.style.backgroundPosition = `${moveX}px ${moveY}px`;
        });
    }

    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('resize', animateOnScroll);
    animateOnScroll(); // Run once on page load

    // Animation for elements coming into view
    const animatedElements = document.querySelectorAll('.about-card, .timeline-item, .chef-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Hero Image Carousel
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let slideInterval;
    
    // Function to change slide
    function changeSlide(index) {
        // Remove active class from all slides and indicators
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        currentSlide = index;
        carouselSlides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    // Auto-advance slides
    function startSlideShow() {
        slideInterval = setInterval(() => {
            let nextSlide = (currentSlide + 1) % carouselSlides.length;
            changeSlide(nextSlide);
        }, 5000); // Change slide every 5 seconds
    }
    
    // Add click event to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(slideInterval); // Reset interval when manually changing
            changeSlide(index);
            startSlideShow(); // Restart auto-advance
        });
    });
    
    // Start the slideshow
    startSlideShow();
}); 