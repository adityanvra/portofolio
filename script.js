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
    // 2. Cursor Glow & Aura Spotlight Tracker (Framer Motion style)
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    const auraCards = document.querySelectorAll('.aura-card');

    document.addEventListener('mousemove', (e) => {
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

    // ==========================================
    // 3. Magnetic Button Physics (Framer Motion style)
    // ==========================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
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

    window.addEventListener('scroll', () => {
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

        card.addEventListener('touchmove', (e) => {
            if (e.touches && e.touches[0]) {
                handleTilt(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });
        card.addEventListener('touchend', resetTilt);
    });

    // ==========================================
    // 8. Typewriter Animation Engine
    // ==========================================
    const typewriter = document.getElementById('typewriter');
    const roles = [
        'Full-Stack Software Developer',
        'Framer Motion UI Specialist',
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
        const github = card.getAttribute('data-github') || '#';
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
});
