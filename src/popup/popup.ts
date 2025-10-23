const captureButton = document.getElementById('capture-button') as HTMLButtonElement | null;
const statusMessage = document.getElementById('status-message') as HTMLElement | null;

if (captureButton) {
    captureButton.addEventListener('click', () => {
        // Send a message to the background service worker to capture the active tab.
        if (statusMessage) statusMessage.textContent = 'Capturing...';
        try {
            chrome.runtime.sendMessage({ action: 'capture' }, (response: any) => {
                if (chrome.runtime.lastError) {
                    if (statusMessage) statusMessage.textContent = 'Error: ' + chrome.runtime.lastError.message;
                    return;
                }
                if (response && response.success) {
                    if (statusMessage) statusMessage.textContent = 'Saved: ' + (response.filename || 'download');
                } else {
                    if (statusMessage) statusMessage.textContent = 'Failed to capture the page.';
                }
            });
        } catch (e: any) {
            if (statusMessage) statusMessage.textContent = 'Error: ' + (e && e.message ? e.message : String(e));
        }
    });
} else {
    console.warn('Capture button not found in popup');
}