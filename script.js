const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';
const houseData = [
    { neighborhood: 'Bole Atlas', time: 'Fridays, 6:30 PM', status: 'Active' },
    { neighborhood: 'Sarbet', time: 'Tuesdays, 7:00 PM', status: 'Active' },
    { neighborhood: 'CMC / Summit', time: 'Sundays, 4:00 PM', status: 'Active' },
    { neighborhood: 'Kazanchis', time: 'Wednesdays, 6:30 PM', status: 'Active' },
    { neighborhood: 'Old Airport', time: 'Thursdays, 7:00 PM', status: 'Active' },
    { neighborhood: 'Lebu', time: 'Fridays, 6:00 PM', status: 'Active' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderHouses();
    
    window.onscroll = () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    };

    const menuBtn = document.getElementById('menu-btn');
    const overlay = document.getElementById('mobile-overlay');
    menuBtn.onclick = () => overlay.classList.add('open');
    document.getElementById('close-btn').onclick = () => overlay.classList.remove('open');

    // Form logic
    const joinForm = document.getElementById('platinumJoinForm');
    joinForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = joinForm.querySelector('button');
        btn.innerText = "SENDING...";
        btn.disabled = true;

        const data = Object.fromEntries(new FormData(joinForm).entries());

        try {
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
            document.getElementById('success-modal').classList.add('active');
            joinForm.reset();
        } catch (err) {
            btn.innerText = "RETRY";
            btn.disabled = false;
        }
    };
});

function renderHouses() {
    const grid = document.getElementById('house-grid');
    grid.innerHTML = houseData.map(h => `
        <div class="house-card">
            <span class="text-[9px] font-extrabold tracking-[.3em] uppercase text-[#A39171] mb-4 block">${h.status}</span>
            <h3 class="font-serif text-2xl mb-2">${h.neighborhood}</h3>
            <p class="text-gray-400 text-sm mb-6">${h.time}</p>
            <button onclick="navigateTo('join')" class="text-[10px] font-black uppercase tracking-widest border-b border-black pb-1">Request Visit</button>
        </div>
    `).join('');
}

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
