// ===== GLOBAL ERROR HANDLER =====
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Error caught:', msg, 'at', lineNo);
    return true;
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled rejection:', event.reason);
    event.preventDefault();
});

// ===== ENHANCED WHATSAPP FUNCTION =====
function openWhatsApp(text) {
    const msg = encodeURIComponent(text);
    const phone = '919395319499'; // Remove + for better compatibility
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    try {
        if (isMobile) {
            window.location.href = `whatsapp://send?phone=${phone}&text=${msg}`;
            setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
            }, 500);
        } else {
            window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${msg}`, '_blank');
        }
    } catch (e) {
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    }
    return false;
}

// ===== POPUP FUNCTIONS =====
function showPopup() {
    document.getElementById('callbackPopup').style.display = 'flex';
}

function hidePopup() {
    document.getElementById('callbackPopup').style.display = 'none';
}

function whatsappCallback() {
    const name = document.getElementById('cbName')?.value || 'Guest';
    const phone = document.getElementById('cbPhone')?.value || 'not provided';
    const msg = encodeURIComponent(`Hi, I need a callback. Name: ${name}, Phone: ${phone}`);
    openWhatsApp(msg);
    hidePopup();
}

// Close popup when clicking outside
window.onclick = function(e) {
    const popup = document.getElementById('callbackPopup');
    if(e.target === popup) hidePopup();
}

// Auto popup after 15 seconds
setTimeout(() => {
    showPopup();
}, 15000);

// ===== IMAGE ERROR HANDLING =====
function handleImageError(img) {
    if (img.classList.contains('customer-photo')) {
        img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 48 48\'%3E%3Ccircle cx=\'24\' cy=\'24\' r=\'24\' fill=\'%23ff6600\'/%3E%3Ctext x=\'16\' y=\'32\' fill=\'white\' font-size=\'20\'%3E👤%3C/text%3E%3C/svg%3E';
    } else if (img.classList.contains('card-img') || img.classList.contains('romance-img') || img.classList.contains('hero-image img')) {
        img.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'200\' viewBox=\'0 0 300 200\'%3E%3Crect width=\'300\' height=\'200\' fill=\'%230a2540\'/%3E%3Ctext x=\'50\' y=\'110\' fill=\'%23ff6600\' font-size=\'24\'%3EDestination Image%3C/text%3E%3C/svg%3E';
    }
    img.classList.add('error-fallback');
}

// Apply image error handling to all images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() { handleImageError(this); });
});

// ===== SCROLL ANIMATION OBSERVER =====
function initScrollAnimations() {
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

    document.querySelectorAll('.feature-item, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', initScrollAnimations);

// ===== CONTACT FORM FUNCTION =====
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
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (path === '/' && link.getAttribute('href') === '/') {
            link.classList.add('active');
        } else if (path.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/') {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', setActiveNavLink);
