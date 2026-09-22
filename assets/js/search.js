const searchIndex = [
    { title: "Word Counter", url: "/tools/text/word-counter.html", category: "Text Tools", desc: "Instantly count words, characters, and sentences." },
    { title: "Case Converter", url: "/tools/text/case-converter.html", category: "Text Tools", desc: "Convert text to uppercase, lowercase, title case, etc." },
    { title: "Remove Duplicate Lines", url: "/tools/text/remove-duplicates.html", category: "Text Tools", desc: "Remove duplicate lines from text." },
    { title: "Text Cleaner", url: "/tools/text/text-cleaner.html", category: "Text Tools", desc: "Remove extra spaces and blank lines." },
    { title: "Slug Generator", url: "/tools/text/slug-generator.html", category: "Text Tools", desc: "Convert text into URL-friendly slugs." },

    { title: "JSON Formatter", url: "/tools/developer/json-formatter.html", category: "Developer Tools", desc: "Format, validate and beautify JSON data." },
    { title: "Base64 Encoder/Decoder", url: "/tools/developer/base64.html", category: "Developer Tools", desc: "Encode and decode Base64 strings." },
    { title: "URL Encoder/Decoder", url: "/tools/developer/url-encoder.html", category: "Developer Tools", desc: "Safely encode and decode URLs." },
    { title: "UUID Generator", url: "/tools/developer/uuid-generator.html", category: "Developer Tools", desc: "Generate secure random UUIDs." },
    { title: "Timestamp Converter", url: "/tools/developer/timestamp-converter.html", category: "Developer Tools", desc: "Convert Unix timestamps to dates." },

    { title: "Password Generator", url: "/tools/developer/password-generator.html", category: "Utility", desc: "Generate strong, secure passwords." },
    { title: "Random Number Generator", url: "/tools/developer/random-number.html", category: "Utility", desc: "Generate random numbers within a range." },

    { title: "Image Compressor", url: "/tools/image/compressor.html", category: "Image Tools", desc: "Compress images locally." },
    { title: "Image Resizer", url: "/tools/image/resizer.html", category: "Image Tools", desc: "Resize images to custom dimensions." },
    { title: "Image Cropper", url: "/tools/image/cropper.html", category: "Image Tools", desc: "Crop images easily." },
    { title: "JPG to PNG", url: "/tools/image/jpg-to-png.html", category: "Image Tools", desc: "Convert JPG to PNG." },
    { title: "PNG to JPG", url: "/tools/image/png-to-jpg.html", category: "Image Tools", desc: "Convert PNG to JPG." },
    { title: "WebP to JPG", url: "/tools/image/webp-to-jpg.html", category: "Image Tools", desc: "Convert WebP to JPG." },

    { title: "PDF Merge", url: "/tools/pdf/merge.html", category: "PDF Tools", desc: "Merge multiple PDFs into one." },
    { title: "PDF Split", url: "/tools/pdf/split.html", category: "PDF Tools", desc: "Split a PDF into multiple files." },
    { title: "PDF Extract", url: "/tools/pdf/extract.html", category: "PDF Tools", desc: "Extract specific pages from a PDF." },
    { title: "PDF Delete Pages", url: "/tools/pdf/delete.html", category: "PDF Tools", desc: "Delete pages from a PDF." },
    { title: "PDF Rotate", url: "/tools/pdf/rotate.html", category: "PDF Tools", desc: "Rotate PDF pages." },

    { title: "EMI Calculator", url: "/calculators/finance/emi-calculator.html", category: "Calculators", desc: "Calculate your Equated Monthly Installment for loans." },
    { title: "Age Calculator", url: "/calculators/everyday/age-calculator.html", category: "Calculators", desc: "Calculate your exact age in years, months, and days." }
];

