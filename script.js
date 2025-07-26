// Language and Theme Management
class GameStudioWebsite {
    constructor() {
        this.currentLang = 'tr';
        this.currentTheme = 'light';
        this.translations = {
            tr: {
                // Turkish translations (already in HTML data attributes)
            },
            en: {
                // English translations (already in HTML data attributes)
            }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initAnimations();
        this.initTheme();
        this.initLanguage();
        this.initGameEffects();
        this.loadPreferences();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language toggle
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => this.scrollToSection('about'));
        }

        // Hero buttons
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        heroButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (index === 0) this.scrollToSection('games');
                if (index === 1) this.scrollToSection('team');
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Portfolio/Games filter
        this.setupGameFilter();

        // Hamburger menu
        this.setupMobileMenu();

        // Form submission
        this.setupContactForm();

        // Window events
        window.addEventListener('load', () => this.onPageLoad());
        window.addEventListener('resize', () => this.onResize());

        // Game effects
        this.setupGameEffects();

        // Konami code easter egg
        this.setupKonamiCode();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply theme to both data attribute and class for better compatibility
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        document.body.classList.toggle('light-theme', this.currentTheme === 'light');

        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        // Save preference
        localStorage.setItem('gameStudioTheme', this.currentTheme);

        // Theme transition effect
        this.createThemeTransition();

        this.showNotification(
            this.currentLang === 'tr' 
                ? `${this.currentTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} tema aktif!` 
                : `${this.currentTheme === 'dark' ? 'Dark' : 'Light'} theme activated!`,
            'success'
        );
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'tr' ? 'en' : 'tr';
        
        // Update all translatable elements
        const elements = document.querySelectorAll('[data-tr], [data-en]');
        elements.forEach(element => {
            const translation = element.getAttribute(`data-${this.currentLang}`);
            if (translation) {
                element.textContent = translation;
            }
        });

        // Update placeholders
        const inputElements = document.querySelectorAll('input[data-tr-placeholder], textarea[data-tr-placeholder], input[data-en-placeholder], textarea[data-en-placeholder]');
        inputElements.forEach(element => {
            const placeholder = element.getAttribute(`data-${this.currentLang}-placeholder`);
            if (placeholder) {
                element.placeholder = placeholder;
            }
        });

        // Update select options
        const selectElements = document.querySelectorAll('select option[data-tr], select option[data-en]');
        selectElements.forEach(option => {
            const translation = option.getAttribute(`data-${this.currentLang}`);
            if (translation) {
                option.textContent = translation;
            }
        });

