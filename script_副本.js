// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Form submission handler
const appointmentForm = document.getElementById('appointmentForm');

appointmentForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Simulate form submission
    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<span>Submitting...</span>';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Show success message
        alert(`Thank you for your appointment request, ${data.name}!\n\nWe have received your inquiry and our staff will contact you within 24 hours to confirm your appointment details.\n\nService: ${getServiceName(data.service)}\nPhone: ${data.phone}`);

        // Reset form
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

function getServiceName(value) {
    const services = {
        'infertility': 'Male Infertility Treatment',
        'dysfunction': 'Sexual Dysfunction Therapy',
        'prostate': 'Prostate Disease Management',
        'hormone': 'Hormone Optimization',
        'surgery': 'Genital Reconstructive Surgery',
        'checkup': 'Men\'s Health Screening',
        'other': 'Other Inquiry',
        '': 'Not selected'
    };
    return services[value] || value;
}

// Animate stats on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const finalValue = stat.textContent;
                animateValue(stat, finalValue);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

function animateValue(element, finalValue) {
    // Extract number and suffix
    const numMatch = finalValue.match(/[\d,]+/);
    const suffix = finalValue.replace(/[\d,]+/, '');

    if (!numMatch) return;

    const finalNumber = parseInt(numMatch[0].replace(/,/g, ''));
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentNumber = Math.floor(easeOutQuart * finalNumber);

        element.textContent = currentNumber.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = finalValue;
        }
    }

    requestAnimationFrame(update);
}

// Reveal animations on scroll
const revealElements = document.querySelectorAll('.about-card, .service-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// Pause marquee on hover
const marquees = document.querySelectorAll('.marquee-track');

marquees.forEach(marquee => {
    const cards = marquee.querySelectorAll('.testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            marquee.style.animationPlayState = 'paused';
        });
        card.addEventListener('mouseleave', () => {
            marquee.style.animationPlayState = 'running';
        });
    });
});

// Mobile menu toggle (simplified)
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    // Simple alert for mobile - in production, you'd implement a slide-out menu
    alert('Mobile menu demo\n\nIn production, this would expand the mobile navigation menu.');
});

// Input focus effects
const inputs = document.querySelectorAll('input, textarea, select');

inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', function() {
        this.parentElement.classList.remove('focused');
    });
});

// Add focused style
const style = document.createElement('style');
style.textContent = `
    .form-group.focused label {
        color: var(--primary);
    }
`;
document.head.appendChild(style);

console.log('🩺 Dr. Sarah Johnson Website Loaded Successfully');
console.log('📋 Features:');
console.log('   ✓ Smooth scroll navigation');
console.log('   ✓ Animated statistics on scroll');
console.log('   ✓ Scroll-triggered content reveal');
console.log('   ✓ Infinite scrolling patient testimonials');
console.log('   ✓ Responsive design for all devices');
console.log('   ✓ Form submission handling');
console.log('   ✓ Male avatars in testimonials');
