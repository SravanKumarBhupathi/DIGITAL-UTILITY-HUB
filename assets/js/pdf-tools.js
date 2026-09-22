document.addEventListener('DOMContentLoaded', () => {
    // PDF SPLITTER
    const pdfDropArea = document.getElementById('pdfDropArea');
    const pdfInput = document.getElementById('pdfInput');

    if (pdfDropArea && pdfInput && typeof PDFLib !== 'undefined') {
        window.DigitalUtils.recordToolUsage('pdf-split', 'Split PDF', '/tools/pdf/split.html');

        let currentPdfBytes = null;
        let totalPages = 0;
        let fileName = '';
        let splitRanges = [];

        pdfDropArea.addEventListener('click', () => pdfInput.click());
        pdfDropArea.addEventListener('dragover', (e) => { e.preventDefault(); pdfDropArea.classList.add('dragover'); });
        pdfDropArea.addEventListener('dragleave', () => pdfDropArea.classList.remove('dragover'));
        pdfDropArea.addEventListener('drop', (e) => { e.preventDefault(); pdfDropArea.classList.remove('dragover'); handlePdfFiles(e.dataTransfer.files); });
        pdfInput.addEventListener('change', function() { handlePdfFiles(this.files); });

        async function handlePdfFiles(files) {
            if (!files || files.length === 0) return;
            const file = files[0];
            if (file.type !== 'application/pdf') return window.DigitalUtils.showToast('Please upload a PDF file.', 'error');

            fileName = file.name;
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    currentPdfBytes = e.target.result;
                    const pdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
                    totalPages = pdfDoc.getPageCount();

                    document.getElementById('pdfFileName').textContent = fileName;
                    document.getElementById('pdfPageCount').textContent = totalPages;

                    document.getElementById('pdfSplitStep1').classList.add('hidden');
                    document.getElementById('pdfSplitStep2').classList.remove('hidden');

                    // Default configuration logic
                    const numSplits = document.getElementById('splitCountInput').value;
                    generateRangeInputs(numSplits);

                } catch (error) {
                    window.DigitalUtils.showToast('Could not read PDF. It might be encrypted or corrupted.', 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        }

        document.getElementById('generateRangesBtn').addEventListener('click', () => {
            const count = parseInt(document.getElementById('splitCountInput').value);
            if (count > 0 && count <= 20) {
                generateRangeInputs(count);
            }
        });

        function generateRangeInputs(count) {
            const container = document.getElementById('rangesContainer');
            container.innerHTML = '';
            container.classList.remove('hidden');

            // Try to distribute pages evenly as defaults
            let pagesPerSplit = Math.floor(totalPages / count);
            let remainder = totalPages % count;

            let currentStart = 1;

            for (let i = 1; i <= count; i++) {
                let currentEnd = currentStart + pagesPerSplit - 1;
                if (remainder > 0) {
                    currentEnd++;
                    remainder--;
                }
                if (currentEnd > totalPages) currentEnd = totalPages;

                const defaultVal = `${currentStart}-${currentEnd}`;

                const div = document.createElement('div');
                div.className = 'form-group mb-2';
                div.innerHTML = `
                    <label class="form-label text-sm">Split ${i} (Pages)</label>
                    <input type="text" class="form-control split-range-input" placeholder="e.g. 1-5" value="${defaultVal}" data-index="${i}">
                `;
                container.appendChild(div);

                currentStart = currentEnd + 1;
            }

            document.getElementById('validateSplitBtn').classList.remove('hidden');
            document.getElementById('splitError').classList.remove('show');
        }

        document.getElementById('validateSplitBtn').addEventListener('click', () => {
            const inputs = document.querySelectorAll('.split-range-input');
            const errorDiv = document.getElementById('splitError');
            errorDiv.classList.remove('show');

            let ranges = [];
            let isValid = true;
            let errorMsg = '';

            let usedPages = new Set();

            for (let i = 0; i < inputs.length; i++) {
                const val = inputs[i].value.trim();
                const parts = val.split('-');

                if (parts.length !== 2) {
                    isValid = false;
                    errorMsg = `Split ${i+1}: Invalid format. Use start-end (e.g., 1-5).`;
                    break;
                }

                const start = parseInt(parts[0]);
                const end = parseInt(parts[1]);

                if (isNaN(start) || isNaN(end) || start <= 0 || end <= 0) {
                    isValid = false;
                    errorMsg = `Split ${i+1}: Page numbers must be greater than 0.`;
                    break;
                }

                if (start > end) {
                    isValid = false;
                    errorMsg = `Split ${i+1}: Start page cannot be greater than end page.`;
                    break;
                }

                if (end > totalPages) {
                    isValid = false;
                    errorMsg = `Split ${i+1}: End page (${end}) exceeds total pages (${totalPages}).`;
                    break;
                }

                // Check for overlaps (strict mode for split)
                let overlap = false;
                for (let p = start; p <= end; p++) {
                    if (usedPages.has(p)) {
                        overlap = true;
                        break;
                    }
                    usedPages.add(p);
                }

                if (overlap) {
                    isValid = false;
                    errorMsg = `Split ${i+1}: Overlaps with a previous split. Pages cannot be duplicated.`;
                    break;
                }

                ranges.push({ start, end });
            }

            if (!isValid) {
                errorDiv.textContent = errorMsg;
                errorDiv.classList.add('show');
                return;
            }

            // Generate Summary
            splitRanges = ranges;
            const summaryDiv = document.getElementById('splitSummary');
            let summaryHtml = `<div style="font-weight:bold; margin-bottom: 1rem;">Original PDF: ${totalPages} pages</div>`;
            ranges.forEach((r, idx) => {
                summaryHtml += `<div style="margin-bottom:0.5rem; display:flex; justify-content:space-between; border-bottom:1px dashed var(--border-light); padding-bottom:0.5rem;">
                                    <span>Split ${idx+1}</span>
                                    <span style="color:var(--primary-accent); font-weight:bold;">Pages ${r.start} &rarr; ${r.end}</span>
                                </div>`;
            });
            summaryDiv.innerHTML = summaryHtml;

            document.getElementById('pdfSplitStep2').classList.add('hidden');
            document.getElementById('pdfSplitStep3').classList.remove('hidden');
        });

        document.getElementById('backToConfigBtn').addEventListener('click', () => {
            document.getElementById('pdfSplitStep3').classList.add('hidden');
            document.getElementById('pdfSplitStep2').classList.remove('hidden');
        });

        document.getElementById('resetSplitBtn').addEventListener('click', resetSplitter);
        document.getElementById('startOverBtn').addEventListener('click', resetSplitter);

        function resetSplitter() {
            currentPdfBytes = null;
            totalPages = 0;
            pdfInput.value = '';
            document.getElementById('rangesContainer').innerHTML = '';
            document.getElementById('splitError').classList.remove('show');

            document.getElementById('pdfSplitStep4').classList.add('hidden');
            document.getElementById('pdfSplitStep3').classList.add('hidden');
            document.getElementById('pdfSplitStep2').classList.add('hidden');
            document.getElementById('pdfSplitStep1').classList.remove('hidden');
        }

        document.getElementById('processSplitBtn').addEventListener('click', async () => {
            document.getElementById('processSplitBtn').disabled = true;
            document.getElementById('processSplitBtn').textContent = 'Processing...';

            try {
                const originalPdf = await PDFLib.PDFDocument.load(currentPdfBytes);
                const container = document.getElementById('downloadLinksContainer');
                container.innerHTML = '';

                for (let i = 0; i < splitRanges.length; i++) {
                    const range = splitRanges[i];
                    const newPdf = await PDFLib.PDFDocument.create();

                    // PDF-lib pages are 0-indexed
                    const pageIndices = [];
                    for (let p = range.start - 1; p <= range.end - 1; p++) {
                        pageIndices.push(p);
                    }

                    const copiedPages = await newPdf.copyPages(originalPdf, pageIndices);
                    copiedPages.forEach((page) => newPdf.addPage(page));

                    const pdfBytes = await newPdf.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const url = URL.createObjectURL(blob);

                    const partName = fileName.replace(/\.[^/.]+$/, "") + `-part-${i+1}.pdf`;

                    const div = document.createElement('div');
                    div.className = 'glass-card mb-2 flex items-center justify-between';
                    div.style.padding = '1rem';
                    div.innerHTML = `
                        <div>
                            <div style="font-weight:600;">Split ${i+1}</div>
                            <div class="text-sm text-muted">Pages ${range.start}-${range.end}</div>
                        </div>
                        <a href="${url}" download="${partName}" class="btn btn-outline btn-sm">Download</a>
                    `;
                    container.appendChild(div);
                }

                document.getElementById('pdfSplitStep3').classList.add('hidden');
                document.getElementById('pdfSplitStep4').classList.remove('hidden');

            } catch (e) {
                console.error(e);
                window.DigitalUtils.showToast('Error splitting PDF', 'error');
            } finally {
                document.getElementById('processSplitBtn').disabled = false;
                document.getElementById('processSplitBtn').textContent = 'Split PDF Now';
            }
        });
    }
});

    // PDF MERGER
    const mergeDropArea = document.getElementById('pdfMergeDropArea');
    const mergeInput = document.getElementById('pdfMergeInput');

    if (mergeDropArea && mergeInput && typeof PDFLib !== 'undefined') {
        window.DigitalUtils.recordToolUsage('pdf-merge', 'Merge PDF', '/tools/pdf/merge.html');

        let mergeFiles = [];

        mergeDropArea.addEventListener('click', () => mergeInput.click());
        mergeDropArea.addEventListener('dragover', (e) => { e.preventDefault(); mergeDropArea.classList.add('dragover'); });
        mergeDropArea.addEventListener('dragleave', () => mergeDropArea.classList.remove('dragover'));
        mergeDropArea.addEventListener('drop', (e) => { e.preventDefault(); mergeDropArea.classList.remove('dragover'); handleMergeFiles(e.dataTransfer.files); });
        mergeInput.addEventListener('change', function() { handleMergeFiles(this.files); });

        function handleMergeFiles(files) {
            if (!files || files.length === 0) return;

            let added = false;
            for (let i = 0; i < files.length; i++) {
                if (files[i].type === 'application/pdf') {
                    mergeFiles.push(files[i]);
                    added = true;
                }
            }

            if (added) {
                mergeDropArea.classList.add('hidden');
                document.getElementById('pdfMergeWorkspace').classList.remove('hidden');
                renderMergeList();
            } else {
                window.DigitalUtils.showToast('Please select valid PDF files.', 'error');
            }
        }

        function renderMergeList() {
            const list = document.getElementById('pdfMergeList');
            list.innerHTML = '';

            mergeFiles.forEach((f, idx) => {
                const div = document.createElement('div');
                div.className = 'glass-card flex items-center justify-between';
                div.style.padding = '0.75rem 1rem';
                div.innerHTML = `
                    <div class="flex items-center gap-3">
                        <span style="font-size:1.5rem;">📄</span>
                        <span style="font-weight:500;">${f.name}</span>
                    </div>
                    <button class="btn btn-outline btn-sm remove-file-btn" data-index="${idx}" style="color:var(--error); border-color:var(--error);">Remove</button>
                `;
                list.appendChild(div);
            });

            document.querySelectorAll('.remove-file-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    mergeFiles.splice(idx, 1);
                    if (mergeFiles.length === 0) {
                        document.getElementById('pdfMergeWorkspace').classList.add('hidden');
                        mergeDropArea.classList.remove('hidden');
                    } else {
                        renderMergeList();
                    }
                });
            });
        }

        document.getElementById('resetMergeBtn').addEventListener('click', () => {
            mergeFiles = [];
            mergeInput.value = '';
            document.getElementById('pdfMergeWorkspace').classList.add('hidden');
            mergeDropArea.classList.remove('hidden');
        });

        document.getElementById('processMergeBtn').addEventListener('click', async () => {
            if (mergeFiles.length < 2) {
                return window.DigitalUtils.showToast('Please select at least 2 PDF files to merge.', 'warning');
            }

            const btn = document.getElementById('processMergeBtn');
            btn.disabled = true;
            btn.textContent = 'Merging...';

            try {
                const mergedPdf = await PDFLib.PDFDocument.create();

                for (const file of mergeFiles) {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                }

                const pdfBytes = await mergedPdf.save();
                window.DigitalUtils.downloadFile(pdfBytes, 'merged-document.pdf', 'application/pdf');
                window.DigitalUtils.showToast('Merged successfully!', 'success');

            } catch (e) {
                console.error(e);
                window.DigitalUtils.showToast('Error merging PDFs. A file might be corrupted or encrypted.', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Merge PDFs';
            }
        });
    }
