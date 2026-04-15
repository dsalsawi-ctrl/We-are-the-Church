const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';
// Content for the House Churches Section
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
    
    // Mobile Menu
    document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-overlay').classList.add('open');
    document.getElementById('close-btn').onclick = () => document.getElementById('mobile-overlay').classList.remove('open');

    // Form Submission
    const joinForm = document.getElementById('platinumJoinForm');
    joinForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = joinForm.querySelector('button');
        btn.innerText = "SENDING...";
        btn.disabled = true;

        try {
            const data = Object.fromEntries(new FormData(joinForm).entries());
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
            
            // Show Success Card
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
        <div class="house-card bg-white p-8 border border-gray-100 shadow-sm">
            <span class="text-[9px] font-bold tracking-[.3em] uppercase text-[#A39171] block mb-4">${h.status}</span>
            <h3 class="font-serif text-2xl mb-2">${h.neighborhood}</h3>
            <p class="text-gray-400 text-xs mb-6">${h.time}</p>
            <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Request Visit</button>
        </div>
    `).join('');
}

function navigateTo(targetId, navElement = null) {
    document.getElementById('mobile-overlay').classList.remove('open');
    document.querySelectorAll('.spa-section').forEach(s => s.classList.remove('active'));
    document.getElementById(targetId).classList.add('active');
    
    // Nav Highlighting
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (navElement) navElement.classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    navigateTo('home'); // Takes them back to Vision
}
