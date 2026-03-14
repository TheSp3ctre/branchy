document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.docs-sidebar a');
    const sections = document.querySelectorAll('.docs-section');

    // Handle clicks on documentation sidebar
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active classes
            navLinks.forEach(item => item.classList.remove('active'));
            sections.forEach(item => item.classList.remove('active'));

            // Add active class to current link
            link.classList.add('active');

            // Show corresponding section
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Smooth scroll for hero buttons and navbar
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not(.docs-sidebar a)');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-card, .feature-card, .cause-item').forEach(el => {
        observer.observe(el);
    });
});
