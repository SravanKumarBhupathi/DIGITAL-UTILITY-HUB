document.addEventListener('DOMContentLoaded', () => {
    // IMAGE COMPRESSOR
    const dropArea = document.getElementById('imgDropArea');
    const fileInput = document.getElementById('imgInput');
    const workspace = document.getElementById('imgWorkspace');

    if (dropArea && fileInput) {
        window.DigitalUtils.recordToolUsage('image-compressor', 'Image Compressor', '/tools/image/compressor.html');

        let currentFile = null;
        let originalDataUrl = null;

        // Drag and drop setup
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'), false);
        });

        dropArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files), false);
        dropArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', function() { handleFiles(this.files); });

        function formatBytes(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }

        function handleFiles(files) {
            if (!files || files.length === 0) return;
            const file = files[0];
            if (!file.type.match('image.*')) {
                window.DigitalUtils.showToast('Please upload an image file.', 'error');
                return;
            }

            currentFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                originalDataUrl = e.target.result;
                document.getElementById('imgPreviewOriginal').src = originalDataUrl;
                document.getElementById('imgSizeOriginal').textContent = formatBytes(file.size);
                dropArea.classList.add('hidden');
                workspace.classList.remove('hidden');
                compressImage();
            };
            reader.readAsDataURL(file);
        }

        function compressImage() {
            if (!originalDataUrl) return;
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const quality = parseInt(document.getElementById('imgQuality').value) / 100;
                const type = currentFile.type === 'image/png' ? 'image/webp' : currentFile.type; // PNG doesn't support quality param, convert to webp for display compression

                const compressedDataUrl = canvas.toDataURL(type, quality);
                document.getElementById('imgPreviewCompressed').src = compressedDataUrl;

                // Estimate size from base64 (rough)
                const base64Length = compressedDataUrl.length - (compressedDataUrl.indexOf(',') + 1);
                const padding = (compressedDataUrl.charAt(compressedDataUrl.length - 2) === '=') ? 2 : ((compressedDataUrl.charAt(compressedDataUrl.length - 1) === '=') ? 1 : 0);
                const fileSize = (base64Length * 0.75) - padding;

                const saved = currentFile.size - fileSize;
                const savedPercent = saved > 0 ? Math.round((saved / currentFile.size) * 100) : 0;

                document.getElementById('imgSizeCompressed').innerHTML = `${formatBytes(fileSize)} <span style="color:var(--success); font-weight:bold;">(-${savedPercent}%)</span>`;

                document.getElementById('downloadImgBtn').onclick = () => {
                    const a = document.createElement('a');
                    a.href = compressedDataUrl;
                    a.download = 'compressed-' + currentFile.name.replace(/\.[^/.]+$/, "") + (type === 'image/webp' ? '.webp' : '.jpg');
                    a.click();
                };
            };
            img.src = originalDataUrl;
        }

        document.getElementById('imgQuality').addEventListener('input', (e) => {
            document.getElementById('qualityVal').textContent = e.target.value + '%';
        });

        document.getElementById('imgQuality').addEventListener('change', compressImage);

        document.getElementById('resetImgBtn').addEventListener('click', () => {
            currentFile = null;
            originalDataUrl = null;
            fileInput.value = '';
            workspace.classList.add('hidden');
            dropArea.classList.remove('hidden');
        });
    }
});

    // IMAGE RESIZER
    const resDropArea = document.getElementById('resDropArea');
    const resInput = document.getElementById('resInput');
    const resWorkspace = document.getElementById('resWorkspace');

    if (resDropArea && resInput) {
        window.DigitalUtils.recordToolUsage('image-resizer', 'Image Resizer', '/tools/image/resizer.html');

        let originalImg = new Image();
        let currentFileName = '';
        let aspectRatio = 1;

        const wInput = document.getElementById('resWidth');
        const hInput = document.getElementById('resHeight');
        const lockRatio = document.getElementById('resLockRatio');

        resDropArea.addEventListener('click', () => resInput.click());
        resDropArea.addEventListener('dragover', (e) => { e.preventDefault(); resDropArea.classList.add('dragover'); });
        resDropArea.addEventListener('dragleave', () => resDropArea.classList.remove('dragover'));
        resDropArea.addEventListener('drop', (e) => { e.preventDefault(); resDropArea.classList.remove('dragover'); handleResFiles(e.dataTransfer.files); });
        resInput.addEventListener('change', function() { handleResFiles(this.files); });

        function handleResFiles(files) {
            if (!files || files.length === 0) return;
            const file = files[0];
            if (!file.type.match('image.*')) return window.DigitalUtils.showToast('Please upload an image.', 'error');

            currentFileName = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImg.src = e.target.result;
                originalImg.onload = () => {
                    document.getElementById('resPreview').src = originalImg.src;
                    wInput.value = originalImg.width;
                    hInput.value = originalImg.height;
                    aspectRatio = originalImg.width / originalImg.height;

                    resDropArea.classList.add('hidden');
                    resWorkspace.classList.remove('hidden');
                };
            };
            reader.readAsDataURL(file);
        }

        wInput.addEventListener('input', () => {
            if (lockRatio.checked && wInput.value) {
                hInput.value = Math.round(parseInt(wInput.value) / aspectRatio);
            }
        });

        hInput.addEventListener('input', () => {
            if (lockRatio.checked && hInput.value) {
                wInput.value = Math.round(parseInt(hInput.value) * aspectRatio);
            }
        });

        document.getElementById('downloadResBtn').addEventListener('click', () => {
            const width = parseInt(wInput.value);
            const height = parseInt(hInput.value);
            if (!width || !height) return window.DigitalUtils.showToast('Invalid dimensions', 'error');

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(originalImg, 0, 0, width, height);

            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg', 0.9);
            a.download = 'resized-' + currentFileName.replace(/\.[^/.]+$/, ".jpg");
            a.click();
        });

        document.getElementById('resetResBtn').addEventListener('click', () => {
            resInput.value = '';
            resWorkspace.classList.add('hidden');
            resDropArea.classList.remove('hidden');
        });
    }

    // IMAGE FORMAT CONVERTER (PNG TO JPG)
    const convDropArea = document.getElementById('convDropArea');
    const convInput = document.getElementById('convInput');
    const convWorkspace = document.getElementById('convWorkspace');

    if (convDropArea && convInput) {
        window.DigitalUtils.recordToolUsage('png-to-jpg', 'PNG to JPG Converter', '/tools/image/png-to-jpg.html');

        let originalImgConv = new Image();
        let convFileName = '';

        convDropArea.addEventListener('click', () => convInput.click());
        convDropArea.addEventListener('dragover', (e) => { e.preventDefault(); convDropArea.classList.add('dragover'); });
        convDropArea.addEventListener('dragleave', () => convDropArea.classList.remove('dragover'));
        convDropArea.addEventListener('drop', (e) => { e.preventDefault(); convDropArea.classList.remove('dragover'); handleConvFiles(e.dataTransfer.files); });
        convInput.addEventListener('change', function() { handleConvFiles(this.files); });

        function handleConvFiles(files) {
            if (!files || files.length === 0) return;
            const file = files[0];
            convFileName = file.name;
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImgConv.src = e.target.result;
                originalImgConv.onload = () => {
                    document.getElementById('convPreview').src = originalImgConv.src;
                    convDropArea.classList.add('hidden');
                    convWorkspace.classList.remove('hidden');
                };
            };
            reader.readAsDataURL(file);
        }

        document.getElementById('downloadConvBtn').addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            canvas.width = originalImgConv.width;
            canvas.height = originalImgConv.height;
            const ctx = canvas.getContext('2d');

            // Fill background with white for transparent PNGs
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(originalImgConv, 0, 0);

            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/jpeg', 0.9);
            a.download = convFileName.replace(/\.[^/.]+$/, "") + '.jpg';
            a.click();
        });

        document.getElementById('resetConvBtn').addEventListener('click', () => {
            convInput.value = '';
            convWorkspace.classList.add('hidden');
            convDropArea.classList.remove('hidden');
        });
    }
