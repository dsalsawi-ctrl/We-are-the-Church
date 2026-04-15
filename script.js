const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';

const houseData = [
    { neighborhood: 'Bole Atlas', time: 'Fridays, 6:30 PM' },
    { neighborhood: 'Sarbet', time: 'Tuesdays, 7:00 PM' },
    { neighborhood: 'CMC', time: 'Sundays, 4:00 PM' },
    { neighborhood: 'Kazanchis', time: 'Wednesdays, 6:30 PM' },
    { neighborhood: 'Old Airport', time: 'Thursdays, 7:00 PM' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Populate House Churches
    const grid = document.getElementById('house-grid');
    if(grid) {
        grid.innerHTML = houseData.map(h => `
            <div class="house-card">
                <h3 class="font-serif text-2xl mb-2">${h.neighborhood}</h3>
                <p class="text-gray-400 text-sm mb-6">${h.time}</p>
                <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Request Visit</button>
            </div>
        `).join('');
    }

    // Scroll Effect
    window.onscroll = () => document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);

    // Mobile Menu
    document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-overlay').classList.add('open');
    document.getElementById('close-btn').onclick = () => document.getElementById('mobile-overlay').classList.remove('open');

    // Form logic
    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) {
        joinForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = joinForm.querySelector('button');
            btn.innerText = "SENDING...";
            try {
                const data = Object.fromEntries(new FormData(joinForm).entries());
                await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                document.getElementById('success-modal').classList.add('active');
                joinForm.reset();
            } catch (err) { btn.innerText = "RETRY"; }
        };
    }
});

function navigateTo(targetId, navElement = null) {
    document.getElementById('mobile-overlay').classList.remove('open');
    document.querySelectorAll('.spa-section').forEach(s => s.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (navElement) navElement.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    navigateTo('home');
}
