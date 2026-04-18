// 1. CONFIGURATION - Dual URLs
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
                <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-[.2em] border-b border-[var(--charcoal)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors">Request Invitation</button>
            </div>
        `).join('');
    }

    // 2. Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 3. Scroll Animation Logic
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-el').forEach(el => observer.observe(el));

    // 4. Form Submissions
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            handleFormSubmit(contactForm, "General Inquiry", EMAIL_SCRIPT_URL);
        };
    }

    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) {
        joinForm.onsubmit = (e) => {
            e.preventDefault();
            handleFormSubmit(joinForm, "Join Gathering", DATASHEET_URL);
        };
    }
});

async function handleFormSubmit(form, typeLabel, targetUrl) {
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    
    // Get modal elements for dynamic text
    const modalTitle = document.querySelector('#success-modal h3');
    const modalText = document.querySelector('#success-modal p');
    
    btn.innerText = "SENDING...";
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.submissionType = typeLabel;

        // Submission via POST
        await fetch(targetUrl, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(data) 
        });

        // Set text based on which form was used
        if (typeLabel === "General Inquiry") {
            modalTitle.innerText = "Message Sent";
            modalText.innerText = "Thank you for your inquiry. We will contact you soon—please make sure to check your email.";
        } else {
            modalTitle.innerText = "Welcome Home";
            modalText.innerText = "Your seat at the table is reserved. A house church leader will reach out to you shortly with the exact location and details.";
        }

        const modal = document.getElementById('success-modal');
        if(modal) modal.classList.add('active');
        form.reset();
        
    } catch (err) { 
        console.error("Error:", err);
        btn.innerText = "RETRY"; 
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = originalText;
        }, 2000);
    }
}

function navigateTo(targetId, navElement = null) {
    // 1. Close mobile menu if open
    const mobileOverlay = document.getElementById('mobile-overlay');
    if(mobileOverlay) mobileOverlay.classList.remove('open');

    // 2. Hide Mobile Sticky CTA on the 'join' section
    const stickyCta = document.getElementById('mobile-sticky-cta');
    if (stickyCta) {
        stickyCta.style.display = (targetId === 'join') ? 'none' : 'block';
    }

    // 3. Nav Active State
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

    // 4. Section Switching
    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    const target = document.getElementById(targetId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => { target.classList.add('active'); }, 10);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if(modal) modal.classList.remove('active');
}
