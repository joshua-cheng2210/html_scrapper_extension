// This file contains the background script for the Chrome extension. It listens for events and manages the extension's lifecycle, including handling the "capture" button click.

// Utilities translated from the notebook's cleaning functions
function removeInvisibleChars(text: string): string {
    if (!text) return '';
    const invisibleChars = [
        '\u200b', // Zero-width space
        '\u00a0', // Non-breaking space
        '\u200c', // Zero-width non-joiner
        '\u200d', // Zero-width joiner
        '\ufeff', // BOM
        '\u2028', // Line separator
        '\u2029', // Paragraph separator
        '\u00ad'  // Soft hyphen
    ];
    for (const ch of invisibleChars) {
        text = text.split(ch).join('');
    }
    return text;
}

function removeSpaces(text: string): string {
    if (!text) return '';
    text = text.replace(/\n\s+/g, ' ');
    text = text.replace(/\s+/g, ' ');
    text = text.replace(/\n+/g, ' ');
    return text.trim();
}

function completelyCleanedText(text: string): string {
    if (!text) return '';
    text = removeInvisibleChars(text);
    text = removeSpaces(text);
    // remove HTML tags if present
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, ' ');
    return text.trim();
}

function buildSafeFilename(pageTitle: string | undefined): string {
    let title = completelyCleanedText(pageTitle || '');

    // Notebook-specific replacements (kept as examples - you can extend)
    title = title.replace("Joshua Cheng's Quiz History: ", '').trim();
    title = title.replace(': BIOL 1009 (070-082) General Biology (Fall 2025)', '').trim();
    title = title.replace(' (course resources and policies)', '').trim();

    // Remove Canvas due-date pattern like " (due Wed, Apr. 8 at 12:00 PM)"
    const duePattern = /\s*\(due\s+\w+,\s+\w+\.\s+\d+\s+at\s+[\d:]+\s+[AP]M\)/i;
    title = title.replace(duePattern, '').trim();

    if (!title) title = 'page';

    // Remove characters invalid in Windows filenames
    title = title.replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, ' ').trim();
    const timestamp = new Date().toISOString().replace(/[:\-]/g, '').replace(/\..+/, '');
    const shortTitle = title.length > 120 ? title.slice(0, 120).trim() : title;
    return `${shortTitle}_${timestamp}.html`;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.action === 'capture') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs && tabs[0];
            if (!activeTab || !activeTab.id) {
                sendResponse({ success: false, error: 'No active tab' });
                return;
            }

            // Execute script in page to get both title and HTML
            chrome.scripting.executeScript({
                target: { tabId: activeTab.id },
                func: () => {
                    return {
                        title: document.title || '',
                        html: document.documentElement ? document.documentElement.outerHTML : ''
                    };
                }
            }, (results) => {
                try {
                    if (!results || !results[0] || !results[0].result) {
                        sendResponse({ success: false, error: 'Failed to retrieve page content' });
                        return;
                    }
                    const { title, html } = results[0].result as { title: string; html: string };
                    const filename = buildSafeFilename(title);

                    // Use a data URL to download the HTML. encodeURIComponent prevents issues with special chars.
                    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

                    chrome.downloads.download({
                        url: dataUrl,
                        filename: filename,
                        conflictAction: 'uniquify',
                        saveAs: false
                    }, (downloadId) => {
                        if (chrome.runtime.lastError) {
                            sendResponse({ success: false, error: chrome.runtime.lastError.message });
                        } else {
                            sendResponse({ success: true, filename });
                        }
                    });
                } catch (err: any) {
                    sendResponse({ success: false, error: String(err) });
                }
            });
        });

        // Return true to indicate we'll call sendResponse asynchronously
        return true;
    }
});