document.addEventListener('DOMContentLoaded', () => {
    const getBaseUrl = () => {
        const depth = window.location.pathname.split('/').length - 2;
        if (depth <= 0) return '.';
        return Array(depth).fill('..').join('/');
    };
    const baseUrl = getBaseUrl();

    // Desktop Search
    const desktopOverlay = document.createElement('div');
    desktopOverlay.style.cssText = 'display: none; position: absolute; top: 100%; left: 0; right: 0; background: var(--surface-color); backdrop-filter: blur(12px); box-shadow: var(--glass-shadow); border: 1px solid var(--border-light); border-radius: 8px; z-index: 1000; max-height: 400px; overflow-y: auto;';

    const renderResults = (query, container) => {
        container.innerHTML = '';
        if (query.length < 2) {
            container.style.display = container.id === 'mobileSearchResults' ? 'block' : 'none';
            if (container.id === 'mobileSearchResults') {
                container.innerHTML = '<div class="text-center text-muted" style="margin-top:2rem;">Type to search</div>';
            }
            return;
        }

        const results = searchIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query) ||
            (item.desc && item.desc.toLowerCase().includes(query))
        );

        if (results.length > 0) {
            results.forEach(item => {
                const a = document.createElement('a');
                a.href = baseUrl + item.url;
                a.style.cssText = 'display: block; padding: 1rem; border-bottom: 1px solid var(--border-light); text-decoration: none; color: inherit;';
                a.innerHTML = `<div style="font-weight: 600; color: var(--primary-accent);">${item.title}</div>
                                 <div style="font-size: 0.8rem; color: var(--text-muted);">${item.category}</div>`;
                a.addEventListener('mouseenter', () => a.style.backgroundColor = 'var(--primary-accent-soft)');
                a.addEventListener('mouseleave', () => a.style.backgroundColor = 'transparent');
                container.appendChild(a);
            });
        } else {
            container.innerHTML = '<div style="padding: 1rem; color: var(--text-muted); text-align: center;">No results found</div>';
        }
        if (container !== document.getElementById('mobileSearchResults')) {
            container.style.display = 'block';
        }
    };

    const desktopSearchInputs = document.querySelectorAll('.search-bar input[type="search"]');
    desktopSearchInputs.forEach(input => {
        const container = input.parentElement;
        if(container && !container.classList.contains('mobile-search-header')) {
            container.appendChild(desktopOverlay);
            input.addEventListener('input', (e) => renderResults(e.target.value.toLowerCase().trim(), desktopOverlay));
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) desktopOverlay.style.display = 'none';
            });
        }
    });

    // Mobile Search Overlay Logic
    const mobileSearchTrigger = document.querySelector('.mobile-search-trigger');
    const mobileSearchOverlay = document.getElementById('mobileSearchOverlay');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchClose = document.querySelector('.mobile-search-close');
    const mobileSearchResults = document.getElementById('mobileSearchResults');

    // Wire up hero search on mobile to open overlay
    const heroSearch = document.querySelector('.hero input[type="search"]');
    if (heroSearch) {
        heroSearch.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {
                heroSearch.blur();
                mobileSearchOverlay.classList.add('active');
                setTimeout(() => mobileSearchInput.focus(), 100);
            }
        });

        // Also handle desktop hero search
        const heroContainer = heroSearch.parentElement;
        if (heroContainer) {
            const localOverlay = desktopOverlay.cloneNode();
            heroContainer.appendChild(localOverlay);
            heroSearch.addEventListener('input', (e) => {
                if (window.innerWidth > 768) renderResults(e.target.value.toLowerCase().trim(), localOverlay);
            });
            document.addEventListener('click', (e) => {
                if (!heroContainer.contains(e.target)) localOverlay.style.display = 'none';
            });
        }
    }

    if (mobileSearchTrigger && mobileSearchOverlay) {
        mobileSearchTrigger.addEventListener('click', () => {
            mobileSearchOverlay.classList.add('active');
            setTimeout(() => mobileSearchInput.focus(), 100);
        });

        mobileSearchClose.addEventListener('click', () => {
            mobileSearchOverlay.classList.remove('active');
            mobileSearchInput.value = '';
            mobileSearchResults.innerHTML = '<div class="text-center text-muted" style="margin-top:2rem;">Type to search</div>';
        });

        mobileSearchInput.addEventListener('input', (e) => {
            renderResults(e.target.value.toLowerCase().trim(), mobileSearchResults);
        });
    }
});
