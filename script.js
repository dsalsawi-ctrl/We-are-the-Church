const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyDej7Lq-hY1aAOsvNZECx2-JizWiSZTDqoyPOMG80IL1frfRHs0nBpMF-jRHfZEpey/exec';

document.addEventListener('DOMContentLoaded', () => {
    // Nav Scroll
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
    });

    // Form Processing
    const form = document.getElementById('joinForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        btn.innerHTML = '<span class="opacity-50 tracking-tighter italic font-light">Establishing Connection...</span>';
        
        const data = Object.fromEntries(new FormData(form).entries());

        try {
            await fetch(GOOGLE_SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(data) });
            
            // Platinum Success Transition
            document.getElementById('input-layer').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('input-layer').classList.add('hidden');
                const success = document.getElementById('success-layer');
                success.classList.remove('hidden');
                setTimeout(() => success.style.opacity = '1', 50);
            }, 600);
        } catch (err) {
            btn.innerText = "RETRY";
        }
    });
});

function showSection(id, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active-nav'));
    if(btn) btn.classList.add('active-nav');
    document.getElementById('nav-menu').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
