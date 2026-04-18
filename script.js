// 1. YOUR CONFIGURATION
const DATASHEET_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';
const EMAIL_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby30vjHLoj3iM7AwwNy_BUgYHzCwLvpfae6n3yGs21zp9HlFk1Z0bKBU-r-j6pG6b7Pbg/exec';

const houseData = [
    { neighborhood: 'Bole Atlas', time: 'Fridays, 6:30 PM' },
    { neighborhood: 'Sarbet', time: 'Tuesdays, 7:00 PM' },
    { neighborhood: 'CMC', time: 'Sundays, 4:00 PM' },
    { neighborhood: 'Kazanchis', time: 'Wednesdays, 6:30 PM' },
    { neighborhood: 'Old Airport', time: 'Thursdays, 7:00 PM' }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render House Grid
    const grid = document.getElementById('house-grid');
    if(grid) {
        grid.innerHTML = houseData.map((h, i) => `
            <div class="house-card fade-in-el" style="transition-delay: ${i * 100}ms">
                <h3 class="font-serif text-3xl mb-2 text-[var(--charcoal)]">${h.neighborhood}</h3>
                <p class="text-gray-500 text-sm mb-8 font-light">${h.time}</p>
                <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-[.2em] border-b border-[var(--charcoal)] pb-1">Join Gathering</button>
            </div>
        `).join('');
    }

    // 2. Initialize Icons
    lucide.createIcons();

    // 3. Scroll & Reveal Effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-el').forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if(nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // 4. Mobile Menu Controls
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if(menuBtn) menuBtn.onclick = () => mobileOverlay.classList.add('open');
    if(closeBtn) closeBtn.onclick = () => mobileOverlay.classList.remove('open');

    // 5. FORM SUBMISSIONS
    
    // Join Gathering Form (Sends to Datasheet)
    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) {
        joinForm.onsubmit = async (e) => {
            e.preventDefault();
            handleFormSubmit(joinForm, "Gathering Request", DATASHEET_URL);
        };
    }

    // Reach Out / Contact Form (Sends to Email)
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.onsubmit = async (e) => {
            e.preventDefault();
            handleFormSubmit(contactForm, "General Inquiry", EMAIL_SCRIPT_URL);
        };
    }
});

/**
 * Handles the submission for any form on the site
 */
async function handleFormSubmit(form, typeLabel, targetUrl) {
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    
    // Visual Feedback
    btn.innerText = "SENDING...";
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Add metadata for the script
        data.submissionType = typeLabel;

        // Send to the specified Google Script URL
        await fetch(targetUrl, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(data) 
        });

        // Show Success Modal
        const successModal = document.getElementById('success-modal');
        if(successModal) successModal.classList.add('active');
        
        form.reset();
        
    } catch (err) { 
        console.error("Submission error:", err);
        btn.innerText = "RETRY"; 
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = originalText;
        }, 2000);
    }
}

/**
 * SPA Navigation Logic
 */
function navigateTo(targetId, navElement = null) {
    // Close mobile menu
    const mobileOverlay = document.getElementById('mobile-overlay');
    if(mobileOverlay) mobileOverlay.classList.remove('open');

    // Hide Mobile Sticky CTA if they are on the Join page
    const stickyCta = document.getElementById('mobile-sticky-cta');
    if (stickyCta) {
        stickyCta.style.display = (targetId === 'join') ? 'none' : 'block';
    }

    // Update Desktop Nav Active States
    const navButtons = document.querySelectorAll('.desktop-menu .nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    if (navElement && navElement.classList.contains('nav-btn')) {
        navElement.classList.add('active');
    } else {
        navButtons.forEach(btn => {
            if(btn.innerText.toLowerCase().includes(targetId) || (targetId === 'home' && btn.innerText.includes('Vision'))) {
                btn.classList.add('active');
            }
        });
    }

    // Hide all sections
    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    // Show target section
    const target = document.getElementById(targetId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add('active');
        }, 10);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if(successModal) successModal.classList.remove('active');
    navigateTo('home');
}
