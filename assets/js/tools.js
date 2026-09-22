document.addEventListener('DOMContentLoaded', () => {
    // WORD COUNTER
    const textInput = document.getElementById('textInput');
    if (textInput) {
        const wordCount = document.getElementById('wordCount');
        const charCount = document.getElementById('charCount');
        const charNoSpaceCount = document.getElementById('charNoSpaceCount');
        const sentenceCount = document.getElementById('sentenceCount');

        const updateCounts = () => {
            const text = textInput.value;
            charCount.textContent = text.length;
            charNoSpaceCount.textContent = text.replace(/\s/g, '').length;

            const words = text.trim().split(/\s+/).filter(w => w.length > 0);
            wordCount.textContent = words.length;

            const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
            sentenceCount.textContent = sentences.length;
        };

        textInput.addEventListener('input', updateCounts);

        document.getElementById('clearBtn')?.addEventListener('click', () => {
            textInput.value = '';
            updateCounts();
        });

        document.getElementById('copyBtn')?.addEventListener('click', () => {
            navigator.clipboard.writeText(textInput.value).then(() => alert('Copied!'));
        });
    }

    // JSON FORMATTER
    const jsonInput = document.getElementById('jsonInput');
    if (jsonInput) {
        const errorAlert = document.getElementById('jsonError');
        const successAlert = document.getElementById('jsonSuccess');

        const processJson = (minify = false) => {
            errorAlert.classList.remove('show');
            successAlert.classList.remove('show');
            try {
                if(!jsonInput.value.trim()) return;
                const parsed = JSON.parse(jsonInput.value);
                jsonInput.value = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 4);
                successAlert.classList.add('show');
            } catch (e) {
                errorAlert.textContent = 'Invalid JSON: ' + e.message;
                errorAlert.classList.add('show');
            }
        };

        document.getElementById('formatBtn')?.addEventListener('click', () => processJson(false));
        document.getElementById('minifyBtn')?.addEventListener('click', () => processJson(true));
        document.getElementById('clearJsonBtn')?.addEventListener('click', () => {
            jsonInput.value = '';
            errorAlert.classList.remove('show');
            successAlert.classList.remove('show');
        });
        document.getElementById('copyJsonBtn')?.addEventListener('click', () => {
            navigator.clipboard.writeText(jsonInput.value).then(() => alert('Copied!'));
        });
    }

    // PASSWORD GENERATOR
    const pwdOutput = document.getElementById('passwordOutput');
    if (pwdOutput) {
        const lengthSlider = document.getElementById('pwdLength');
        const lengthVal = document.getElementById('lengthVal');

        lengthSlider.addEventListener('input', (e) => {
            lengthVal.textContent = e.target.value;
        });

        const generatePassword = () => {
            const length = parseInt(lengthSlider.value);
            const upper = document.getElementById('incUpper').checked;
            const lower = document.getElementById('incLower').checked;
            const num = document.getElementById('incNum').checked;
            const sym = document.getElementById('incSym').checked;

            let charset = '';
            if (upper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (lower) charset += 'abcdefghijklmnopqrstuvwxyz';
            if (num) charset += '0123456789';
            if (sym) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

            if (charset === '') {
                pwdOutput.value = 'Select at least one option';
                return;
            }

            let pwd = '';
            for (let i = 0; i < length; i++) {
                pwd += charset.charAt(Math.floor(window.crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * charset.length));
            }
            pwdOutput.value = pwd;
        };

        document.getElementById('generateBtn')?.addEventListener('click', generatePassword);
        document.getElementById('copyPwdBtn')?.addEventListener('click', () => {
            navigator.clipboard.writeText(pwdOutput.value).then(() => alert('Copied!'));
        });

        generatePassword(); // initial run
    }
});
