# Tibbles Source Of Security

This repository contains the source code for the Tibbles Source Of Security suite, a comprehensive security application built as a Progressive Web App and packaged with Electron for a native Windows experience.

## How to Create Your Windows `.exe` Installer

The process has been simplified to be as reliable and easy as possible. Just follow these two steps.

### Step 1: Install Node.js (One-Time Setup)

Your computer needs Node.js to run the build script. If you don't have it, please download and install the **"LTS" version** from the official website:

- **[https://nodejs.org/](https://nodejs.org/)**

During installation, ensure you are on the default settings. No special configuration is needed.

### Step 2: Run the Build Script

An automated script has been created to handle everything for you.

1.  **Save All Files:** Make sure all the project files (including this `README.md`, `package.json`, and `build.bat`) are in a single folder on your computer.

2.  **Double-Click the Script:** Find the file named `build.bat` and **double-click it** to run it.

A black command window will appear and show the progress. It will first install the necessary tools, then it will build the installer. This may take a few minutes.

When it's finished, it will say **BUILD COMPLETE** and tell you where to find your completed `.exe` file.

That's it! Your professional installer is ready to be used and distributed.

### Troubleshooting

- **"node is not recognized..." error:** This means Node.js is not installed correctly or wasn't added to your system's PATH. Please reinstall the LTS version from [nodejs.org](https://nodejs.org/) and make sure to restart your computer after installation.
- **Errors during "Installing necessary tools...":** This is often due to a poor internet connection. Please check your connection and run `build.bat` again.