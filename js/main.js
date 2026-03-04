// ===== PERFORMANCE OPTIMIZED MAIN.JS =====

// Debounce function for scroll events
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== GLOBAL ERROR HANDLER =====
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error caught:', msg, 'at', lineNo);
    return true;
};

// ===== ENHANCED WHATSAPP FUNCTION =====
function openWhatsApp(text) {
    const msg = encodeURIComponent(text);
    const phone = '919395319499';
    
    try {
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    } catch (e) {
        window.location.href = `https://wa.me/${phone}?text=${msg}`;
    }
    return false;
}

// ===== POPUP FUNCTIONS =====
function showPopup() {
    const popup = document.getElementById('callbackPopup');
    if (popup) popup.style.display = 'flex';
}

function hidePopup() {
    const popup = document.getElementById('callbackPopup');
    if (popup) popup.style.display = 'none';
}

function whatsappCallback() {
    const name = document.getElementById('cbName')?.value || 'Guest';
    const phone = document.getElementById('cbPhone')?.value || 'not provided';
    const msg = encodeURIComponent(`Hi, I need a callback. Name: ${name}, Phone: ${phone}`);
    openWhatsApp(msg);
    hidePopup();
}

// Close popup when clicking outside - optimized
window.onclick = function(e) {
    const popup = document.getElementById('callbackPopup');
    if(e.target === popup) hidePopup();
}

// Auto popup after 15 seconds - use requestIdleCallback for better performance
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        setTimeout(showPopup, 15000);
    }, { timeout: 2000 });
} else {
    setTimeout(showPopup, 15000);
}

// ===== OPTIMIZED IMAGE ERROR HANDLING =====
const imageFallbacks = {
    customer: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 48 48\'%3E%3Ccircle cx=\'24\' cy=\'24\' r=\'24\' fill=\'%23ff6600\'/%3E%3Ctext x=\'16\' y=\'32\' fill=\'white\' font-size=\'20\'%3E👤%3C/text%3E%3C/svg%3E',
    destination: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'200\' viewBox=\'0 0 300 200\'%3E%3Crect width=\'300\' height=\'200\' fill=\'%230a2540\'/%3E%3Ctext x=\'50\' y=\'110\' fill=\'%23ff6600\' font-size=\'24\'%3EDestination Image%3C/text%3E%3C/svg%3E'
};

function handleImageError(img) {
    if (img.classList.contains('customer-photo')) {
        img.src = imageFallbacks.customer;
    } else if (img.classList.contains('card-img') || img.classList.contains('romance-img')) {
        img.src = imageFallbacks.destination;
    }
    img.classList.add('error-fallback');
}

// Use event delegation for better performance
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        handleImageError(e.target);
    }
}, true);

// ===== OPTIMIZED SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('.feature-item, .testimonial-card');
    
    // If IntersectionObserver is not supported, show all elements
    if (!window.IntersectionObserver) {
        elements.forEach(el => el.classList.add('fade-in-visible'));
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Use requestAnimationFrame to batch DOM reads
    requestAnimationFrame(() => {
        elements.forEach(el => observer.observe(el));
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
} else {
    initScrollAnimations();
}

// ===== OPTIMIZED CONTACT FORM =====
function sendContactMessage() {
    const name = document.getElementById('contactName')?.value || 'Guest';
    const email = document.getElementById('contactEmail')?.value || 'not provided';
    const phone = document.getElementById('contactPhone')?.value || 'not provided';
    const interest = document.getElementById('contactInterest')?.value || 'General';
    const message = document.getElementById('contactMessage')?.value || 'No message';
    
    const msg = encodeURIComponent(`Hi, I'm interested in travel.\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterest: ${interest}\nMessage: ${message}`);
    openWhatsApp(msg);
}

// ===== ACTIVE NAVIGATION LINK =====
function setActiveNavLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');
    
    requestAnimationFrame(() => {
        links.forEach(link => {
            link.classList.remove('active');
            if (path === '/' && link.getAttribute('href') === '/') {
                link.classList.add('active');
            } else if (path.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/') {
                link.classList.add('active');
            }
        });
    });
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActiveNavLink);
} else {
    setActiveNavLink();
}

// ===== OPTIMIZED SCROLL HANDLER (remove if not needed) =====
// Only add if you need custom scroll behavior
const optimizedScrollHandler = throttle(() => {
    // Add any scroll-dependent logic here
    // This runs at most every 100ms
}, 100);

// window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

// Make functions globally available
window.openWhatsApp = openWhatsApp;
window.showPopup = showPopup;
window.hidePopup = hidePopup;
window.whatsappCallback = whatsappCallback;
window.sendContactMessage = sendContactMessage;
