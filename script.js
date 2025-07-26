// Patates Studio Website
class PatatesStudio {
    constructor() {
        this.currentTheme = 'light';
        this.currentLang = 'tr';
        this.init();
    }

    init() {
        this.loadPreferences();
        this.setupEventListeners();
        this.initAnimations();
        this.startAnimations();
    }

    loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('patates-theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.documentElement.setAttribute('data-theme', savedTheme);
        }

        // Load language preference
        const savedLang = localStorage.getItem('patates-lang');
        if (savedLang) {
            this.currentLang = savedLang;
            this.updateLanguage();
        }
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

        // Navigation
        this.setupNavigation();

        // Project filters
        this.setupProjectFilters();

        // Contact form
        this.setupContactForm();

        // Scroll effects
        window.addEventListener('scroll', () => this.handleScroll());

        // Mobile menu
        this.setupMobileMenu();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('patates-theme', this.currentTheme);

        // Update icon
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }

        this.showNotification(
            this.currentLang === 'tr' 
                ? `${this.currentTheme === 'dark' ? 'Karanlık' : 'Aydınlık'} tema aktif!` 
                : `${this.currentTheme === 'dark' ? 'Dark' : 'Light'} theme activated!`
        );
    }

    toggleLanguage() {
        this.currentLang = this.currentLang === 'tr' ? 'en' : 'tr';
        localStorage.setItem('patates-lang', this.currentLang);
        this.updateLanguage();

        // Update flag
        const flag = document.querySelector('#langToggle .flag');
        if (flag) {
            flag.textContent = this.currentLang === 'tr' ? '🇹🇷' : '🇺🇸';
        }

        this.showNotification(
            this.currentLang === 'tr' ? 'Dil değiştirildi!' : 'Language changed!'
        );
    }

    updateLanguage() {
        const translations = {
            tr: {
                // Navigation
                'Ana Sayfa': 'Ana Sayfa',
                'Hakkımızda': 'Hakkımızda',
                'Hizmetler': 'Hizmetler',
                'Projeler': 'Projeler',
                'Ekip': 'Ekip',
                'İletişim': 'İletişim',
                
                // Hero
                'Oyun Geliştirmede Yenilik': 'Oyun Geliştirmede Yenilik',
                'Hayallerinizi Oyuna Dönüştürüyoruz': 'Hayallerinizi Oyuna Dönüştürüyoruz',
                'Modern teknolojiler kullanarak mobil, PC ve konsol platformları için yüksek kaliteli oyunlar geliştiriyoruz. Yaratıcılığınızı dijital dünyaya taşıyın.': 'Modern teknolojiler kullanarak mobil, PC ve konsol platformları için yüksek kaliteli oyunlar geliştiriyoruz. Yaratıcılığınızı dijital dünyaya taşıyın.',
                'Projeni Başlat': 'Projeni Başlat',
                'Nasıl Çalışıyoruz': 'Nasıl Çalışıyoruz',
                
                // Stats
                'Tamamlanan Proje': 'Tamamlanan Proje',
                'Aktif Oyuncu': 'Aktif Oyuncu',
                'Yıl Deneyim': 'Yıl Deneyim',
                
                // About
                'Hakkımızda': 'Hakkımızda',
                'Oyun Geliştirmede Uzman Ekip': 'Oyun Geliştirmede Uzman Ekip',
                'Modern teknolojiler ve yaratıcı yaklaşımlarla oyun dünyasında fark yaratıyoruz.': 'Modern teknolojiler ve yaratıcı yaklaşımlarla oyun dünyasında fark yaratıyoruz.',
                
                // Contact
                'Hayalinizdeki Oyunu Birlikte Yapalım': 'Hayalinizdeki Oyunu Birlikte Yapalım',
                'Mesaj Gönder': 'Mesaj Gönder'
            },
            en: {
                // Navigation
                'Ana Sayfa': 'Home',
                'Hakkımızda': 'About',
                'Hizmetler': 'Services',
                'Projeler': 'Projects',
                'Ekip': 'Team',
                'İletişim': 'Contact',
                
                // Hero
                'Oyun Geliştirmede Yenilik': 'Innovation in Game Development',
                'Hayallerinizi Oyuna Dönüştürüyoruz': 'Turning Your Dreams Into Games',
                'Modern teknolojiler kullanarak mobil, PC ve konsol platformları için yüksek kaliteli oyunlar geliştiriyoruz. Yaratıcılığınızı dijital dünyaya taşıyın.': 'We develop high-quality games for mobile, PC and console platforms using modern technologies. Bring your creativity to the digital world.',
                'Projeni Başlat': 'Start Your Project',
                'Nasıl Çalışıyoruz': 'How We Work',
                
                // Stats
                'Tamamlanan Proje': 'Completed Projects',
                'Aktif Oyuncu': 'Active Players',
                'Yıl Deneyim': 'Years Experience',
                
                // About
                'Hakkımızda': 'About Us',
                'Oyun Geliştirmede Uzman Ekip': 'Expert Team in Game Development',
                'Modern teknolojiler ve yaratıcı yaklaşımlarla oyun dünyasında fark yaratıyoruz.': 'We make a difference in the gaming world with modern technologies and creative approaches.',
                
                // Contact
                'Hayalinizdeki Oyunu Birlikte Yapalım': 'Let\'s Build Your Dream Game Together',
                'Mesaj Gönder': 'Send Message'
            }
        };

        const currentTranslations = translations[this.currentLang];
        
        // Update all translatable text
        Object.keys(currentTranslations).forEach(key => {
            const elements = document.querySelectorAll(`[data-text="${key}"]`);
            elements.forEach(element => {
                element.textContent = currentTranslations[key];
            });
        });
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Update active nav link on scroll
        this.updateActiveNavLink();
    }

    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (toggle && navLinks) {
            toggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                toggle.classList.toggle('active');
            });

            // Close menu when clicking nav links
            const links = navLinks.querySelectorAll('.nav-link');
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    toggle.classList.remove('active');
                });
            });
        }
    }

    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    setupContactForm() {
        const form = document.querySelector('.contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const project = formData.get('project');
            const message = formData.get('message');

            // Basic validation
            if (!name || !email || !project || !message) {
                this.showNotification(
                    this.currentLang === 'tr' 
                        ? 'Lütfen tüm alanları doldurun!' 
                        : 'Please fill all fields!',
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

            // Simulate form submission
            this.showNotification(
                this.currentLang === 'tr' 
                    ? 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.' 
                    : 'Your message has been sent successfully! We will get back to you as soon as possible.',
                'success'
            );

            // Reset form
            form.reset();
        });
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        
        // Navbar background effect
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrolled > 100) {
                navbar.style.background = this.currentTheme === 'dark' 
                    ? 'rgba(17, 24, 39, 0.95)' 
                    : 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = this.currentTheme === 'dark' 
                    ? 'rgba(17, 24, 39, 0.8)' 
                    : 'rgba(255, 255, 255, 0.8)';
                navbar.style.backdropFilter = 'blur(12px)';
            }
        }

        // Update active nav link
        this.updateActiveNavLink();

        // Parallax effect for floating cards
        this.updateParallaxEffect(scrolled);
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    updateParallaxEffect(scrolled) {
        const floatingCards = document.querySelectorAll('.floating-card');
        floatingCards.forEach((card, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            card.style.transform = `translateY(${yPos}px)`;
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
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatedElements = document.querySelectorAll(
            '.service-card, .project-card, .team-member, .feature-item, .tech-item'
        );
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    startAnimations() {
        // Start number counter animation for stats
        this.animateCounters();
        
        // Start chart animation
        this.animateCharts();
        
        // Start floating elements
        this.startFloatingAnimation();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const suffix = counter.textContent.replace(/\d/g, '');
            let current = 0;
            const increment = target / 100;
            const duration = 2000;
            const stepTime = duration / 100;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, stepTime);
        });
    }

    animateCharts() {
        const chartBars = document.querySelectorAll('.chart-bar');
        chartBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'scaleY(1)';
            }, index * 200);
        });
    }

    startFloatingAnimation() {
        // Add subtle floating animation to cards
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.5}s`;
        });
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: '9999',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        return colors[type] || colors.info;
    }
}

// Add custom CSS for animations
const style = document.createElement('style');
style.textContent = `
    /* Scroll animations */
    .service-card,
    .project-card,
    .team-member,
    .feature-item,
    .tech-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }

    .service-card.animate-in,
    .project-card.animate-in,
    .team-member.animate-in,
    .feature-item.animate-in,
    .tech-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Chart bars initial state */
    .chart-bar {
        opacity: 0;
        transform: scaleY(0);
        transform-origin: bottom;
        transition: all 0.5s ease;
    }

    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-links {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            background: var(--bg-primary);
            border: 1px solid var(--border);
            border-radius: 0 0 1rem 1rem;
            box-shadow: var(--shadow-lg);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 2rem;
            gap: 1rem;
            transition: left 0.3s ease;
            z-index: 40;
        }

        .nav-links.active {
            left: 0;
        }

        .nav-link {
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            background: var(--bg-secondary);
            text-align: center;
        }

        .nav-link:hover,
        .nav-link.active {
            background: var(--primary);
            color: white;
            transform: translateY(0);
        }

        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }

    /* Notification content styles */
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .notification-content i {
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    /* Smooth scrolling */
    html {
        scroll-behavior: smooth;
    }

    /* Loading state */
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    body.loaded {
        opacity: 1;
    }
`;

document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body
    document.body.classList.add('loaded');
    
    // Initialize the website
    window.patatesStudio = new PatatesStudio();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('loaded');
        window.patatesStudio = new PatatesStudio();
    });
} else {
    document.body.classList.add('loaded');
    window.patatesStudio = new PatatesStudio();
}