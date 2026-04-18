const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';

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

    // 2. Initialize Lucide Icons
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

    // 5. FORM SUBMISSIONS SETUP
    
    // Form A: Join Gathering (Request Invitation)
    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) {
        joinForm.onsubmit = async (e) => {
            e.preventDefault();
            handleFormSubmit(joinForm, "Gathering Request");
        };
    }

    // Form B: Reach Out (Contact Form)
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.onsubmit = async (e) => {
            e.preventDefault();
            handleFormSubmit(contactForm, "General Inquiry");
        };
    }
});

/**
 * Centralized logic to handle all form submissions
 */
async function handleFormSubmit(form, typeLabel) {
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    
    // Visual Feedback
    btn.innerText = "SENDING...";
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Include which form this came from for your email subject line
        data.submissionType = typeLabel;

        // Post to Google Apps Script
        await fetch(GOOGLE_SCRIPT_URL, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(data) 
        });

        // Trigger the Success UI
        const successModal = document.getElementById('success-modal');
        if(successModal) successModal.classList.add('active');
        
        form.reset();
        
    } catch (err) { 
        console.error("Submission error:", err);
        btn.innerText = "RETRY"; 
    } finally {
        // Reset button state after a small delay
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = originalText;
        }, 2000);
    }
}

/**
 * Single Page Application Navigation
 */
function navigateTo(targetId, navElement = null) {
    // 1. Close mobile menu
    const mobileOverlay = document.getElementById('mobile-overlay');
    if(mobileOverlay) mobileOverlay.classList.remove('open');

    // 2. Hide Mobile Sticky CTA on the 'join' page
    const stickyCta = document.getElementById('mobile-sticky-cta');
    if (stickyCta) {
        stickyCta.style.display = (targetId === 'join') ? 'none' : 'block';
    }

    // 3. Update Desktop Navigation Active States
    const navButtons = document.querySelectorAll('.desktop-menu .nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    if (navElement && navElement.classList.contains('nav-btn')) {
        navElement.classList.add('active');
    } else {
        // Find button by text if triggered via inline onclick
        navButtons.forEach(btn => {
            if(btn.innerText.toLowerCase().includes(targetId) || (targetId === 'home' && btn.innerText.includes('Vision'))) {
                btn.classList.add('active');
            }
        });
    }

    // 4. Switch visible sections
    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    const target = document.getElementById(targetId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => { target.classList.add('active'); }, 10);
    }

    // 5. Scroll to top instantly
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if(successModal) successModal.classList.remove('active');
    navigateTo('home');
}
