const searchIndex = [
    { title: "Word Counter", url: "/tools/text/word-counter.html", category: "Tools", desc: "Instantly count words, characters, and sentences." },
    { title: "JSON Formatter", url: "/tools/developer/json-formatter.html", category: "Tools", desc: "Format, validate and beautify JSON data." },
    { title: "Password Generator", url: "/tools/developer/password-generator.html", category: "Tools", desc: "Generate strong, secure passwords." },
    { title: "EMI Calculator", url: "/calculators/finance/emi-calculator.html", category: "Calculators", desc: "Calculate your Equated Monthly Installment for loans." },
    { title: "Age Calculator", url: "/calculators/everyday/age-calculator.html", category: "Calculators", desc: "Calculate your exact age in years, months, and days." }
];

document.addEventListener('DOMContentLoaded', () => {
    // Add simple overlay for search results
    const overlay = document.createElement('div');
    overlay.id = 'searchResultsOverlay';
    overlay.style.cssText = 'display: none; position: absolute; top: 100%; left: 0; right: 0; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 8px; z-index: 1000; max-height: 400px; overflow-y: auto;';

    const searchInputs = document.querySelectorAll('input[type="search"]');

    // Determine base URL dynamically based on depth or just use absolute if on root domain
    const getBaseUrl = () => {
        const depth = window.location.pathname.split('/').length - 2;
        if (depth <= 0) return '.';
        return Array(depth).fill('..').join('/');
    };
    const baseUrl = getBaseUrl();

    searchInputs.forEach(input => {
        // Find container to append overlay
        const container = input.parentElement;
        if(container) {
            container.style.position = 'relative';
            const localOverlay = overlay.cloneNode(true);
            container.appendChild(localOverlay);

            input.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                localOverlay.innerHTML = '';

                if (query.length < 2) {
                    localOverlay.style.display = 'none';
                    return;
                }

                const results = searchIndex.filter(item =>
                    item.title.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query) ||
                    (item.desc && item.desc.toLowerCase().includes(query))
                );

                if (results.length > 0) {
                    results.forEach(item => {
                        const div = document.createElement('a');
                        div.href = baseUrl + item.url;
                        div.style.cssText = 'display: block; padding: 1rem; border-bottom: 1px solid #eee; text-decoration: none; color: inherit;';
                        div.innerHTML = `<div style="font-weight: 600; color: var(--primary-accent);">${item.title}</div>
                                         <div style="font-size: 0.8rem; color: #666;">${item.category}</div>`;

                        // Add hover effect
                        div.addEventListener('mouseenter', () => div.style.backgroundColor = '#f8f9fa');
                        div.addEventListener('mouseleave', () => div.style.backgroundColor = 'transparent');

                        localOverlay.appendChild(div);
                    });
                } else {
                    const div = document.createElement('div');
                    div.style.cssText = 'padding: 1rem; color: #666; text-align: center;';
                    div.textContent = 'No results found';
                    localOverlay.appendChild(div);
                }
                localOverlay.style.display = 'block';
            });

            // Hide when clicking outside
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    localOverlay.style.display = 'none';
                }
            });
        }
    });
});
