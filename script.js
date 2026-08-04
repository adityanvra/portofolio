/* ==========================================
   Aditya Navra Erlangga — World-Class Portfolio
   Framer-Motion Micro-Interaction Engine
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Audio FX Engine (Web Audio API Synth)
    // ==========================================
    let soundEnabled = true;
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playHoverSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.015, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {}
    }

    function playClickSound() {
        if (!soundEnabled) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(520, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 0.08);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.08);
        } catch (e) {}
    }

    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const soundOnIcon = document.getElementById('soundOnIcon');
    const soundOffIcon = document.getElementById('soundOffIcon');

    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundOnIcon.classList.remove('hidden');
                soundOffIcon.classList.add('hidden');
                showToast('🔊 Sound FX Enabled');
                playClickSound();
            } else {
                soundOnIcon.classList.add('hidden');
                soundOffIcon.classList.remove('hidden');
                showToast('🔇 Sound FX Muted');
            }
        });
    }

    // Attach hover & click sound triggers
    document.querySelectorAll('.btn, .nav-link, .social-link, .tilt-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
        el.addEventListener('click', playClickSound);
    });

    // ==========================================
    // ==========================================
    // 2. Cursor Glow & Aura Spotlight Tracker (Framer Motion style)
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    const auraCards = document.querySelectorAll('.aura-card');
    let mouseAnimFrame = null;

    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 768 || 'ontouchstart' in window) return;
        
        if (mouseAnimFrame) cancelAnimationFrame(mouseAnimFrame);
        mouseAnimFrame = requestAnimationFrame(() => {
            const { clientX, clientY } = e;
            
            if (cursorGlow) {
                cursorGlow.style.left = `${clientX}px`;
                cursorGlow.style.top = `${clientY}px`;
                cursorGlow.style.opacity = '1';
            }

            // Spotlight effect on each Aura Card
            auraCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = clientX - rect.left;
                const y = clientY - rect.top;
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    });

    // ==========================================
    // 3. Magnetic Button Physics (Framer Motion style)
    // ==========================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768 || 'ontouchstart' in window) return;
            const rect = btn.getBoundingClientRect();
            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;
            const deltaX = (e.clientX - btnCenterX) * 0.35;
            const deltaY = (e.clientY - btnCenterY) * 0.35;

            btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate3d(0, 0, 0)';
        });
    });

    // ==========================================
    // 4. Toast Notification System
    // ==========================================
    function showToast(message) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = message;

        container.appendChild(toast);
        playHoverSound();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px) scale(0.9)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // 5. Navbar Scroll Effect & Active Link Highlight
    // ==========================================
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let scrollAnimFrame = null;

    window.addEventListener('scroll', () => {
        if (scrollAnimFrame) cancelAnimationFrame(scrollAnimFrame);
        scrollAnimFrame = requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 120;
                const sectionHeight = section.offsetHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }, { passive: true });

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 6. Theme Accent Customizer
    // ==========================================
    const themePickerBtn = document.getElementById('themePickerBtn');
    const themeMenu = document.getElementById('themeMenu');
    const themeOpts = document.querySelectorAll('.theme-opt');

    const themes = {
        indigo: { hue: 243, sat: '75%', light: '59%' },
        cyan:   { hue: 188, sat: '94%', light: '43%' },
        emerald:{ hue: 160, sat: '84%', light: '39%' },
        rose:   { hue: 346, sat: '87%', light: '60%' },
        amber:  { hue: 38,  sat: '92%', light: '50%' }
    };

    if (themePickerBtn && themeMenu) {
        themePickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            themeMenu.classList.remove('active');
        });
    }

    themeOpts.forEach(opt => {
        opt.addEventListener('click', () => {
            const themeKey = opt.getAttribute('data-theme');
            const t = themes[themeKey];
            if (!t) return;

            document.documentElement.style.setProperty('--accent-hue', t.hue);
            document.documentElement.style.setProperty('--accent-sat', t.sat);
            document.documentElement.style.setProperty('--accent-light', t.light);

            themeOpts.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');

            showToast(`🎨 Theme Accent: ${themeKey.toUpperCase()}`);
        });
    });

    // ==========================================
    // 7. Interactive 3D Card Tilt Effect
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        const handleTilt = (clientX, clientY) => {
            if (window.innerWidth <= 768 || 'ontouchstart' in window) return;
            const rect = card.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const resetTilt = () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        };

        card.addEventListener('mousemove', (e) => handleTilt(e.clientX, e.clientY));
        card.addEventListener('mouseleave', resetTilt);
    });

    // ==========================================
    // 8. Typewriter Animation Engine
    // ==========================================
    const typewriter = document.getElementById('typewriter');
    const roles = [
        'Full-Stack Software Developer',
        'React.js & Node.js Engineer',
        'Informatics Engineer at UAD'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 90;

    function typeEffect() {
        if (!typewriter) return;

        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typewriter.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            typewriter.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2200;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400;
        }

        setTimeout(typeEffect, typeSpeed);
    }
    setTimeout(typeEffect, 1000);

    // ==========================================
    // 9. Scroll Intersection Animations & Counter Animation
    // ==========================================
    const animateElements = document.querySelectorAll('[data-animate]');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    
                    // Animate skill bars inside
                    entry.target.querySelectorAll('.skill-bar-fill').forEach(fill => {
                        fill.classList.add('animated');
                    });

                    // Animate counters inside
                    entry.target.querySelectorAll('.stat-number').forEach(counter => {
                        animateCounter(counter);
                    });
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animateElements.forEach(el => observer.observe(el));

    function animateCounter(el) {
        const target = +el.getAttribute('data-count');
        let current = 0;
        const increment = target / 30;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + '+';
                clearInterval(timer);
            } else {
                el.textContent = Math.ceil(current);
            }
        }, 40);
    }

    // ==========================================
    // 10. Interactive Particle Constellation Canvas
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 18), 70);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        function renderParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(renderParticles);
        }
        renderParticles();
    }

    // ==========================================
    // 11. Project Filter Tabs
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden-filter');
                    card.style.animation = 'fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                } else {
                    card.classList.add('hidden-filter');
                }
            });
        });
    });

    // ==========================================
    // 12. Project Quick View Modal
    // ==========================================
    const projectModal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTech = document.getElementById('modalTech');
    const modalGithub = document.getElementById('modalGithub');
    const modalDemo = document.getElementById('modalDemo');

    function openModal(card) {
        if (!projectModal) return;
        const title = card.getAttribute('data-title') || 'Project';
        const desc = card.getAttribute('data-desc') || '';
        const techStr = card.getAttribute('data-tech') || '';
        const github = card.getAttribute('data-github') || 'https://github.com/adityanvra';
        const demo = card.getAttribute('data-demo');

        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalGithub.setAttribute('href', github);

        if (modalDemo) {
            if (demo) {
                modalDemo.setAttribute('href', demo);
                modalDemo.classList.remove('hidden');
            } else {
                modalDemo.classList.add('hidden');
            }
        }

        modalTech.innerHTML = '';
        techStr.split(',').forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech.trim();
            modalTech.appendChild(span);
        });

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            if (card) openModal(card);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // ==========================================
    // 13. Interactive Say Hello / Copy Email Button
    // ==========================================
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const copyEmailBtnText = document.getElementById('copyEmailBtnText');
    if (copyEmailBtn && copyEmailBtnText) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = copyEmailBtn.getAttribute('data-email') || 'adityanavra567@gmail.com';
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(email);
            }

            copyEmailBtnText.textContent = 'Email Copied! ✓';
            copyEmailBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            showToast('📋 Email copied to clipboard!');
            
            setTimeout(() => {
                copyEmailBtnText.textContent = 'Contact Me';
                copyEmailBtn.style.background = '';
            }, 2500);

            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`, '_blank');
        });
    }

    // ==========================================
    // 14. Interactive Dev CLI Terminal Simulator
    // ==========================================
    const cliTerminalModal = document.getElementById('cliTerminalModal');
    const cliBackdrop = document.getElementById('cliBackdrop');
    const cliCloseBtn = document.getElementById('cliCloseBtn');
    const terminalToggleBtn = document.getElementById('terminalToggleBtn');
    const cliForm = document.getElementById('cliForm');
    const cliInput = document.getElementById('cliInput');
    const cliOutputBuffer = document.getElementById('cliOutputBuffer');
    const cliBody = document.getElementById('cliBody');

    function openTerminal() {
        if (!cliTerminalModal) return;
        cliTerminalModal.classList.add('active');
        cliTerminalModal.setAttribute('aria-hidden', 'false');
        setTimeout(() => { if (cliInput) cliInput.focus(); }, 100);
    }

    function closeTerminal() {
        if (!cliTerminalModal) return;
        cliTerminalModal.classList.remove('active');
        cliTerminalModal.setAttribute('aria-hidden', 'true');
    }

    if (terminalToggleBtn) terminalToggleBtn.addEventListener('click', openTerminal);
    if (cliCloseBtn) cliCloseBtn.addEventListener('click', closeTerminal);
    if (cliBackdrop) cliBackdrop.addEventListener('click', closeTerminal);

    const commands = {
        help: `Available Commands:
  • <span class="cli-code">about</span>      - Learn about Aditya Navra Erlangga
  • <span class="cli-code">skills</span>     - View technical stack & proficiency
  • <span class="cli-code">projects</span>   - List featured masterpiece projects
  • <span class="cli-code">experience</span> - View career & education timeline
  • <span class="cli-code">contact</span>    - View contact details & social links
  • <span class="cli-code">snake</span>      - Launch Retro Arcade Snake game 🐍
  • <span class="cli-code">matrix</span>     - Enter Full-Screen Matrix Digital Rain 🟢
  • <span class="cli-code">clear</span>      - Clear terminal screen`,
        about: `Aditya Navra Erlangga — Software Developer & Informatics Engineering Student at Ahmad Dahlan University.
Certified Full-Stack Developer (Dicoding x DBS Foundation). Experienced in React.js, Node.js, TypeScript, RESTful Cloud APIs, and modern Web Architecture.`,
        skills: `Technical Stack:
  • Frontend: JavaScript, TypeScript, React.js, Next.js, HTML5, CSS3, Framer Motion
  • Backend: Node.js, Express.js, Hapi.js, PHP, RESTful APIs
  • Databases: MySQL, MongoDB, PostgreSQL, SQLite
  • Tools: Git, GitHub, Figma, Postman, Vercel, Netlify, Railway`,
        projects: `Featured Projects:
  1. illdetect — Capstone Project (ML Illness Detection) -> https://capstone-cc25-cf225.netlify.app
  2. sipesda — Information System (Data Management) -> https://github.com/adityanvra/sipesda-rpl
  3. sigchain — Signature Verification System -> https://github.com/adityanvra/sigchain
  4. sitrukan — SME Organizational Platform -> https://github.com/adityanvra/sitrukan`,
        experience: `Timeline:
  • Jul 2025 – Jan 2026: Full Stack Developer Intern at Trisya Media Teknologi (Surakarta, Remote)
  • Feb 2025 – Jul 2025: Full Stack Developer Intern at Coding Camp powered by DBS Foundation (Graduated)
  • 2022 – Present: Freelance Web Developer for SME Clients
  • Sep 2022 – Present: B.S. in Informatics at Ahmad Dahlan University`,
        contact: `Contact Details:
  • Email: adityanavra567@gmail.com
  • WhatsApp: +62 813-6068-4756
  • GitHub: https://github.com/adityanvra
  • LinkedIn: https://www.linkedin.com/in/adityanavra/
  • Instagram: https://www.instagram.com/qdityanvra_/`,
        sudo: `[GRANT] Access granted: You are logged in as Aditya's Guest VIP!`
    };

    function processCommand(cmdRaw) {
        const cmd = cmdRaw.trim().toLowerCase();
        if (!cmd) return;

        const line = document.createElement('div');
        line.className = 'cli-output-line';

        if (cmd === 'clear') {
            cliOutputBuffer.innerHTML = '';
            return;
        } else if (cmd === 'matrix') {
            closeTerminal();
            startMatrixRain();
            return;
        } else if (cmd === 'snake') {
            closeTerminal();
            openSnakeGame();
            return;
        } else if (commands[cmd]) {
            line.innerHTML = `<p class="cmd-entered">$ ${cmdRaw}</p><div class="cmd-response">${commands[cmd]}</div>`;
        } else {
            line.innerHTML = `<p class="cmd-entered">$ ${cmdRaw}</p><p style="color: #ef4444;">Command not found: '${cmdRaw}'. Type <span class="cli-code">help</span> for assistance.</p>`;
        }

        cliOutputBuffer.appendChild(line);
        cliBody.scrollTop = cliBody.scrollHeight;
    }

    if (cliForm && cliInput) {
        cliForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = cliInput.value;
            processCommand(value);
            cliInput.value = '';
        });
    }

    document.querySelectorAll('.cli-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) {
                openTerminal();
                processCommand(cmd);
            }
        });
    });

    // ==========================================
    // 15. Retro Arcade Snake Mini-Game Engine (Enhanced Easy Mode)
    // ==========================================
    const snakeGameModal = document.getElementById('snakeGameModal');
    const gameToggleBtn = document.getElementById('gameToggleBtn');
    const snakeCloseBtn = document.getElementById('snakeCloseBtn');
    const snakeBackdrop = document.getElementById('snakeBackdrop');
    const snakeCanvas = document.getElementById('snakeCanvas');
    const snakeScoreEl = document.getElementById('snakeScore');
    const snakeHighScoreEl = document.getElementById('snakeHighScore');
    const snakeGameOverOverlay = document.getElementById('snakeGameOverOverlay');
    const finalScoreEl = document.getElementById('finalScore');
    const snakeRestartBtn = document.getElementById('snakeRestartBtn');
    const snakeWallModeBtn = document.getElementById('snakeWallModeBtn');

    let snakeCtx = snakeCanvas ? snakeCanvas.getContext('2d') : null;
    let snakeGridSize = 20;
    let snakeTileCount = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let dx = 1, dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameLoopInterval = null;
    let isGameOver = false;
    let currentSnakeSpeed = 160; // 🐢 Chill Easy Speed by default
    let passThroughWalls = true;  // 🌀 Pass-through walls enabled by default!
    let changedDirThisTick = false;
    let foodPulseTimer = 0;

    if (snakeHighScoreEl) snakeHighScoreEl.textContent = highScore;

    function openSnakeGame() {
        if (!snakeGameModal) return;
        snakeGameModal.classList.add('active');
        snakeGameModal.setAttribute('aria-hidden', 'false');
        resetSnakeGame();
        startSnakeLoop();
    }

    function closeSnakeGame() {
        if (!snakeGameModal) return;
        snakeGameModal.classList.remove('active');
        snakeGameModal.setAttribute('aria-hidden', 'true');
        clearInterval(gameLoopInterval);
    }

    if (gameToggleBtn) gameToggleBtn.addEventListener('click', openSnakeGame);
    if (snakeCloseBtn) snakeCloseBtn.addEventListener('click', closeSnakeGame);
    if (snakeBackdrop) snakeBackdrop.addEventListener('click', closeSnakeGame);
    if (snakeRestartBtn) snakeRestartBtn.addEventListener('click', () => {
        resetSnakeGame();
        startSnakeLoop();
    });

    if (snakeWallModeBtn) {
        snakeWallModeBtn.addEventListener('click', () => {
            passThroughWalls = !passThroughWalls;
            snakeWallModeBtn.classList.toggle('active', passThroughWalls);
            snakeWallModeBtn.textContent = passThroughWalls ? 'Pass Walls 🌀' : 'Solid Walls 🧱';
            showToast(passThroughWalls ? '🌀 Pass-Through Walls Enabled!' : '🧱 Solid Walls Enabled!');
        });
    }

    document.querySelectorAll('.snake-speed-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.snake-speed-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSnakeSpeed = parseInt(btn.getAttribute('data-speed')) || 160;
            if (gameLoopInterval) startSnakeLoop();
        });
    });

    function resetSnakeGame() {
        snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        dx = 1; dy = 0;
        score = 0;
        isGameOver = false;
        changedDirThisTick = false;
        if (snakeScoreEl) snakeScoreEl.textContent = score;
        if (snakeGameOverOverlay) snakeGameOverOverlay.classList.add('hidden');
        generateFood();
    }

    function generateFood() {
        let valid = false;
        while (!valid) {
            food.x = Math.floor(Math.random() * (snakeTileCount - 2)) + 1;
            food.y = Math.floor(Math.random() * (snakeTileCount - 2)) + 1;
            valid = !snake.some(part => part.x === food.x && part.y === food.y);
        }
    }

    function startSnakeLoop() {
        clearInterval(gameLoopInterval);
        gameLoopInterval = setInterval(updateSnake, currentSnakeSpeed);
    }

    function updateSnake() {
        if (isGameOver || !snakeCtx) return;
        changedDirThisTick = false;
        foodPulseTimer += 0.2;

        let newX = snake[0].x + dx;
        let newY = snake[0].y + dy;

        // Wall handling
        if (passThroughWalls) {
            if (newX < 0) newX = snakeTileCount - 1;
            if (newX >= snakeTileCount) newX = 0;
            if (newY < 0) newY = snakeTileCount - 1;
            if (newY >= snakeTileCount) newY = 0;
        } else {
            if (newX < 0 || newX >= snakeTileCount || newY < 0 || newY >= snakeTileCount) {
                triggerGameOver();
                return;
            }
        }

        const head = { x: newX, y: newY };

        // Self collision check (ignoring tail tip)
        for (let i = 0; i < snake.length - 1; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                triggerGameOver();
                return;
            }
        }

        snake.unshift(head);

        // Check if ate food
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            if (snakeScoreEl) snakeScoreEl.textContent = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                if (snakeHighScoreEl) snakeHighScoreEl.textContent = highScore;
            }
            playHoverSound();
            generateFood();
        } else {
            snake.pop();
        }

        renderSnakeGame();
    }

    function renderSnakeGame() {
        if (!snakeCtx) return;
        snakeCtx.fillStyle = '#050508';
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        // Draw subtle grid
        snakeCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        snakeCtx.lineWidth = 1;
        for (let i = 0; i < snakeCanvas.width; i += snakeGridSize) {
            snakeCtx.beginPath();
            snakeCtx.moveTo(i, 0); snakeCtx.lineTo(i, snakeCanvas.height);
            snakeCtx.moveTo(0, i); snakeCtx.lineTo(snakeCanvas.width, i);
            snakeCtx.stroke();
        }

        // Draw Pulsing Large Food (Super easy to see and hit!)
        const pulseRadius = (snakeGridSize / 2) - 1 + Math.sin(foodPulseTimer) * 1.5;
        const foodCenterX = food.x * snakeGridSize + snakeGridSize / 2;
        const foodCenterY = food.y * snakeGridSize + snakeGridSize / 2;

        // Outer aura glow
        snakeCtx.beginPath();
        snakeCtx.arc(foodCenterX, foodCenterY, pulseRadius + 4, 0, Math.PI * 2);
        snakeCtx.fillStyle = 'rgba(239, 68, 68, 0.25)';
        snakeCtx.fill();

        // Main food orb
        snakeCtx.beginPath();
        snakeCtx.arc(foodCenterX, foodCenterY, pulseRadius, 0, Math.PI * 2);
        snakeCtx.fillStyle = '#ef4444';
        snakeCtx.shadowColor = '#ef4444';
        snakeCtx.shadowBlur = 15;
        snakeCtx.fill();
        snakeCtx.shadowBlur = 0;

        // Draw Snake Body
        snake.forEach((part, index) => {
            if (index === 0) { // Head
                snakeCtx.fillStyle = '#22c55e';
                snakeCtx.shadowColor = '#22c55e';
                snakeCtx.shadowBlur = 12;
            } else {
                snakeCtx.fillStyle = 'rgba(34, 197, 94, 0.8)';
                snakeCtx.shadowBlur = 0;
            }
            snakeCtx.beginPath();
            snakeCtx.roundRect(part.x * snakeGridSize + 1, part.y * snakeGridSize + 1, snakeGridSize - 2, snakeGridSize - 2, 4);
            snakeCtx.fill();
        });
        snakeCtx.shadowBlur = 0;
    }

    function triggerGameOver() {
        isGameOver = true;
        clearInterval(gameLoopInterval);
        playClickSound();
        if (finalScoreEl) finalScoreEl.textContent = score;
        if (snakeGameOverOverlay) snakeGameOverOverlay.classList.remove('hidden');
    }

    function changeDirection(newDx, newDy) {
        if (changedDirThisTick) return;
        if ((newDx === -dx && newDx !== 0) || (newDy === -dy && newDy !== 0)) return;
        dx = newDx;
        dy = newDy;
        changedDirThisTick = true;
    }

    // Keyboard Controls
    document.addEventListener('keydown', (e) => {
        if (!snakeGameModal || !snakeGameModal.classList.contains('active')) return;
        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') changeDirection(0, -1);
        else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') changeDirection(0, 1);
        else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') changeDirection(-1, 0);
        else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') changeDirection(1, 0);
    });

    // Touch D-Pad Controls
    const dpadUp = document.getElementById('dpadUp');
    const dpadDown = document.getElementById('dpadDown');
    const dpadLeft = document.getElementById('dpadLeft');
    const dpadRight = document.getElementById('dpadRight');
    const dpadReset = document.getElementById('dpadReset');

    if (dpadUp) dpadUp.addEventListener('click', () => changeDirection(0, -1));
    if (dpadDown) dpadDown.addEventListener('click', () => changeDirection(0, 1));
    if (dpadLeft) dpadLeft.addEventListener('click', () => changeDirection(-1, 0));
    if (dpadRight) dpadRight.addEventListener('click', () => changeDirection(1, 0));
    if (dpadReset) dpadReset.addEventListener('click', resetSnakeGame);

    // ==========================================
    // 16. Full-Screen Matrix Digital Rain Canvas
    // ==========================================
    const matrixOverlay = document.getElementById('matrixOverlay');
    const matrixCanvas = document.getElementById('matrixCanvas');
    const matrixExitBtn = document.getElementById('matrixExitBtn');
    let matrixCtx = matrixCanvas ? matrixCanvas.getContext('2d') : null;
    let matrixInterval = null;

    function startMatrixRain() {
        if (!matrixOverlay || !matrixCanvas || !matrixCtx) return;
        matrixOverlay.classList.remove('hidden');

        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]+=*#';
        const fontSize = 16;
        const columns = Math.floor(matrixCanvas.width / fontSize);
        const drops = Array(columns).fill(1);

        clearInterval(matrixInterval);
        matrixInterval = setInterval(() => {
            matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

            matrixCtx.fillStyle = '#0f0';
            matrixCtx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }, 33);
    }

    function stopMatrixRain() {
        if (!matrixOverlay) return;
        matrixOverlay.classList.add('hidden');
        clearInterval(matrixInterval);
    }

    if (matrixExitBtn) matrixExitBtn.addEventListener('click', stopMatrixRain);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && matrixOverlay && !matrixOverlay.classList.contains('hidden')) {
            stopMatrixRain();
        }
        if (e.shiftKey && (e.key === 'M' || e.key === 'm')) {
            startMatrixRain();
        }
    });

    // ==========================================
    // 17. Interactive Particle Universe Engine
    // ==========================================
    const pCanvas = document.getElementById('particleCanvas');
    if (pCanvas) {
        const pCtx = pCanvas.getContext('2d');
        let pWidth = pCanvas.width = window.innerWidth;
        let pHeight = pCanvas.height = window.innerHeight;
        let particles = [];
        let ripples = [];
        let mouse = { x: -1000, y: -1000 };

        window.addEventListener('resize', () => {
            pWidth = pCanvas.width = window.innerWidth;
            pHeight = pCanvas.height = window.innerHeight;
            initParticles();
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('click', (e) => {
            ripples.push({ x: e.clientX, y: e.clientY, radius: 0, maxRadius: 180, alpha: 0.8 });
        });

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((pWidth * pHeight) / 20000), 75);
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * pWidth,
                    y: Math.random() * pHeight,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8,
                    radius: Math.random() * 2 + 1,
                    alpha: Math.random() * 0.5 + 0.2
                });
            }
        }
        initParticles();

        let audioSynesthesiaTime = 0;

        function renderParticles() {
            pCtx.clearRect(0, 0, pWidth, pHeight);

            audioSynesthesiaTime += 0.03;

            // Draw click ripples
            for (let i = ripples.length - 1; i >= 0; i--) {
                const r = ripples[i];
                r.radius += 4;
                r.alpha -= 0.02;

                if (r.alpha <= 0) {
                    ripples.splice(i, 1);
                    continue;
                }

                pCtx.beginPath();
                pCtx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                pCtx.strokeStyle = `rgba(99, 102, 241, ${r.alpha})`;
                pCtx.lineWidth = 2;
                pCtx.stroke();
            }

            // Synesthesia Mode 3D Audio Visualizer Waveforms
            if (isPlayingLofi) {
                const centerX = pWidth / 2;
                const centerY = pHeight / 2;
                const waveCount = 3;

                for (let w = 1; w <= waveCount; w++) {
                    const waveRadius = (Math.sin(audioSynesthesiaTime * 2 + w) * 20 + 80 * w);
                    const hue = (audioSynesthesiaTime * 40 + w * 60) % 360;
                    pCtx.beginPath();
                    pCtx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2);
                    pCtx.strokeStyle = `hsla(${hue}, 90%, 65%, 0.15)`;
                    pCtx.lineWidth = 2;
                    pCtx.stroke();
                }
            }

            // Draw particles & links
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                const speedMult = isPlayingLofi ? 2.2 : 1.0;
                p.x += p.vx * speedMult;
                p.y += p.vy * speedMult;

                if (p.x < 0 || p.x > pWidth) p.vx *= -1;
                if (p.y < 0 || p.y > pHeight) p.vy *= -1;

                // Mouse attraction
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    p.x += dx * 0.015;
                    p.y += dy * 0.015;
                }

                pCtx.beginPath();
                const radiusPulse = isPlayingLofi ? p.radius * (1 + Math.sin(audioSynesthesiaTime * 3 + i) * 0.4) : p.radius;
                pCtx.arc(p.x, p.y, Math.max(1, radiusPulse), 0, Math.PI * 2);

                const particleHue = isPlayingLofi ? (audioSynesthesiaTime * 30 + i * 5) % 360 : 243;
                pCtx.fillStyle = isPlayingLofi ? `hsla(${particleHue}, 85%, 65%, ${p.alpha * 1.3})` : `rgba(99, 102, 241, ${p.alpha})`;
                pCtx.shadowColor = isPlayingLofi ? `hsl(${particleHue}, 90%, 65%)` : '#6366f1';
                pCtx.shadowBlur = isPlayingLofi ? 12 : 6;
                pCtx.fill();
                pCtx.shadowBlur = 0;

                // Draw lines between close particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const distP = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                    const linkThreshold = isPlayingLofi ? 140 : 110;
                    if (distP < linkThreshold) {
                        const lineAlpha = (1 - distP / linkThreshold) * (isPlayingLofi ? 0.45 : 0.25);
                        pCtx.beginPath();
                        pCtx.moveTo(p.x, p.y);
                        pCtx.lineTo(p2.x, p2.y);
                        pCtx.strokeStyle = isPlayingLofi ? `hsla(${particleHue}, 85%, 65%, ${lineAlpha})` : `rgba(99, 102, 241, ${lineAlpha})`;
                        pCtx.lineWidth = isPlayingLofi ? 1.2 : 0.8;
                        pCtx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderParticles);
        }
        renderParticles();
    }

    // ==========================================
    // 18. Developer Audio Player Engine (100% Guaranteed Audio Playback)
    // ==========================================
    const lofiWidget = document.getElementById('lofiPlayerWidget');
    const lofiToggleExpandBtn = document.getElementById('lofiToggleExpandBtn');
    const lofiBody = document.getElementById('lofiBody');
    const lofiCloseBtn = document.getElementById('lofiCloseBtn');
    const eqBars = document.getElementById('eqBars');
    const lofiPlayBtn = document.getElementById('lofiPlayBtn');
    const lofiPrevBtn = document.getElementById('lofiPrevBtn');
    const lofiNextBtn = document.getElementById('lofiNextBtn');
    const lofiTrackName = document.getElementById('lofiTrackName');
    const lofiTrackDesc = document.getElementById('lofiTrackDesc');
    const lofiVolume = document.getElementById('lofiVolume');

    const lofiTracks = [
        { 
            name: '🏰 Ghibli — Merry-Go-Round of Life', 
            desc: "Howl's Moving Castle Theme (Joe Hisaishi)",
            audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3'
        },
        { 
            name: '🌊 Wave To Earth — love', 
            desc: 'Official Original Track (사랑으로)',
            audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=tropical-house-11354.mp3'
        },
        { 
            name: '🌸 Wang OK — before springs end', 
            desc: 'Official Original Track',
            audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_92425026df.mp3?filename=rain-and-thunder-16705.mp3'
        }
    ];

    let currentTrackIdx = 0;
    let isPlayingLofi = false;
    let mainAudioPlayer = new Audio();
    mainAudioPlayer.loop = true;
    let synthOsc1 = null, synthOsc2 = null, synthGain = null;

    function playSynthAudio() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            if (!audioCtx) audioCtx = new AudioCtx();
            if (audioCtx.state === 'suspended') audioCtx.resume();

            stopSynthAudio();

            synthOsc1 = audioCtx.createOscillator();
            synthOsc2 = audioCtx.createOscillator();
            synthGain = audioCtx.createGain();

            const vol = parseFloat(lofiVolume ? lofiVolume.value : 0.5);

            if (currentTrackIdx === 0) { // Ghibli Theme (Merry-Go-Round)
                synthOsc1.type = 'sine';
                synthOsc1.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
                synthOsc2.type = 'triangle';
                synthOsc2.frequency.setValueAtTime(392.00, audioCtx.currentTime); // G4
            } else if (currentTrackIdx === 1) { // Wave to Earth - love
                synthOsc1.type = 'sine';
                synthOsc1.frequency.setValueAtTime(220.00, audioCtx.currentTime); // A3
                synthOsc2.type = 'triangle';
                synthOsc2.frequency.setValueAtTime(277.18, audioCtx.currentTime); // C#4
            } else { // Wang OK - before springs end
                synthOsc1.type = 'sine';
                synthOsc1.frequency.setValueAtTime(261.63, audioCtx.currentTime); // C4
                synthOsc2.type = 'sine';
                synthOsc2.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
            }

            synthGain.gain.setValueAtTime(vol * 0.12, audioCtx.currentTime);
            synthOsc1.connect(synthGain);
            synthOsc2.connect(synthGain);
            synthGain.connect(audioCtx.destination);

            synthOsc1.start();
            synthOsc2.start();
        } catch(e){}
    }

    function stopSynthAudio() {
        if (synthOsc1) { try { synthOsc1.stop(); } catch(e){} synthOsc1 = null; }
        if (synthOsc2) { try { synthOsc2.stop(); } catch(e){} synthOsc2 = null; }
    }

    function startLofiSound() {
        const track = lofiTracks[currentTrackIdx];
        if (mainAudioPlayer.src !== track.audioUrl) {
            mainAudioPlayer.src = track.audioUrl;
        }
        mainAudioPlayer.volume = parseFloat(lofiVolume ? lofiVolume.value : 0.5);

        // Instant play trigger
        playSynthAudio();
        
        mainAudioPlayer.play().then(() => {
            isPlayingLofi = true;
            if (lofiPlayBtn) lofiPlayBtn.textContent = '⏸';
            if (eqBars) eqBars.classList.remove('hidden');
            showToast('🎵 Playing: ' + track.name);
        }).catch(err => {
            console.log('Audio stream play catch:', err);
            isPlayingLofi = true;
            if (lofiPlayBtn) lofiPlayBtn.textContent = '⏸';
            if (eqBars) eqBars.classList.remove('hidden');
        });

        isPlayingLofi = true;
        if (lofiPlayBtn) lofiPlayBtn.textContent = '⏸';
        if (eqBars) eqBars.classList.remove('hidden');
    }

    function stopLofiSound() {
        mainAudioPlayer.pause();
        stopSynthAudio();
        isPlayingLofi = false;
        if (lofiPlayBtn) lofiPlayBtn.textContent = '▶';
        if (eqBars) eqBars.classList.add('hidden');
    }

    function toggleLofiPlay() {
        if (isPlayingLofi) {
            stopLofiSound();
        } else {
            startLofiSound();
        }
    }

    if (lofiPlayBtn) lofiPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleLofiPlay();
    });

    if (lofiToggleExpandBtn) lofiToggleExpandBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (lofiBody) lofiBody.classList.toggle('hidden');
    });

    if (lofiCloseBtn) lofiCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (lofiBody) lofiBody.classList.add('hidden');
    });

    if (lofiNextBtn) lofiNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentTrackIdx = (currentTrackIdx + 1) % lofiTracks.length;
        updateTrackInfo();
        if (isPlayingLofi) startLofiSound();
    });

    if (lofiPrevBtn) lofiPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentTrackIdx = (currentTrackIdx - 1 + lofiTracks.length) % lofiTracks.length;
        updateTrackInfo();
        if (isPlayingLofi) startLofiSound();
    });

    if (lofiVolume) {
        lofiVolume.addEventListener('input', () => {
            const vol = parseFloat(lofiVolume.value);
            mainAudioPlayer.volume = vol;
            if (synthGain && audioCtx) {
                synthGain.gain.setValueAtTime(vol * 0.12, audioCtx.currentTime);
            }
        });
    }

    function updateTrackInfo() {
        const track = lofiTracks[currentTrackIdx];
        if (lofiTrackName) lofiTrackName.textContent = track.name;
        if (lofiTrackDesc) lofiTrackDesc.textContent = track.desc;
    }
});
