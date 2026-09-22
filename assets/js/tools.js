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

document.addEventListener('DOMContentLoaded', () => {

    // BASE64 ENCODER/DECODER
    const b64Input = document.getElementById('b64Input');
    if (b64Input) {
        window.DigitalUtils.recordToolUsage('base64', 'Base64 Encoder/Decoder', '/tools/developer/base64.html');
        const b64Output = document.getElementById('b64Output');

        document.getElementById('b64EncodeBtn')?.addEventListener('click', () => {
            try {
                b64Output.value = btoa(b64Input.value);
            } catch (e) {
                window.DigitalUtils.showToast('Invalid character for Base64 encoding', 'error');
            }
        });

        document.getElementById('b64DecodeBtn')?.addEventListener('click', () => {
            try {
                b64Output.value = atob(b64Input.value.trim());
            } catch (e) {
                window.DigitalUtils.showToast('Invalid Base64 string', 'error');
            }
        });

        document.getElementById('copyB64Btn')?.addEventListener('click', () => window.DigitalUtils.copyText(b64Output.value));
    }

    // URL ENCODER/DECODER
    const urlInput = document.getElementById('urlInput');
    if (urlInput) {
        window.DigitalUtils.recordToolUsage('url-encoder', 'URL Encoder/Decoder', '/tools/developer/url-encoder.html');
        const urlOutput = document.getElementById('urlOutput');

        document.getElementById('urlEncodeBtn')?.addEventListener('click', () => {
            urlOutput.value = encodeURIComponent(urlInput.value);
        });

        document.getElementById('urlDecodeBtn')?.addEventListener('click', () => {
            try {
                urlOutput.value = decodeURIComponent(urlInput.value);
            } catch (e) {
                window.DigitalUtils.showToast('Invalid URL encoded string', 'error');
            }
        });

        document.getElementById('copyUrlBtn')?.addEventListener('click', () => window.DigitalUtils.copyText(urlOutput.value));
    }

    // UUID GENERATOR
    const uuidOutput = document.getElementById('uuidOutput');
    if (uuidOutput) {
        window.DigitalUtils.recordToolUsage('uuid-generator', 'UUID Generator', '/tools/developer/uuid-generator.html');
        const generate = () => {
            if (crypto && crypto.randomUUID) {
                uuidOutput.value = crypto.randomUUID();
            } else {
                // Fallback
                uuidOutput.value = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            }
        };
        document.getElementById('generateUuidBtn')?.addEventListener('click', generate);
        document.getElementById('copyUuidBtn')?.addEventListener('click', () => window.DigitalUtils.copyText(uuidOutput.value));
        generate(); // initial
    }

    // TIMESTAMP CONVERTER
    const tsInput = document.getElementById('tsInput');
    if (tsInput) {
        window.DigitalUtils.recordToolUsage('timestamp-converter', 'Timestamp Converter', '/tools/developer/timestamp-converter.html');

        document.getElementById('tsConvertBtn')?.addEventListener('click', () => {
            const val = parseInt(tsInput.value);
            if (!isNaN(val)) {
                // Assume seconds if < 1e11, else assume milliseconds
                const ms = val < 100000000000 ? val * 1000 : val;
                const d = new Date(ms);
                document.getElementById('tsOutput').innerHTML = `
                    <strong>Local:</strong> ${d.toLocaleString()}<br>
                    <strong>UTC:</strong> ${d.toUTCString()}
                `;
            }
        });

        document.getElementById('dateConvertBtn')?.addEventListener('click', () => {
            const d = new Date(document.getElementById('dateInput').value);
            if (!isNaN(d.getTime())) {
                document.getElementById('dateOutput').innerHTML = `
                    <strong>Seconds:</strong> ${Math.floor(d.getTime() / 1000)}<br>
                    <strong>Milliseconds:</strong> ${d.getTime()}
                `;
            }
        });

        // Init with current time
        tsInput.value = Math.floor(Date.now() / 1000);
        document.getElementById('tsConvertBtn').click();
    }

    // RANDOM NUMBER GENERATOR
    const randOutput = document.getElementById('randOutput');
    if (randOutput) {
        window.DigitalUtils.recordToolUsage('random-number', 'Random Number Generator', '/tools/developer/random-number.html');
        document.getElementById('generateRandBtn')?.addEventListener('click', () => {
            const min = parseFloat(document.getElementById('randMin').value);
            const max = parseFloat(document.getElementById('randMax').value);
            const decimals = document.getElementById('randDecimals').checked;

            if (isNaN(min) || isNaN(max) || min >= max) {
                window.DigitalUtils.showToast('Invalid min/max values', 'error');
                return;
            }

            // We use standard Math.random for generic random number generation unless it's for crypto
            let result = Math.random() * (max - min) + min;

            if (!decimals) {
                result = Math.floor(result);
            } else {
                result = result.toFixed(4);
            }

            randOutput.textContent = result;
        });
    }

    // SECURE PASSWORD GENERATOR FIX (updating from previous Math.random)
    const pwdOutput = document.getElementById('passwordOutput');
    if (pwdOutput && !document.getElementById('generateRandBtn')) { // Avoid conflict if both scripts run
        // Handled in previous script, let's make sure it's secure
        const generatePassword = () => {
            const length = parseInt(document.getElementById('pwdLength').value);
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
                pwdOutput.value = 'Select options';
                return;
            }

            let pwd = '';
            const array = new Uint32Array(length);
            window.crypto.getRandomValues(array);
            for (let i = 0; i < length; i++) {
                pwd += charset[array[i] % charset.length];
            }
            pwdOutput.value = pwd;
        };
        const genBtn = document.getElementById('generateBtn');
        if (genBtn) {
            // Remove old listener if possible (though we just overwrite behavior)
            genBtn.addEventListener('click', generatePassword);
        }
    }
});
