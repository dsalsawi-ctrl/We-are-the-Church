const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';

const houseData = [
    { neighborhood: 'Bole Atlas', time: 'Fridays, 6:30 PM' },
    { neighborhood: 'Sarbet', time: 'Tuesdays, 7:00 PM' },
    { neighborhood: 'CMC', time: 'Sundays, 4:00 PM' },
    { neighborhood: 'Kazanchis', time: 'Wednesdays, 6:30 PM' },
    { neighborhood: 'Old Airport', time: 'Thursdays, 7:00 PM' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Render House Grid
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

    // Scroll Effects
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-el').forEach(el => observer.observe(el));

    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    });

    // UI Controls
    document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-overlay').classList.add('open');
    document.getElementById('close-btn').onclick = () => document.getElementById('mobile-overlay').classList.remove('open');

    // Form Logic
    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) {
        joinForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = joinForm.querySelector('.form-submit-btn');
            const originalText = btn.innerText;
            btn.innerText = "AUTHENTICATING...";
            btn.disabled = true;
            try {
                const data = Object.fromEntries(new FormData(joinForm).entries());
                await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                document.getElementById('success-modal').classList.add('active');
                joinForm.reset();
            } catch (err) { 
                btn.innerText = "RETRY"; 
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    if(btn.innerText === "AUTHENTICATING...") btn.innerText = originalText;
                }, 2000);
            }
        };
    }
});

function navigateTo(targetId, navElement = null) {
    // 1. Close mobile menu
    document.getElementById('mobile-overlay').classList.remove('open');

    // 2. Hide Mobile Sticky CTA if they are on the Join page (to avoid double buttons)
    const stickyCta = document.getElementById('mobile-sticky-cta');
    if (stickyCta) {
        stickyCta.style.display = (targetId === 'join') ? 'none' : 'block';
    }

    // 3. Update Desktop Nav Active States
    if (navElement && navElement.classList.contains('nav-btn')) {
        document.querySelectorAll('.desktop-menu .nav-btn').forEach(btn => btn.classList.remove('active'));
        navElement.classList.add('active');
    } else {
        document.querySelectorAll('.desktop-menu .nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if(btn.innerText.toLowerCase().includes(targetId) || (targetId === 'home' && btn.innerText.includes('Vision'))) {
                btn.classList.add('active');
            }
        });
    }

    // 4. Hard-hide all sections
    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; 
    });

    // 5. Show target section instantly
    const target = document.getElementById(targetId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => {
            target.classList.add('active');
        }, 10);
    }

    // 6. Force scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    navigateTo('home');
}
