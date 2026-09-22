document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
    }

    // Set Active Nav Link
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        if (item.getAttribute('href') && currentPath.includes(item.getAttribute('href').replace(/\.\.\//g, '').replace(/\.\//g, ''))) {
             if(item.getAttribute('href') !== '/' && item.getAttribute('href') !== './index.html') {
                 item.classList.add('active');
             } else if (currentPath === '/' || currentPath === '/index.html') {
                 if (item.getAttribute('href') === '/' || item.getAttribute('href') === './index.html') item.classList.add('active');
             }
        }
    });
});
