const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwfa_F3nty9-MQkwx5a_KATGUMqU6Jt7XfPhyhwh10WoaLSxu4FbKEkG08z213fkyt6/exec';
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar transition
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    });

    // 2. Mobile UI Triggers
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const overlay = document.getElementById('mobile-overlay');

    menuBtn.onclick = () => overlay.classList.add('open');
    closeBtn.onclick = () => overlay.classList.remove('open');

    // 3. Form Submission API
    const joinForm = document.getElementById('platinumJoinForm');
    joinForm.onsubmit = async (e) => {
        e.preventDefault();
        const btn = joinForm.querySelector('button');
        btn.innerText = "AUTHENTICATING...";
        btn.disabled = true;

        const data = Object.fromEntries(new FormData(joinForm).entries());

        try {
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
            
            // Trigger Success State
            document.getElementById('form-inputs').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('form-inputs').classList.add('hidden');
                const success = document.getElementById('form-success');
                success.classList.remove('hidden');
                setTimeout(() => {
                    success.style.opacity = '1';
                    success.style.transform = 'scale(1)';
                }, 50);
            }, 600);
        } catch (err) {
            btn.innerText = "CONNECTION ERROR - RETRY";
            btn.disabled = false;
        }
    };
});

/**
 * THE NAVIGATION ENGINE
 * This is the ONLY way to switch pages. 
 * It forces a complete reset of the section states.
 */
function navigateTo(targetId, navElement = null) {
    // 1. Close mobile menu immediately
    document.getElementById('mobile-overlay').classList.remove('open');

    // 2. Hide ALL sections
    document.querySelectorAll('.spa-section').forEach(section => {
        section.classList.remove('active');
    });

    // 3. Show the requested section
    const target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
    }

    // 4. Update Nav Styling (Desktop)
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (navElement) {
        navElement.classList.add('active');
    }

    // 5. Reset scroll position
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
