document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeBtn = document.getElementById('themeToggleBtn');

    const setTheme = (theme) => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            if(themeBtn) {
                themeBtn.textContent = '🌙';
                themeBtn.setAttribute('title', 'Switch to light mode');
            }
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            if(themeBtn) {
                themeBtn.textContent = '☀️';
                themeBtn.setAttribute('title', 'Switch to dark mode');
            }
            localStorage.setItem('theme', 'light');
        }
    };

    // Init Theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            if (document.documentElement.classList.contains('dark')) {
                setTheme('light');
            } else {
                setTheme('dark');
            }
        });
    }

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
