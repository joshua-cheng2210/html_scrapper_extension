interface CaptureResponse {
    success: boolean;
    message?: string;
    data?: string; // The captured HTML content
}

interface PopupMessage {
    type: 'capture' | 'error';
    payload: CaptureResponse;
}

interface CaptureRequest {
    url: string; // The URL of the page to capture
}