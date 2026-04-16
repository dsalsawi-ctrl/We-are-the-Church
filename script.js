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
        grid.innerHTML = houseData.map(h => `
            <div class="house-card">
                <h3 class="font-serif text-2xl mb-2">${h.neighborhood}</h3>
                <p class="text-gray-400 text-sm mb-6">${h.time}</p>
                <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Request Visit</button>
            </div>
        `).join('');
    }

    // Scroll Effects
    window.onscroll = () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    };

    // UI Controls
    document.getElementById('menu-btn').onclick = () => document.getElementById('mobile-overlay').classList.add('open');
    document.getElementById('close-btn').onclick = () => document.getElementById('mobile-overlay').classList.remove('open');

    // Form Logic
    const joinForm = document.getElementById('platinumJoinForm');
    if(joinForm) {
        joinForm.onsubmit = async (e) => {
            e.preventDefault();
            const btn = joinForm.querySelector('button');
            btn.innerText = "AUTHENTICATING...";
            btn.disabled = true;
            try {
                const data = Object.fromEntries(new FormData(joinForm).entries());
                await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
                document.getElementById('success-modal').classList.add('active');
                joinForm.reset();
            } catch (err) { 
                btn.innerText = "RETRY"; 
                btn.disabled = false;
            }
        };
    }
});

function navigateTo(targetId, navElement = null) {
    // 1. Close mobile menu
    document.getElementById('mobile-overlay').classList.remove('open');

    // 2. Clear all sections completely
    document.querySelectorAll('.spa-section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none'; // Physical removal from flow
    });

    // 3. Activate target
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
        target.style.display = 'block';
    }

    // 4. Reset scroll instantly
    window.scrollTo(0, 0);
}

// Success Card Control
function closeSuccessModal() {
    document.getElementById('success-modal').classList.remove('active');
    navigateTo('home');
}