        // Update language button
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            const flag = langBtn.querySelector('.flag');
            const text = langBtn.querySelector('.lang-text');
            if (this.currentLang === 'tr') {
                flag.textContent = '🇹🇷';
                text.textContent = 'TR';
            } else {
                flag.textContent = '🇺🇸';
                text.textContent = 'EN';
            }
        }

        // Save preference
        localStorage.setItem('gameStudioLang', this.currentLang);

        this.showNotification(
            this.currentLang === 'tr' 
                ? 'Dil değiştirildi: Türkçe' 
                : 'Language changed: English',
            'success'
        );
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        this.scrollToSection(targetId);
        
        // Close mobile menu if open
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && hamburger) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }

    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.pageYOffset;
        
        // Navbar background effect based on current theme
        const isDark = document.body.classList.contains('dark-theme') || 
                      document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (scrolled > 100) {
            navbar.style.background = isDark 
                ? 'rgba(26, 26, 26, 0.98)' 
                : 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = isDark 
                ? '0 2px 20px rgba(255, 255, 255, 0.15)' 
                : '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = isDark 
                ? 'rgba(26, 26, 26, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = isDark 
                ? '0 2px 20px rgba(255, 255, 255, 0.1)' 
                : '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        // Parallax effects
        this.updateParallaxEffects(scrolled);

        // Update active nav link
        this.updateActiveNavLink();
    }

    updateParallaxEffects(scrolled) {
        // Hero parallax
        const heroElements = document.querySelectorAll('.floating-code');
        heroElements.forEach((element, index) => {
            const speed = 0.3 + (index * 0.1);
            element.style.transform = `translateX(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
        });

        // Game character parallax
        const gameCharacter = document.querySelector('.game-character');
        if (gameCharacter) {
            gameCharacter.style.transform = `translateX(-50%) translateY(${Math.sin(scrolled * 0.01) * 10}px)`;
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const navHeight = document.querySelector('.navbar').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    setupGameFilter() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const gameItems = document.querySelectorAll('.game-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                // Animate filter change
                gameItems.forEach(item => {
                    if (filterValue === 'all') {
                        this.showGameCard(item);
                    } else {
                        const itemCategory = item.getAttribute('data-category');
                        if (itemCategory === filterValue) {
                            this.showGameCard(item);
                        } else {
                            this.hideGameCard(item);
                        }
                    }
                });
            });
        });
    }

    showGameCard(card) {
        card.style.display = 'block';
        card.style.animation = 'gameCardShow 0.5s ease forwards';
    }

    hideGameCard(card) {
        card.style.animation = 'gameCardHide 0.3s ease forwards';
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    }

    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    setupContactForm() {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(contactForm);
            });
        }
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const nameInput = form.querySelector('input[type="text"]');
        const emailInput = form.querySelector('input[type="email"]');
        const messageInput = form.querySelector('textarea');
        const selectInput = form.querySelector('select');

        if (!nameInput || !emailInput || !messageInput) {
            this.showNotification(
                this.currentLang === 'tr' 
                    ? 'Form elemanları bulunamadı!' 
                    : 'Form elements not found!',
                'error'
            );
            return;
        }

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        const service = selectInput ? selectInput.value : '';

        // Validation
        if (!name || !email || !message) {
            this.showNotification(
                this.currentLang === 'tr' 
                    ? 'Lütfen gerekli alanları doldurun!' 
                    : 'Please fill in the required fields!',
                'error'
            );
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showNotification(
                this.currentLang === 'tr' 
                    ? 'Geçerli bir e-posta adresi girin!' 
                    : 'Please enter a valid email address!',
                'error'
            );
            return;
        }

        // Service selection validation
        if (!service) {
            this.showNotification(
                this.currentLang === 'tr' 
                    ? 'Lütfen bir hizmet türü seçin!' 
                    : 'Please select a service type!',
                'error'
            );
            return;
        }

        // Success simulation
        this.showNotification(
            this.currentLang === 'tr' 
                ? 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.' 
                : 'Your message has been sent successfully! We will get back to you as soon as possible.',
            'success'
        );

        // Reset form with animation
        form.reset();
        this.animateFormReset(form);
    }

    animateFormReset(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach((input, index) => {
            setTimeout(() => {
                input.style.animation = 'inputReset 0.3s ease';
            }, index * 50);
        });
    }

    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Special animations for different elements
                    if (entry.target.classList.contains('game-card')) {
                        this.animateGameCard(entry.target);
                    } else if (entry.target.classList.contains('team-member')) {
                        this.animateTeamMember(entry.target);
                    } else if (entry.target.classList.contains('service-card')) {
                        this.animateServiceCard(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Observe elements
        const animatedElements = document.querySelectorAll(
            '.game-card, .team-member, .service-card, .achievement-card, .tech-item'
        );
        animatedElements.forEach(el => observer.observe(el));
    }

    animateGameCard(card) {
        const delay = Math.random() * 500;
        setTimeout(() => {
            card.style.animation = 'gameCardFloat 0.8s ease forwards';
        }, delay);
    }

    animateTeamMember(member) {
        const avatar = member.querySelector('.avatar-placeholder');
        const status = member.querySelector('.member-status');
        
        setTimeout(() => {
            if (avatar) avatar.style.animation = 'avatarPop 0.6s ease forwards';
            if (status) status.style.animation = 'statusBlink 0.4s ease forwards';
        }, 200);
    }

    animateServiceCard(card) {
        const icon = card.querySelector('.service-icon');
        setTimeout(() => {
            if (icon) icon.style.animation = 'serviceIconBounce 0.8s ease forwards';
        }, 100);
    }

    initTheme() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        document.body.classList.add('light-theme');
    }

    initLanguage() {
        // Language is already set via HTML attributes
    }

    initGameEffects() {
        // Start game-like animations
        this.startHealthBarAnimation();
        this.startParticleSystem();
        this.startCodeRain();
    }

    startHealthBarAnimation() {
        const healthFill = document.querySelector('.health-fill');
        if (healthFill) {
            setInterval(() => {
                const randomWidth = Math.random() * 20 + 70; // 70-90%
                healthFill.style.width = randomWidth + '%';
            }, 3000);
        }
    }

    startParticleSystem() {
        const gameParticles = document.querySelector('.game-particles');
        if (gameParticles) {
            setInterval(() => {
                this.createGameParticle(gameParticles);
            }, 2000);
        }
    }

    createGameParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: #${Math.floor(Math.random()*16777215).toString(16)};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleBurst 2s ease-out forwards;
            pointer-events: none;
        `;

        container.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 2000);
    }

    startCodeRain() {
        setInterval(() => {
            this.createFloatingCode();
        }, 5000);
    }

    createFloatingCode() {
        const heroSection = document.querySelector('.hero-bg-animation');
        if (!heroSection) return;

        const codeSnippets = [
            'class Game {}',
            'function update()',
            'render();',
            'new Player()',
            'this.score++',
            'gameLoop()',
            'async load()',
            'export default',
            'import Unity',
            'Vector3.up'
        ];

        const code = document.createElement('div');
        code.className = 'floating-code dynamic';
        code.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
        code.style.cssText = `
            position: absolute;
            font-family: 'Courier New', monospace;
            color: rgba(255, 255, 255, 0.1);
            font-size: 1.2rem;
            top: ${Math.random() * 100}%;
            left: -200px;
            animation: floatCodeDynamic 15s linear forwards;
            white-space: nowrap;
        `;

        heroSection.appendChild(code);

        setTimeout(() => {
            if (code.parentNode) {
                code.remove();
            }
        }, 15000);
    }

    setupGameEffects() {
        // Play button effects
        const playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.triggerGameEffect(btn);
            });
        });

        // Team member hover effects
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach(member => {
            member.addEventListener('mouseenter', () => {
                this.triggerTeamEffect(member);
            });
        });
    }

    triggerGameEffect(button) {
        // Create explosion effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createExplosionParticle(button);
            }, i * 50);
        }

        // Button animation
        button.style.animation = 'playButtonClick 0.6s ease forwards';

        // Show game preview
        this.showGamePreview(button.closest('.game-card'));
    }

    createExplosionParticle(button) {
        const particle = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const randomX = Math.random() * 200 - 100;
        const randomY = Math.random() * 200 - 100;
        
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: #${Math.floor(Math.random()*16777215).toString(16)};
            border-radius: 50%;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            pointer-events: none;
            z-index: 10000;
            transition: all 1s ease-out;
        `;

        document.body.appendChild(particle);

        // Animate with transform
        setTimeout(() => {
            particle.style.transform = `translate(${randomX}px, ${randomY}px) scale(0)`;
            particle.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 1000);
    }

    showGamePreview(gameCard) {
        const gameName = gameCard.querySelector('h4').textContent;
        this.showNotification(
            this.currentLang === 'tr' 
                ? `${gameName} oyunu başlatılıyor...` 
                : `Launching ${gameName}...`,
            'info'
        );
    }

    triggerTeamEffect(member) {
        const status = member.querySelector('.member-status');
        if (status && status.classList.contains('online')) {
            status.style.animation = 'statusNotification 2s ease';
        }

        // Show Discord info if available
        const discordBtn = member.querySelector('.contact-btn[data-discord]');
        if (discordBtn) {
            const discord = discordBtn.getAttribute('data-discord');
            this.showNotification(
                this.currentLang === 'tr' 
                    ? `Discord: ${discord}` 
                    : `Discord: ${discord}`,
                'info'
            );
        }
    }

    setupKonamiCode() {
        let konamiCode = [];
        const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            
            if (konamiCode.length > konamiSequence.length) {
                konamiCode.shift();
            }
            
            if (konamiCode.length === konamiSequence.length) {
                if (konamiCode.every((code, index) => code === konamiSequence[index])) {
                    this.activateKonamiEffect();
                }
            }
        });
    }

    activateKonamiEffect() {
        // Create game rain effect
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                this.createKonamiParticle();
            }, i * 100);
        }

        this.showNotification(
            this.currentLang === 'tr' 
                ? '🎮 Oyun modu aktif! Konami code başarılı! 🎮' 
                : '🎮 Game mode activated! Konami code successful! 🎮',
            'success'
        );

        // Change theme rapidly
        this.konamiThemeEffect();
    }

    createKonamiParticle() {
        const gameEmojis = ['🎮', '🕹️', '🎯', '🏆', '⚡', '🚀', '💫', '🎊'];
        const particle = document.createElement('div');
        
        particle.style.cssText = `
            position: fixed;
            top: -50px;
            left: ${Math.random() * 100}%;
            font-size: 2rem;
            z-index: 9999;
            pointer-events: none;
            animation: konamiRain 4s linear forwards;
        `;
        
        particle.textContent = gameEmojis[Math.floor(Math.random() * gameEmojis.length)];
        document.body.appendChild(particle);

        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 4000);
    }

    konamiThemeEffect() {
        let count = 0;
        const interval = setInterval(() => {
            this.toggleTheme();
            count++;
            if (count >= 6) {
                clearInterval(interval);
            }
        }, 500);
    }

    createThemeTransition() {
        const transition = document.createElement('div');
        transition.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${this.currentTheme === 'dark' ? 'black' : 'white'};
            z-index: 10000;
            pointer-events: none;
            animation: themeTransition 0.5s ease forwards;
        `;

        document.body.appendChild(transition);

        setTimeout(() => {
            if (transition.parentNode) {
                transition.remove();
            }
        }, 500);
    }

    onPageLoad() {
        // Add loading complete class
        document.body.classList.add('loaded');

        // Animate hero elements
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero-content, .hero-visual');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateX(0)';
                }, index * 300);
            });
        }, 500);

        // Type writer effect for hero title
        this.typeWriterEffect();

        // Start floating elements
        this.startFloatingElements();
    }

    typeWriterEffect() {
        const titleElement = document.querySelector('.title-text');
        if (!titleElement) return;
        
        const text = 'Patates Stüdyo';
        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        let i = 0;
        
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                titleElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
        
        // Fallback: restore original text if something goes wrong
        setTimeout(() => {
            if (titleElement.textContent === '') {
                titleElement.textContent = originalText;
            }
        }, 3000);
    }

    startFloatingElements() {
        const container = document.querySelector('.floating-elements');
        if (!container) return;

        setInterval(() => {
            if (document.querySelectorAll('.floating-element').length < 8) {
                this.createFloatingElement(container);
            }
        }, 4000);
    }

    createFloatingElement(container) {
        const elements = ['💻', '🎮', '🎯', '⚡', '🚀', '🔥', '💎', '🌟'];
        const element = document.createElement('div');
        
        element.className = 'floating-element dynamic';
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        element.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 1 + 1.5}rem;
            opacity: ${Math.random() * 0.1 + 0.05};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatElementDynamic ${Math.random() * 10 + 10}s linear infinite;
        `;

        container.appendChild(element);

        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
        }, 20000);
    }

    onResize() {
        // Handle responsive changes
        this.updateParallaxEffects(window.pageYOffset);
    }

    loadPreferences() {
        // Load saved theme
        const savedTheme = localStorage.getItem('gameStudioTheme');
        if (savedTheme && savedTheme !== this.currentTheme) {
            this.currentTheme = savedTheme === 'dark' ? 'light' : 'dark'; // Set opposite so toggle works correctly
            this.toggleTheme();
        }

        // Load saved language
        const savedLang = localStorage.getItem('gameStudioLang');
        if (savedLang && savedLang !== this.currentLang) {
            this.currentLang = savedLang === 'tr' ? 'en' : 'tr'; // Set opposite so toggle works correctly
            this.toggleLanguage();
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    type === 'info' ? 'fa-info-circle' : 'fa-bell';

        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${icon}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3',
            warning: '#ff9800'
        };

                 notification.style.cssText = `
             position: fixed;
             top: 100px;
             right: 20px;
             background: ${colors[type] || colors.info};
             color: white;
             padding: 1rem 1.5rem;
             border-radius: 15px;
             box-shadow: 0 15px 35px rgba(0,0,0,0.2);
             z-index: 99999;
             animation: notificationSlide 0.5s ease;
             max-width: 400px;
             font-family: 'Poppins', sans-serif;
             backdrop-filter: blur(10px);
             border: 2px solid rgba(255,255,255,0.1);
         `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'notificationSlideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        });
    }
}

// CSS Animations (injected dynamically)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes gameCardShow {
        from { opacity: 0; transform: translateY(20px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    @keyframes gameCardHide {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.8); }
    }
    
    @keyframes gameCardFloat {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes avatarPop {
        0% { transform: scale(0.8); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes statusBlink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
    
    @keyframes statusNotification {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.3); }
        75% { transform: scale(0.9); }
    }
    
    @keyframes serviceIconBounce {
        0%, 100% { transform: translateY(0); }
        25% { transform: translateY(-15px) rotate(10deg); }
        75% { transform: translateY(-5px) rotate(-5deg); }
    }
    
    @keyframes inputReset {
        from { background: rgba(76, 175, 80, 0.1); }
        to { background: transparent; }
    }
    
    @keyframes particleBurst {
        0% { 
            opacity: 1; 
            transform: scale(1) translateY(0);
        }
        100% { 
            opacity: 0; 
            transform: scale(0.3) translateY(-50px);
        }
    }
    
         @keyframes explode {
         0% { 
             transform: translate(0, 0) scale(1);
             opacity: 1;
         }
         100% { 
             transform: translate(100px, -100px) scale(0);
             opacity: 0;
         }
     }
    
    @keyframes playButtonClick {
        0% { transform: scale(1); }
        50% { transform: scale(1.2) rotate(360deg); }
        100% { transform: scale(1); }
    }
    
    @keyframes konamiRain {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes themeTransition {
        0% { opacity: 0; }
        50% { opacity: 0.8; }
        100% { opacity: 0; }
    }
    
    @keyframes notificationSlide {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes notificationSlideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes floatCodeDynamic {
        from {
            transform: translateX(0) rotate(0deg);
        }
        to {
            transform: translateX(calc(100vw + 300px)) rotate(360deg);
        }
    }
    
    @keyframes floatElementDynamic {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        50% {
            transform: translateY(-150px) rotate(180deg);
        }
        100% {
            transform: translateY(0) rotate(360deg);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: auto;
        transition: opacity 0.3s ease;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
    
    .animate-in {
        animation: fadeInUp 0.8s ease forwards;
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 80px;
            flex-direction: column;
            background-color: var(--bg-primary);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px var(--shadow-light);
            padding: 2rem 0;
            border-radius: 0 0 20px 20px;
            backdrop-filter: blur(15px);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-link {
            padding: 1rem 2rem;
            margin: 0.5rem 0;
            border-bottom: 1px solid var(--border-color);
            border-radius: 10px;
            transition: all 0.3s ease;
        }
        
        .nav-link:hover,
        .nav-link.active {
            background: var(--primary-color);
            color: white !important;
            transform: translateY(0);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    }
`;

document.head.appendChild(styleSheet);

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    window.gameStudio = new GameStudioWebsite();
});