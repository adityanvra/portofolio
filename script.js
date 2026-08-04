document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Futuristic Web Audio Sound FX Engine
    // ==========================================
    let soundEnabled = true;
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playAudioTone(freq, type = 'sine', duration = 0.08) {
        if (!soundEnabled) return;
        try {
            initAudio();
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context fallback
        }
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
                playAudioTone(800, 'sine', 0.1);
                showToast('🔊 Sound Effects Enabled');
            } else {
                soundOnIcon.classList.add('hidden');
                soundOffIcon.classList.remove('hidden');
                showToast('mMuted Sound Effects');
            }
        });
    }

    // Add sound feedback to all buttons and links
    document.querySelectorAll('.btn, .nav-link, .social-link, .filter-btn, .theme-opt, .quick-view-btn').forEach(el => {
        el.addEventListener('mouseenter', () => playAudioTone(400, 'sine', 0.04));
        el.addEventListener('click', () => playAudioTone(650, 'triangle', 0.08));
    });

    // ==========================================
    // 2. Toast Notification System
    // ==========================================
    function showToast(message) {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ==========================================
    // 3. Particle Canvas Constellation
    // ==========================================
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 140 };

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.vx = (Math.random() - 0.5) * 0.8;
                this.vy = (Math.random() - 0.5) * 0.8;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

                // Mouse repulsion
                if (mouse.x && mouse.y) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const angle = Math.atan2(dy, dx);
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x -= Math.cos(angle) * force * 2;
                        this.y -= Math.sin(angle) * force * 2;
                    }
                }
            }

            draw() {
                ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 70);
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connecting lines
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================
    // 4. Cursor Glow Effect
    // ==========================================
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
            cursorGlow.style.opacity = '1';
        });
    }

    // ==========================================
    // 5. 3D Tilt Card Effect
    // ==========================================
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth <= 768) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // ==========================================
    // 6. Accent Color Theme Switcher
    // ==========================================
    const themePickerBtn = document.getElementById('themePickerBtn');
    const themeMenu = document.getElementById('themeMenu');
    const themeOpts = document.querySelectorAll('.theme-opt');

    const themes = {
        indigo: { hue: 243, sat: '75%', light: '59%' },
        cyan: { hue: 189, sat: '94%', light: '43%' },
        emerald: { hue: 160, sat: '84%', light: '39%' },
        rose: { hue: 347, sat: '89%', light: '60%' },
        amber: { hue: 38, sat: '92%', light: '50%' }
    };

    if (themePickerBtn && themeMenu) {
        themePickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeMenu.classList.toggle('active');
        });

        document.addEventListener('click', () => themeMenu.classList.remove('active'));

        themeOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                const themeKey = opt.getAttribute('data-theme');
                if (themes[themeKey]) {
                    const { hue, sat, light } = themes[themeKey];
                    document.documentElement.style.setProperty('--accent-hue', hue);
                    document.documentElement.style.setProperty('--accent-sat', sat);
                    document.documentElement.style.setProperty('--accent-light', light);

                    themeOpts.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');

                    localStorage.setItem('selectedTheme', themeKey);
                    showToast(`🎨 Theme Changed to ${themeKey.toUpperCase()}`);
                }
            });
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme && themes[savedTheme]) {
            const opt = document.querySelector(`.theme-opt[data-theme="${savedTheme}"]`);
            if (opt) opt.click();
        }
    }

    // ==========================================
    // 7. Navbar Scroll & Link Highlight
    // ==========================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

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
    const navMenu = document.getElementById('navLinks');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ==========================================
    // 8. Typewriter Effect
    // ==========================================
    const typewriter = document.getElementById('typewriter');
    const roles = [
        'Full-Stack Web Applications',
        'Java OOP Architecture',
        'RESTful Services & APIs',
        'Clean & Modular Code'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

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
    // 9. Scroll Intersection Animations
    // ==========================================
    const animateElements = document.querySelectorAll('[data-animate]');
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    animateElements.forEach(el => observer.observe(el));

    // Number Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    function startCounting() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'), 10);
            let count = 0;
            const duration = 1800;
            const increment = target / (duration / 16);

            const timer = setInterval(() => {
                count += increment;
                if (count >= target) {
                    stat.textContent = target + '+';
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(count) + '+';
                }
            }, 16);
        });
    }

    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                startCounting();
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // Skill Bar Fill Animation
    const skillFills = document.querySelectorAll('.skill-bar-fill');
    const skillSection = document.querySelector('.skill-bars-container');

    if (skillSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                skillFills.forEach(fill => fill.classList.add('animated'));
            }
        }, { threshold: 0.3 });
        skillObserver.observe(skillSection);
    }

    // ==========================================
    // 10. Project Category Filter System
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
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.classList.add('hidden-filter');
                }
            });
        });
    });

    // ==========================================
    // 11. Project Quick View Modal
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
    // 12. Interactive Say Hello / Copy Email Button
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
                copyEmailBtnText.textContent = 'Say Hello!';
                copyEmailBtn.style.background = '';
            }, 2500);

            window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`, '_blank');
        });
    }
});
