const GOOGLE_SCRIPT_URL = 'YOUR_DEPLOYED_SCRIPT_URL_HERE';

// HOUSE CHURCH DATA
const activeHouses = [
    { neighborhood: 'Bole Atlas', day: 'Fridays', time: '6:30 PM', status: 'Open' },
    { neighborhood: 'Sarbet', day: 'Tuesdays', time: '7:00 PM', status: 'Full' },
    { neighborhood: 'CMC / Summit', day: 'Sundays', time: '4:00 PM', status: 'Open' },
    { neighborhood: 'Lebu', day: 'Thursdays', time: '6:30 PM', status: 'Open' }
];

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    renderHouses();
    setupFormListeners();
});

// NAVIGATION LOGIC
function showSection(sectionId, btn = null) {
    document.querySelectorAll('.section-container').forEach(s => s.classList.remove('active-section'));
    document.getElementById(sectionId).classList.add('active-section');
    
    if(btn) {
        document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    window.scrollTo(0,0);
}

// RENDER HOUSES
function renderHouses() {
    const grid = document.getElementById('house-grid');
    grid.innerHTML = activeHouses.map(h => `
        <div class="bg-white p-8 border border-gray-100 shadow-sm text-left">
            <span class="text-[10px] uppercase tracking-widest font-bold ${h.status === 'Open' ? 'text-green-600' : 'text-red-400'}">${h.status} Seats</span>
            <h3 class="font-serif text-2xl mt-2 mb-4">${h.neighborhood}</h3>
            <p class="text-sm text-gray-500">${h.day} at ${h.time}</p>
            <button onclick="showSection('join')" class="mt-6 text-xs font-bold uppercase border-b border-black pb-1 hover:opacity-50 transition">Request to Join</button>
        </div>
    `).join('');
}

// FORM HANDLING (THE API BRIDGE)
function setupFormListeners() {
    const forms = ['joinForm', 'contactForm'];
    
    forms.forEach(id => {
        const form = document.getElementById(id);
        if(!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'SENDING...';

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                // Post to Google Apps Script
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify(data)
                });
                
                alert('Thank you! We will reach out to you soon.');
                form.reset();
            } catch (err) {
                alert('Connection error. Please try again.');
            } finally {
                submitBtn.innerText = originalText;
            }
        });
    });
}
