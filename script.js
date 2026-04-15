const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';
// Content for the empty "House Churches" section
const houseData = [
    { neighborhood: 'Bole Atlas', day: 'Fridays', time: '6:30 PM', status: 'Active' },
    { neighborhood: 'Sarbet', day: 'Tuesdays', time: '7:00 PM', status: 'Active' },
    { neighborhood: 'CMC / Summit', day: 'Sundays', time: '4:00 PM', status: 'Active' },
    { neighborhood: 'Kazanchis', day: 'Wednesdays, 6:30 PM', status: 'Active' },
    { neighborhood: 'Old Airport', day: 'Thursdays, 7:00 PM', status: 'Active' }
];

document.addEventListener('DOMContentLoaded', () => {
    renderHouses();
    
    // Smooth Scrolling Navbar Transition
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile UI Triggers
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const overlay = document.getElementById('mobile-overlay');

    menuBtn.onclick = () => overlay.classList.add('open');
    closeBtn.onclick = () => overlay.classList.remove('open');

    // Form API Logic
    const joinForm = document.getElementById('platinumJoinForm');
    joinForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = joinForm.querySelector('button');
        btn.innerText = "AUTHENTICATING...";
        btn.disabled = true;

        const data = Object.fromEntries(new FormData(joinForm).entries());

        try {
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
            
            // Show Platinum Success State
            document.getElementById('input-layer').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('input-layer').classList.add('hidden');
                const success = document.getElementById('success-msg');
                success.classList.remove('hidden');
                setTimeout(() => success.style.opacity = '1', 50);
            }, 600);
        } catch (err) {
            btn.innerText = "ERROR - TRY AGAIN";
            btn.disabled = false;
        }
    };
});

function renderHouses() {
    const grid = document.getElementById('house-grid');
    if(grid) {
        grid.innerHTML = houseData.map(h => `
            <div class="house-card bg-white p-10 border border-gray-100 text-left">
                <span class="text-[9px] font-bold tracking-[.3em] uppercase text-[#A39171] block mb-4">${h.status} Seats</span>
                <h3 class="font-serif text-2xl mb-2">${h.neighborhood}</h3>
                <p class="text-gray-400 text-sm mb-6">${h.day} at ${h.time}</p>
                <button onclick="navigateTo('join')" class="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">Request Invitation</button>
            </div>
        `).join('');
    }
}

/**
 * THE CORE NAVIGATION ENGINE
 * Forces all sections to hide and strictly shows the targeted one.
 */
function navigateTo(targetId, navElement = null) {
    // 1. Close mobile overlay immediately on click
    document.getElementById('mobile-overlay').classList.remove('open');

    // 2. Hide ALL sections using the spa-section class
    document.querySelectorAll('.spa-section').forEach(section => {
        section.classList.remove('active');
    });

    // 3. Reveal the target section
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
    }

    // 4. Update Desktop Nav styling
    document.querySelectorAll('.desktop-menu .nav-btn').forEach(btn => btn.classList.remove('active'));
    if (navElement) {
        navElement.classList.add('active');
    }

    // 5. Instantly snap to the top of the new section
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
