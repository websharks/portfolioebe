/*===== MOBILE MENU TOGGLE =====*/
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const statNumbers = document.querySelectorAll('.stat__number');
const buttonLinks = document.querySelectorAll('.button, .social-link, .social__icon, .nav__logo');
const animatedCards = document.querySelectorAll('.skill-card, .expertise__item, .expertise-card, .work__card, .timeline__card, .timeline__entry, .education__card, .contact__info-box, .contact__form, .about__intro-block');
const heroRoles = document.getElementById('hero-roles');
const contactForm = document.getElementById('contactForm');

document.documentElement.style.scrollBehavior = 'smooth';

document.body.classList.add('page-ready');

// Toggle menu
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
}

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});

buttonLinks.forEach(el => {
    el.addEventListener('click', event => {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = el.getBoundingClientRect();
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
    });
});

if (heroRoles) {
    const roles = [
        'Full Stack App Developer',
        'VAPT Tester',
        'Software Engineer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer;

    const typeRole = () => {
        const current = roles[roleIndex];
        const displayed = current.slice(0, charIndex);
        heroRoles.textContent = displayed;

        if (!deleting && charIndex < current.length) {
            charIndex += 1;
            timer = setTimeout(typeRole, 80);
            return;
        }

        if (!deleting && charIndex === current.length) {
            deleting = true;
            timer = setTimeout(typeRole, 1200);
            return;
        }

        if (deleting && charIndex > 0) {
            charIndex -= 1;
            timer = setTimeout(typeRole, 45);
            return;
        }

        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timer = setTimeout(typeRole, 180);
    };

    typeRole();
    window.addEventListener('beforeunload', () => clearTimeout(timer));
}

if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();

        const name = document.getElementById('contactName')?.value.trim();
        const email = document.getElementById('contactEmail')?.value.trim();
        const message = document.getElementById('contactMessage')?.value.trim();

        if (!name || !email || !message) return;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) return;

        const whatsappNumber = '919843058417';
        const text = [
            "Hi! I'm interested in your services.",
            '',
            `Name: ${name}`,
            `Email: ${email}`,
            `Message: ${message}`
        ].join('\n');

        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
        window.location.assign(whatsappUrl);
        contactForm.reset();
    });
}

/*===== ACTIVE LINK ON SCROLL =====*/
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    if (!current) {
        current = 'home';
    }

    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active-link');
        }
    });
});

const animateCounter = (el, target) => {
    const duration = 1600;
    const start = 0;
    const startTime = performance.now();

    const tick = now => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.round(start + (target - start) * (1 - Math.pow(1 - progress, 3)));
        el.textContent = `${value}+`;
        if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.classList.contains('stat__number') && !entry.target.dataset.counted) {
            const target = parseInt(entry.target.textContent, 10);
            if (!Number.isNaN(target)) {
                entry.target.dataset.counted = 'true';
                animateCounter(entry.target, target);
            }
        }
    });
}, { threshold: 0.2 });

animatedCards.forEach(el => observer.observe(el));
statNumbers.forEach(el => observer.observe(el));

/*===== SCROLL REVEAL ANIMATION =====*/
if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
        origin: 'bottom',
        distance: '60px',
        duration: 2000,
        delay: 200,
        reset: false
    });

    // Reveal elements
    sr.reveal('.hero__text', { origin: 'left', delay: 100 });
    sr.reveal('.hero__image', { origin: 'right', delay: 100 });
    sr.reveal('.section__header', {});
    sr.reveal('.about__intro-block', { origin: 'bottom', distance: '30px', delay: 100 });
    sr.reveal('.expertise__grid--premium .expertise-card', { interval: 120 });
    sr.reveal('.timeline__entry', { interval: 120, origin: 'bottom', distance: '30px' });
    sr.reveal('.experience__section', { origin: 'bottom', distance: '40px', delay: 150 });
    sr.reveal('.timeline__card', { interval: 120, origin: 'bottom', distance: '30px' });
    sr.reveal('.education__card', { origin: 'bottom', distance: '40px', delay: 150 });
    sr.reveal('.expertise__container .skill-card', { interval: 100 });
    sr.reveal('.work__grid .work__card', { interval: 100 });
    sr.reveal('.contact__content', { interval: 200 });
}
 
