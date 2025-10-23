const captureButton = document.getElementById('capture-button') as HTMLButtonElement | null;
const statusMessage = document.getElementById('status-message') as HTMLElement | null;
const outputFilename = document.getElementById('output-filename') as HTMLInputElement | null;

if (captureButton) {
    captureButton.addEventListener('click', () => {
        // Send a message to the background service worker to capture the active tab.
        if (statusMessage) statusMessage.textContent = 'Capturing...';
        if (outputFilename) outputFilename.value = '';
        try {
            chrome.runtime.sendMessage({ action: 'capture' }, (response: any) => {
                if (chrome.runtime.lastError) {
                    const msg = chrome.runtime.lastError.message || 'Unknown runtime error';
                    if (statusMessage) statusMessage.textContent = 'Error: ' + msg;
                    if (outputFilename) outputFilename.value = 'Error: ' + msg;
                    return;
                }
                if (response && response.success) {
                    const name = response.filename || 'download.html';
                    if (statusMessage) statusMessage.textContent = 'Success: Saved as ' + name;
                    if (outputFilename) outputFilename.value = name;
                } else {
                    const err = response && response.error ? String(response.error) : 'Failed to capture the page.';
                    if (statusMessage) statusMessage.textContent = 'Error: ' + err;
                    if (outputFilename) outputFilename.value = 'Error: ' + err;
                }
            });
        } catch (e: any) {
            const msg = e && e.message ? e.message : String(e);
            if (statusMessage) statusMessage.textContent = 'Error: ' + msg;
            if (outputFilename) outputFilename.value = 'Error: ' + msg;
        }
    });
} else {
    console.warn('Capture button not found in popup');
}