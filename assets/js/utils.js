// Utilities for Digital Utility Hub

window.DigitalUtils = {
    // Toast Notifications
    showToast: (message, type = 'success') => {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        if (type === 'error') {
            toast.style.borderLeftColor = 'var(--error)';
            toast.style.color = 'var(--error)';
        } else if (type === 'warning') {
            toast.style.borderLeftColor = 'var(--warning)';
            toast.style.color = 'var(--warning)';
        }

        toast.innerHTML = `<span>${message}</span> <button style="background:none; border:none; cursor:pointer; color:inherit;">✕</button>`;

        toast.querySelector('button').addEventListener('click', () => {
            toast.remove();
        });

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 3000);
    },

    // Recently Used Tools
    recordToolUsage: (toolId, title, url) => {
        try {
            let recent = JSON.parse(localStorage.getItem('recentTools') || '[]');
            recent = recent.filter(t => t.id !== toolId); // Remove if exists
            recent.unshift({ id: toolId, title, url, timestamp: Date.now() }); // Add to top
            if (recent.length > 6) recent.pop(); // Keep max 6
            localStorage.setItem('recentTools', JSON.stringify(recent));
        } catch (e) {
            console.error('Local storage full or disabled', e);
        }
    },

    getRecentTools: () => {
        try {
            return JSON.parse(localStorage.getItem('recentTools') || '[]');
        } catch (e) {
            return [];
        }
    },

    // Favorites
    toggleFavorite: (toolId, title, url, icon) => {
        try {
            let favs = JSON.parse(localStorage.getItem('favTools') || '[]');
            const exists = favs.findIndex(t => t.id === toolId);

            if (exists >= 0) {
                favs.splice(exists, 1);
                window.DigitalUtils.showToast('Removed from favorites', 'warning');
            } else {
                favs.push({ id: toolId, title, url, icon });
                window.DigitalUtils.showToast('Added to favorites', 'success');
            }

            localStorage.setItem('favTools', JSON.stringify(favs));
            return exists < 0; // return true if added, false if removed
        } catch (e) {
            console.error('Local storage full or disabled', e);
            return false;
        }
    },

    isFavorite: (toolId) => {
        try {
            const favs = JSON.parse(localStorage.getItem('favTools') || '[]');
            return favs.some(t => t.id === toolId);
        } catch (e) {
            return false;
        }
    },

    getFavorites: () => {
        try {
            return JSON.parse(localStorage.getItem('favTools') || '[]');
        } catch (e) {
            return [];
        }
    },

    // Copy to clipboard helper
    copyText: (text) => {
        if (!text) {
             window.DigitalUtils.showToast('Nothing to copy!', 'warning');
             return;
        }
        navigator.clipboard.writeText(text).then(() => {
            window.DigitalUtils.showToast('Copied to clipboard!');
        }).catch(err => {
            window.DigitalUtils.showToast('Failed to copy', 'error');
            console.error('Error copying text: ', err);
        });
    },

    // File download helper
    downloadFile: (content, fileName, mimeType) => {
        const a = document.createElement('a');
        const file = new Blob([content], {type: mimeType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    }
};
