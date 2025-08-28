class CyberPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.createMatrixEffect();
        this.startTypewriter();
        this.setupSkillsChart();
        this.observeElements();
    }

    init() {
        this.typewriterText = [
            "Scanning for vulnerabilities...",
            "Bypassing firewalls...",
            "Analyzing network traffic...",
            "Hardening security protocols...",
            "Monitoring threat landscapes...",
            "Cyber Reaper online and ready...",
        ];
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
    }

    setupEventListeners() {
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    targetscrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    navLinks.classList.remove('active'); // Close mobile menu on link click
                }
            });
        });

        // Contact form
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message received! Initializing secure communication channel...');
        });

        // Skills animation on scroll
        window.addEventListener('scroll', () => this.animateSkillsOnScroll());
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

    startTypewriter() {
        const typewriterElement = doccument.getElementById('typingText');

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
                    'Penetration Testing',
                    'Network Security',
                    'Digital Forensics',
                    'Malware Analysis',
                    'Python/Scripting',
                    'Cloud Security',
                    'SIEM Management',
                    'Risk Assessment'
                ],
                datasets: [{
                    label: Expertise Level ,
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

    animateSkillOnScroll() {
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

    observerElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isInteresting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        //Observe timeline items, project cards, and cert cards
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
console.log('
╔═══════════════════════════════════════╗
║          CYBER REAPER ONLINE          ║
║    Unauthorized access detected...    ║
║      Initiating countermeasures       ║
╚═══════════════════════════════════════╝
');