/* =====================================================
   RIGHT ARM - ELITE CYBER COMMUNITY
   Application Logic
   ===================================================== */

// ===== CONFIG =====
const SECRET_CODE = 'RIGHTARMXKARTEL';
const OWNER_PHONE = '940741895740';
const OWNER_EMAIL = 'rightarm.elite@protonmail.com';

// ===== REGISTERED USERS (admin adds after review) =====
let registeredUsers = JSON.parse(localStorage.getItem('ra_users') || '[]');
let applications = JSON.parse(localStorage.getItem('ra_applications') || '[]');

// ===== MATRIX RAIN EFFECT =====
function initMatrix(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]|/\\~`';
    const charArr = chars.split('');
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100;
    }

    let colorPhase = 0;

    function draw() {
        ctx.fillStyle = 'rgba(5, 5, 8, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        colorPhase += 0.005;
        const r = Math.floor(80 + Math.sin(colorPhase) * 40);
        const g = Math.floor(180 + Math.sin(colorPhase + 2) * 40);
        const b = Math.floor(80 + Math.sin(colorPhase + 4) * 40);

        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = charArr[Math.floor(Math.random() * charArr.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Red for some columns, blue-green for others
            if (i % 5 === 0) {
                ctx.fillStyle = `rgba(${180 + Math.floor(Math.random()*40)}, ${Math.floor(Math.random()*30)}, 0, 0.9)`;
            } else if (i % 3 === 0) {
                ctx.fillStyle = `rgba(0, ${g}, ${b}, 0.7)`;
            } else {
                ctx.fillStyle = `rgba(30, 60, 110, 0.5)`;
            }

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    setInterval(draw, 45);
}

// ===== INTRO LOADING ANIMATION =====
function playIntroAnimation() {
    const logoFrame = document.querySelector('.logo-frame');
    const terminal = document.querySelector('.access-terminal');
    const footer = document.querySelector('.intro-footer');

    // Start hidden
    logoFrame.style.opacity = '0';
    logoFrame.style.transform = 'scale(0.8)';
    terminal.style.opacity = '0';
    terminal.style.transform = 'translateY(20px)';
    footer.style.opacity = '0';

    // Phase 1: Logo appears with BPM-like pulse
    setTimeout(function() {
        logoFrame.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
        logoFrame.style.opacity = '1';
        logoFrame.style.transform = 'scale(1)';

        // Pulse effect on logo
        let pulseCount = 0;
        const pulseInterval = setInterval(function() {
            logoFrame.style.transform = pulseCount % 2 === 0 ? 'scale(1.03)' : 'scale(1)';
            pulseCount++;
            if (pulseCount >= 6) {
                clearInterval(pulseInterval);
                logoFrame.style.transform = 'scale(1)';
            }
        }, 200);
    }, 500);

    // Phase 2: Terminal slides in
    setTimeout(function() {
        terminal.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        terminal.style.opacity = '1';
        terminal.style.transform = 'translateY(0)';
    }, 2000);

    // Phase 3: Footer fades in
    setTimeout(function() {
        footer.style.transition = 'opacity 0.6s ease';
        footer.style.opacity = '1';
    }, 2800);
}

// ===== PAGE NAVIGATION =====
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(function(p) {
        p.classList.remove('active');
    });

    // Show target page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');

        // Init matrix for the new page
        if (pageId === 'intro-page') initMatrix('matrix-bg');
        if (pageId === 'form-page') initMatrix('matrix-bg-2');
        if (pageId === 'confirm-page') initMatrix('matrix-bg-3');
        if (pageId === 'login-page') initMatrix('matrix-bg-4');
    }
}

// ===== SECRET CODE VERIFICATION =====
function verifyCode() {
    const input = document.getElementById('secret-code');
    const code = input.value.trim().toUpperCase();
    const errorEl = document.getElementById('code-error');
    const successEl = document.getElementById('code-success');
    const btn = document.getElementById('access-btn');

    errorEl.classList.add('hidden');
    successEl.classList.add('hidden');

    if (code === SECRET_CODE) {
        successEl.classList.remove('hidden');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check"></i> AUTHORIZED';
        btn.style.background = 'linear-gradient(135deg, #006600, #004400)';
        btn.style.borderColor = 'var(--green)';
        input.disabled = true;
        input.style.borderBottomColor = 'var(--green-bright)';

        // Shake screen effect
        document.getElementById('intro-page').style.animation = 'none';
        setTimeout(function() {
            document.getElementById('intro-page').style.animation = 'shakeScreen 0.3s ease';
        }, 10);

        setTimeout(function() {
            showPage('form-page');
        }, 2000);
    } else {
        errorEl.classList.remove('hidden');
        input.style.borderColor = 'var(--red-bright)';
        input.style.boxShadow = '0 0 15px rgba(204,0,0,0.5)';
        input.value = '';
        input.focus();

        // Reset after error
        setTimeout(function() {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }, 2000);
    }
}

// Enter key support
document.addEventListener('DOMContentLoaded', function() {
    const secretInput = document.getElementById('secret-code');
    if (secretInput) {
        secretInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyCode();
            }
        });
    }
});

// ===== SUBMIT APPLICATION =====
function submitApplication(e) {
    e.preventDefault();

    const name = document.getElementById('f-name').value.trim();
    const idNum = document.getElementById('f-id').value.trim();
    const phone = document.getElementById('f-phone').value.trim();
    const address = document.getElementById('f-address').value.trim();
    const specialty = document.getElementById('f-specialty').value.trim();
    const unit = document.getElementById('f-unit').value;
    const reason = document.getElementById('f-reason').value.trim();
    const referrer = document.getElementById('f-referrer').value.trim();

    if (!name || !idNum || !phone || !address || !specialty || !unit || !reason || !referrer) {
        alert('All fields are required.');
        return;
    }

    const application = {
        id: 'RA-APP-' + Date.now(),
        name: name,
        idNumber: idNum,
        phone: phone,
        address: address,
        specialty: specialty,
        unit: unit,
        reason: reason,
        referrer: referrer,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    // Save to localStorage
    applications.push(application);
    localStorage.setItem('ra_applications', JSON.stringify(applications));

    // ===== SEND TO OWNER =====
    // Method 1: WhatsApp
    const whatsappMsg = encodeURIComponent(
        '[RIGHT ARM - NEW APPLICATION]\n\n' +
        'Name: ' + name + '\n' +
        'ID: ' + idNum + '\n' +
        'Phone: ' + phone + '\n' +
        'Address: ' + address + '\n' +
        'Specialty: ' + specialty + '\n' +
        'Unit: ' + unit + '\n' +
        'Reason: ' + reason + '\n' +
        'Referrer: ' + referrer + '\n' +
        'Time: ' + new Date().toLocaleString()
    );

    const whatsappUrl = 'https://wa.me/' + OWNER_PHONE + '?text=' + whatsappMsg;

    // Method 2: Email
    const emailSubject = encodeURIComponent('[RIGHT ARM] New Application - ' + name);
    const emailBody = encodeURIComponent(
        'RIGHT ARM - NEW APPLICATION\n\n' +
        'Name: ' + name + '\n' +
        'ID: ' + idNum + '\n' +
        'Phone: ' + phone + '\n' +
        'Address: ' + address + '\n' +
        'Specialty: ' + specialty + '\n' +
        'Unit: ' + unit + '\n' +
        'Reason: ' + reason + '\n' +
        'Referrer: ' + referrer + '\n' +
        'Time: ' + new Date().toLocaleString()
    );

    const emailUrl = 'mailto:' + OWNER_EMAIL + '?subject=' + emailSubject + '&body=' + emailBody;

    // Try WhatsApp first, fallback to email
    // Open WhatsApp in a new window
    const wWindow = window.open(whatsappUrl, '_blank');

    // If WhatsApp didn't open (popup blocked or no WhatsApp), try email
    setTimeout(function() {
        if (!wWindow || wWindow.closed) {
            window.open(emailUrl, '_blank');
        }
    }, 1500);

    // Show confirmation page
    setTimeout(function() {
        showPage('confirm-page');
    }, 2000);
}

// ===== LOGIN =====
function loginUser(e) {
    e.preventDefault();

    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value.trim();
    const errorEl = document.getElementById('login-error');

    errorEl.classList.add('hidden');

    // Check registered users
    const found = registeredUsers.find(function(u) {
        return u.username === username && u.password === password;
    });

    if (found) {
        document.getElementById('nav-username').innerHTML = '<i class="fas fa-user-ninja"></i> ' + found.codename;
        localStorage.setItem('ra_current_user', JSON.stringify(found));
        showPage('site-page');
    } else {
        errorEl.classList.remove('hidden');
        document.getElementById('login-pass').value = '';
    }
}

// ===== ADMIN: Add approved user =====
function addUser(codename, unit, username, password) {
    const newUser = {
        id: 'RA-' + String(registeredUsers.length + 1).padStart(3, '0'),
        codename: codename,
        unit: unit,
        username: username,
        password: password,
        status: 'active',
        addedAt: new Date().toISOString()
    };

    registeredUsers.push(newUser);
    localStorage.setItem('ra_users', JSON.stringify(registeredUsers));
    return newUser;
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem('ra_current_user');
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    showPage('login-page');
}

// ===== TAB SWITCHING =====
function switchTab(tabName, linkEl) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(function(t) {
        t.classList.remove('active');
    });

    // Deactivate all nav links
    document.querySelectorAll('.nav-link').forEach(function(l) {
        l.classList.remove('active');
    });

    // Activate selected
    document.getElementById('tab-' + tabName).classList.add('active');
    if (linkEl) linkEl.classList.add('active');
}

// ===== SHAKE SCREEN EFFECT =====
const shakeKeyframes = document.createElement('style');
shakeKeyframes.textContent = '
@keyframes shakeScreen {
    0%, 100% { transform: translateX(0); }
    10% { transform: translateX(-5px) translateY(2px); }
    20% { transform: translateX(5px) translateY(-2px); }
    30% { transform: translateX(-3px) translateY(1px); }
    40% { transform: translateX(3px) translateY(-1px); }
    50% { transform: translateX(-2px); }
    60% { transform: translateX(2px); }
    70% { transform: translateX(-1px); }
    80% { transform: translateX(1px); }
    90% { transform: translateX(0); }
}';
document.head.appendChild(shakeKeyframes);

// ===== INIT =====
window.addEventListener('DOMContentLoaded', function() {
    // Init matrix on intro page
    initMatrix('matrix-bg');

    // Play intro animation
    playIntroAnimation();

    // Pre-add the commander (ROME OLD ALPHA) as default user
    if (registeredUsers.length === 0) {
        addUser('ROME OLD ALPHA', 'Commander', 'romeoldalpha', 'RAROME2024');
        addUser('GHOST UNIT', 'Hacker', 'ghostunit', 'RAGHOST2024');
    }

    // Check if already logged in
    const currentUser = localStorage.getItem('ra_current_user');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        document.getElementById('nav-username').innerHTML = '<i class="fas fa-user-ninja"></i> ' + user.codename;
        showPage('site-page');
    }
});

// ===== CONSOLE COMMANDS FOR ADMIN =====
// In browser console, type:
// addUser('Codename', 'Unit', 'username', 'password')
// To add a new approved member
// To view applications: JSON.parse(localStorage.getItem('ra_applications'))
// To clear all data: localStorage.clear()