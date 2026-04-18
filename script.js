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
    // Reveal body after load
    document.body.classList.remove('loading');

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

    lucide.createIcons();

    // Scroll Observer for high-end reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in-el, .hero-content').forEach(el => observer.observe(el));

    // Navbar & Parallax Hero Logic
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        const scroll = window.scrollY;
        
        if(nav) nav.classList.toggle('scrolled', scroll > 50);

        // Subtle Parallax for Hero Image
        const heroImg = document.querySelector('.hero-image');
        if(heroImg && scroll < 800) {
            heroImg.style.transform = `scale(1.1) translateY(${scroll * 0.15}px)`;
        }
    });

    // Mobile Menu
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if(menuBtn) menuBtn.onclick = () => mobileOverlay.classList.add('open');
    if(closeBtn) closeBtn.onclick = () => mobileOverlay.classList.remove('open');

    // Forms
    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) joinForm.onsubmit = (e) => { e.preventDefault(); handleFormSubmit(joinForm, "Gathering Request", DATASHEET_URL); };

    const contactForm = document.getElementById('contactForm');
    if(contactForm) contactForm.onsubmit = (e) => { e.preventDefault(); handleFormSubmit(contactForm, "General Inquiry", EMAIL_SCRIPT_URL); };
});

async function handleFormSubmit(form, typeLabel, targetUrl) {
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "SENDING...";
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.submissionType = typeLabel;

        await fetch(targetUrl, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });

        const modal = document.getElementById('success-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');

        if (typeLabel === "General Inquiry") {
            modalTitle.innerText = "Message Sent";
            modalDesc.innerText = "Thanks for reaching out! We’ll be in touch soon.";
        } else {
            modalTitle.innerText = "Welcome Home";
            modalDesc.innerText = "Your seat at the table is reserved. A host will contact you soon.";
        }

        modal.classList.add('active');
        form.reset();
    } catch (err) { 
        btn.innerText = "RETRY"; 
    } finally {
        setTimeout(() => { btn.disabled = false; btn.innerText = originalText; }, 2000);
    }
}

function navigateTo(targetId, navElement = null) {
    const mobileOverlay = document.getElementById('mobile-overlay');
    if(mobileOverlay) mobileOverlay.classList.remove('open');

    const stickyCta = document.getElementById('mobile-sticky-cta');
    if (stickyCta) stickyCta.style.display = (targetId === 'join') ? 'none' : 'block';

    const navButtons = document.querySelectorAll('.desktop-menu .nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    
    if (navElement) {
        navElement.classList.add('active');
    }

    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    const target = document.getElementById(targetId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => { target.classList.add('active'); }, 50);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    navigateTo('home');
}
