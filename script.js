const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';

document.addEventListener('DOMContentLoaded', () => {
    // Nav Scroll Logic
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile Menu Interaction
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const overlay = document.getElementById('mobile-overlay');

    menuBtn.addEventListener('click', () => overlay.classList.add('open'));
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

    // Form API Logic
    const joinForm = document.getElementById('joinForm');
    joinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = joinForm.querySelector('button');
        btn.innerText = "PROSESSING...";
        btn.disabled = true;

        const data = Object.fromEntries(new FormData(joinForm).entries());

        try {
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
            
            // Success Animation
            document.getElementById('input-layer').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('input-layer').classList.add('hidden');
                const success = document.getElementById('success-layer');
                success.classList.remove('hidden');
                setTimeout(() => {
                    success.style.opacity = '1';
                    success.style.transform = 'scale(1)';
                }, 50);
            }, 500);
        } catch (err) {
            btn.innerText = "ERROR - TRY AGAIN";
            btn.disabled = false;
        }
    });
});

function showSection(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    
    document.querySelectorAll('.desktop-links button').forEach(b => b.classList.remove('active-nav'));
    if(btn) btn.classList.add('active-nav');
    
    document.getElementById('mobile-overlay').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
