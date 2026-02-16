// Check if Chart.js loaded
if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded!');
}

class CyberPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createMatrixEffect();
        this.createParticleEffect();
        this.startTypewriter();
        this.setupSkillsChart();
        this.observeElements();
        this.setupScrollProgress();
        this.setupStatCounters();
        this.setupCardTilt();
        this.setupSpotlightEffect();
    }

    init() {
        this.typewriterText = [
            "Scanning for vulnerabilities...",
            "Bypassing firewalls...",
            "Analyzing network traffic...",
            "Hardening security protocols...",
            "Monitoring threat landscapes...",
            "Testing AI model defenses...",
            "Orchestrating multi-agent ops...",
            "Cyber Reaper online and ready...",
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navlinks');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    navLinks.classList.remove('active');
                }
            });
        });

        // Contact form
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createRipple(e);
            setTimeout(() => {
                alert('Message received! Initializing secure communication channel...');
            }, 300);
        });

        // Skills animation on scroll
        window.addEventListener('scroll', () => {
            this.animateSkillsOnScroll();
            this.updateScrollProgress();
        });
    }

    createMatrixEffect() {
        const canvas = document.getElementById('matrix');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px Share Tech Mono';

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(drawMatrix, 100);

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    createParticleEffect() {
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.fillStyle = `rgba(0, 255, 65, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections
            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(0, 255, 65, ${0.2 * (1 - distance / 100)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    startTypewriter() {
        const typewriterElement = document.getElementById('typingText');

        const type = () => {
            const currentText = this.typewriterText[this.currentTextIndex];

            if (this.isDeleting) {
                typewriterElement.innerHTML = currentText.substring(0, this.currentCharIndex - 1) + '<span class="cursor">_</span>';
                this.currentCharIndex--;
            } else {
                typewriterElement.innerHTML = currentText.substring(0, this.currentCharIndex + 1) + '<span class="cursor">_</span>';
                this.currentCharIndex++;
            }

            let typeSpeed = this.isDeleting ? 50 : 100;

            if (!this.isDeleting && this.currentCharIndex === currentText.length) {
                typeSpeed = 2000;
                this.isDeleting = true;
            } else if (this.isDeleting && this.currentCharIndex === 0) {
                this.isDeleting = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.typewriterText.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        type();
    }

    setupSkillsChart() {
        const ctx = document.getElementById('skillsChart').getContext('2d');

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Automation',
                    'Network Security',
                    'Artificial Intelligence',
                    'Malware Analysis',
                    'Coding',
                    'Cloud Security',
                    'SIEM Management',
                    'Machine Learning'
                ],
                datasets: [{
                    label: 'Expertise Level',
                    data: [95, 88, 92, 80, 85, 90, 75, 82],
                    borderColor: '#00ff41',
                    backgroundColor: 'rgba(0, 255, 65, 0.1)',
                    pointBackgroundColor: '#00ff41',
                    pointBorderColor: '#00ff41',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#00ff41'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#ffffff'
                        }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#666666',
                            stepSize: 20
                        },
                        grid: {
                            color: '#333333'
                        },
                        pointLabels: {
                            color: '#b0b0b0',
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    animateSkillsOnScroll() {
        const skillsSection = document.getElementById('skills');
        const skillProgressBars = document.querySelectorAll('.skill-progress');
        const sectionTop = skillsSection.offsetTop;
        const sectionHeight = skillsSection.offsetHeight;
        const scrollPos = window.pageYOffset;

        if (scrollPos > sectionTop - window.innerHeight && scrollPos < sectionTop + sectionHeight) {
            skillProgressBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
        }
    }

    setupScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
        });
    }

    updateScrollProgress() {
        const progressBar = document.getElementById('scrollProgress');
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }

    setupStatCounters() {
        const statCards = document.querySelectorAll('.stat-card');
        let hasAnimated = false;

        const animateCounter = (element, target, suffix = '') => {
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    if (suffix === '%') {
                        element.textContent = current.toFixed(1) + suffix;
                    } else {
                        element.textContent = Math.floor(current) + (suffix === '+' ? '+' : '');
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    if (suffix === '%') {
                        element.textContent = target + suffix;
                    } else {
                        element.textContent = target + (suffix === '+' ? '+' : '');
                    }
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    statCards.forEach(card => {
                        const numberElement = card.querySelector('.stat-number');
                        const target = parseFloat(card.getAttribute('data-target'));
                        
                        if (numberElement.textContent === '24/7') {
                            return; // Skip the 24/7 stat
                        }
                        
                        if (card.querySelector('.stat-label').textContent.includes('Detection')) {
                            animateCounter(numberElement, target, '%');
                        } else {
                            animateCounter(numberElement, target, '+');
                        }
                    });
                }
            });
        }, { threshold: 0.5 });

        statCards.forEach(card => observer.observe(card));
    }

    setupCardTilt() {
        const cards = document.querySelectorAll('.project-card, .cert-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    setupSpotlightEffect() {
        const spotlightCards = document.querySelectorAll('.spotlight-card');

        spotlightCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                const spotlight = card.querySelector('::after');
                if (spotlight) {
                    const transform = `translate(${x - rect.width}px, ${y - rect.height}px)`;
                    card.style.setProperty('--spotlight-transform', transform);
                }
            });
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple-effect');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe timeline items, project cards, and cert cards
        document.querySelectorAll('.timeline-item, .project-card, .cert-card, .stat-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CyberPortfolio();
});

// Prevent right-click (optional security feature)
document.addEventListener('contextmenu', e => e.preventDefault());

// Console message for curious developers
console.log(`
%c
 ██████╗██╗   ██╗██████╗ ███████╗██████╗     ██████╗ ███████╗ █████╗ ██████╗ ███████╗██████╗ 
██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝██╔══██╗    ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝██╔══██╗
██║      ╚████╔╝ ██████╔╝█████╗  ██████╔╝    ██████╔╝█████╗  ███████║██████╔╝█████╗  ██████╔╝
██║       ╚██╔╝  ██╔══██╗██╔══╝  ██╔══██╗    ██╔══██╗██╔══╝  ██╔══██║██╔═══╝ ██╔══╝  ██╔══██╗
╚██████╗   ██║   ██████╔╝███████╗██║  ██║    ██║  ██║███████╗██║  ██║██║     ███████╗██║  ██║
 ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝

%cCYBER REAPER ONLINE - All systems operational.
%cLooking for talented individuals? Check out my work.
`, 'color: #00ff41; font-weight: bold;', 'color: #00d4ff;', 'color: #b0b0b0;');