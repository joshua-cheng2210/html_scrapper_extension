# Chrome Capture Extension

This project is a Google Chrome extension that allows users to capture the HTML content of the current webpage and save it to their computer. The extension features a simple popup interface with a "capture" button.

## Features

- Capture the HTML of the current webpage.
- Save the captured HTML to your local machine.
- User-friendly popup interface.

## Technology Stack

- **HTML/CSS**: For the popup interface.
- **TypeScript**: For writing the extension's scripts.
- **Chrome Extensions API**: For interacting with the browser and managing the extension's lifecycle.

## Project Structure

```
chrome-capture-extension
├── src
│   ├── background.ts        # Background script for managing extension events
│   ├── content
│   │   └── capture.ts       # Content script for capturing webpage HTML
│   ├── popup
│   │   ├── popup.html       # HTML structure of the popup
│   │   ├── popup.ts         # Logic for the popup interactions
│   │   └── popup.css        # Styles for the popup
│   └── types
│       └── index.d.ts       # Type definitions for TypeScript
├── manifest.json            # Configuration file for the Chrome extension
├── package.json             # npm configuration file
├── tsconfig.json            # TypeScript configuration file
└── README.md                # Documentation for the project
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd chrome-capture-extension
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

1. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the `chrome-capture-extension` directory.
   
2. Click the extension icon in the toolbar to open the popup.
3. Click the "capture" button to save the HTML of the current webpage.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.