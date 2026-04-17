const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';

const houseData = [
    { neighborhood: 'Bole Atlas', time: 'Fridays, 6:30 PM' },
    { neighborhood: 'Sarbet', time: 'Tuesdays, 7:00 PM' },
    { neighborhood: 'CMC', time: 'Sundays, 4:00 PM' },
    { neighborhood: 'Kazanchis', time: 'Wednesdays, 6:30 PM' },
    { neighborhood: 'Old Airport', time: 'Thursdays, 7:00 PM' }
];

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderHouses();

    window.onscroll = () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    };

    document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-overlay').classList.add('open');
    document.getElementById('close-btn').onclick = () => document.getElementById('mobile-overlay').classList.remove('open');

    const joinForm = document.getElementById('platinumJoinForm');
    if (joinForm) {
        joinForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = joinForm.querySelector('button');
            btn.innerText = "SENDING...";
            try {
                const data = Object.fromEntries(new FormData(joinForm).entries());
                await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                document.getElementById('success-modal').classList.add('active');
                joinForm.reset();
            } catch (err) {
                btn.innerText = "RETRY";
            } finally {
                btn.innerText = "Submit Entry";
            }
        };
    }
});

function renderHouses() {
    const grid = document.getElementById('house-grid');
    if (grid) {
        grid.innerHTML = houseData.map(h => `
            <div class="house-card p-10 border border-black/5 bg-white/50">
                <h3 class="font-serif text-3xl mb-2">${h.neighborhood}</h3>
                <p class="text-gray-500 text-sm mb-8 font-light">${h.time}</p>
                <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-[.2em] border-b border-black pb-1">Join The Family</button>
            </div>
        `).join('');
    }
}

function navigateTo(targetId, navElement = null) {
    document.getElementById('mobile-overlay').classList.remove('open');
    
    // Hide/Show Mobile CTA
    const stickyCta = document.getElementById('mobile-sticky-cta');
    if (stickyCta) stickyCta.style.display = (targetId === 'join') ? 'none' : 'block';

    // Desktop Nav Active State
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase().includes(targetId.replace('home', 'vision')) || 
            (targetId === 'join' && btn.innerText.includes('Family'))) {
            btn.classList.add('active');
        }
    });

    // SPA Switch
    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    const target = document.getElementById(targetId);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
}
