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
                <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-[.2em] border-b border-[var(--charcoal)] pb-1 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors">Request Invitation</button>
            </div>
        `).join('');
    }

    if (window.lucide) window.lucide.createIcons();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-el').forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if(nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    // Form Handling
    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) {
        joinForm.onsubmit = (e) => {
            e.preventDefault();
            handleFormSubmit(joinForm, "Join", DATASHEET_URL);
        };
    }

    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            handleFormSubmit(contactForm, "Contact", EMAIL_SCRIPT_URL);
        };
    }
});

async function handleFormSubmit(form, type, url) {
    const btn = form.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = "SENDING...";
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        await fetch(url, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });

        // Update Modal Message based on form type
        const modalTitle = document.querySelector('#success-modal h3');
        const modalDesc = document.querySelector('#success-modal p');

        if(type === "Contact") {
            modalTitle.innerText = "Message Sent";
            modalDesc.innerText = "Thanks for reaching out! We’ll be in touch soon. Keep an eye on your inbox for an email from us.";
        } else {
            modalTitle.innerText = "Welcome Home";
            modalDesc.innerText = "Your seat at the table is reserved. A house church leader will reach out to you shortly with the exact location and details.";
        }

        document.getElementById('success-modal').classList.add('active');
        form.reset();
    } catch (err) {
        console.error(err);
        btn.innerText = "TRY AGAIN";
    } finally {
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

function navigateTo(targetId, navElement = null) {
    const stickyCta = document.getElementById('mobile-sticky-cta');
    if (stickyCta) stickyCta.style.display = (targetId === 'join') ? 'none' : 'block';

    const navButtons = document.querySelectorAll('.desktop-menu .nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    if (navElement) navElement.classList.add('active');

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
    document.getElementById('success-modal').classList.remove('active');
}
