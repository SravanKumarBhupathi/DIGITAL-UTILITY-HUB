document.addEventListener('DOMContentLoaded', () => {

    // WORD COUNTER
    const textInput = document.getElementById('textInput');
    if (textInput) {
        window.DigitalUtils.recordToolUsage('word-counter', 'Word Counter', '/tools/text/word-counter.html');
        const updateCounts = () => {
            const text = textInput.value;
            document.getElementById('charCount').textContent = text.length;
            document.getElementById('charNoSpaceCount').textContent = text.replace(/\s/g, '').length;

            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            document.getElementById('wordCount').textContent = words.length;

            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            document.getElementById('sentenceCount').textContent = sentences.length;

            const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
            document.getElementById('paragraphCount').textContent = text.length === 0 ? 0 : paragraphs.length;

            const minutes = Math.ceil(words.length / 225);
            document.getElementById('readTime').textContent = minutes + 'm';
        };

        textInput.addEventListener('input', updateCounts);
        document.getElementById('clearBtn')?.addEventListener('click', () => { textInput.value = ''; updateCounts(); });
        document.getElementById('copyBtn')?.addEventListener('click', () => window.DigitalUtils.copyText(textInput.value));
    }

    // CASE CONVERTER
    const caseInput = document.getElementById('caseInput');
    if (caseInput) {
        window.DigitalUtils.recordToolUsage('case-converter', 'Case Converter', '/tools/text/case-converter.html');
        const buttons = document.querySelectorAll('.case-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                let text = caseInput.value;
                if (!text) return;

                switch(action) {
                    case 'upper': text = text.toUpperCase(); break;
                    case 'lower': text = text.toLowerCase(); break;
                    case 'title':
                        text = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        break;
                    case 'sentence':
                        text = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                        break;
                    case 'camel':
                        text = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                        break;
                    case 'snake':
                        text = text.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
                        break;
                    case 'kebab':
                        text = text.trim().toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
                        break;
                }
                caseInput.value = text;
            });
        });
        document.getElementById('clearCaseBtn')?.addEventListener('click', () => caseInput.value = '');
        document.getElementById('copyCaseBtn')?.addEventListener('click', () => window.DigitalUtils.copyText(caseInput.value));
    }

    // REMOVE DUPLICATES
    const dupInput = document.getElementById('dupInput');
    if (dupInput) {
        window.DigitalUtils.recordToolUsage('remove-duplicates', 'Remove Duplicate Lines', '/tools/text/remove-duplicates.html');
        document.getElementById('removeDupBtn')?.addEventListener('click', () => {
            if (!dupInput.value) return;
            const isCaseSensitive = document.getElementById('dupCaseSensitive').checked;
            const doTrim = document.getElementById('dupTrim').checked;

            let lines = dupInput.value.split('\n');
            let initialCount = lines.length;

            let seen = new Set();
            let result = [];

            for (let line of lines) {
                let processedLine = doTrim ? line.trim() : line;
                let key = isCaseSensitive ? processedLine : processedLine.toLowerCase();

                if (!seen.has(key)) {
                    seen.add(key);
                    result.push(processedLine);
                }
            }

            dupInput.value = result.join('\n');
            const removed = initialCount - result.length;

            const stats = document.getElementById('dupStats');
            document.getElementById('dupCount').textContent = removed;
            stats.classList.remove('hidden');
        });

        document.getElementById('clearDupBtn')?.addEventListener('click', () => {
            dupInput.value = '';
            document.getElementById('dupStats').classList.add('hidden');
        });
        document.getElementById('copyDupBtn')?.addEventListener('click', () => window.DigitalUtils.copyText(dupInput.value));
    }

    // SLUG GENERATOR
    const slugInput = document.getElementById('slugInput');
    if (slugInput) {
        window.DigitalUtils.recordToolUsage('slug-generator', 'Slug Generator', '/tools/text/slug-generator.html');
        const slugOutput = document.getElementById('slugOutput');

        slugInput.addEventListener('input', () => {
            const text = slugInput.value;
            const slug = text.toLowerCase()
                             .trim()
                             .replace(/[^\w\s-]/g, '')
                             .replace(/[\s_-]+/g, '-')
                             .replace(/^-+|-+$/g, '');
            slugOutput.value = slug;
        });

        document.getElementById('copySlugBtn')?.addEventListener('click', () => window.DigitalUtils.copyText(slugOutput.value));
    }

    // TEXT CLEANER
    const cleanerInput = document.getElementById('cleanerInput');
    if (cleanerInput) {
        window.DigitalUtils.recordToolUsage('text-cleaner', 'Text Cleaner', '/tools/text/text-cleaner.html');
        document.getElementById('cleanTextBtn')?.addEventListener('click', () => {
            let text = cleanerInput.value;
            if (!text) return;

            if (document.getElementById('cleanHtmlTags').checked) {
                const doc = new DOMParser().parseFromString(text, 'text/html');
                text = doc.body.textContent || "";
            }
            if (document.getElementById('cleanTrimLines').checked) {
                text = text.split('\n').map(l => l.trim()).join('\n');
            }
            if (document.getElementById('cleanExtraSpaces').checked) {
                text = text.replace(/[ \t]{2,}/g, ' ');
            }
            if (document.getElementById('cleanBlankLines').checked) {
                text = text.replace(/\n\s*\n/g, '\n');
            }

            cleanerInput.value = text;
        });
        document.getElementById('clearCleanerBtn')?.addEventListener('click', () => cleanerInput.value = '');
        document.getElementById('copyCleanerBtn')?.addEventListener('click', () => window.DigitalUtils.copyText(cleanerInput.value));
    }

    // Initialize Favorite Buttons on pages
    const favBtns = document.querySelectorAll('[id^="favBtn_"]');
    favBtns.forEach(btn => {
        const id = btn.id.split('_')[1];
        if (window.DigitalUtils.isFavorite(id)) {
            btn.classList.add('active');
            btn.innerHTML = '★ Favorited';
        }
        btn.addEventListener('click', () => {
            const title = document.querySelector('h1').textContent;
            const url = window.location.pathname;
            const added = window.DigitalUtils.toggleFavorite(id, title, url, '⭐');
            if (added) {
                btn.classList.add('active');
                btn.innerHTML = '★ Favorited';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '☆ Favorite';
            }
        });
    });
});
