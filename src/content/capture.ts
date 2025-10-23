const capturePageHTML = (): string => {
    const htmlContent = document.documentElement.outerHTML;
    return htmlContent;
};

const sendHTMLToBackground = (html: string): void => {
    chrome.runtime.sendMessage({ action: 'saveHTML', data: html }, (response: any) => {
        if (response && response.success) {
            console.log('HTML saved successfully');
        } else {
            console.error('Failed to save HTML');
        }
    });
};

const initCaptureButton = (): void => {
    const captureButton = document.createElement('button');
    captureButton.innerText = 'Capture HTML';
    captureButton.style.position = 'fixed';
    captureButton.style.zIndex = '9999';
    captureButton.style.top = '10px';
    captureButton.style.right = '10px';
    captureButton.onclick = () => {
        const html = capturePageHTML();
        sendHTMLToBackground(html);
    };
    document.body.appendChild(captureButton);
};

initCaptureButton();