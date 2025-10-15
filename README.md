# Tibbles Source Of Security

This repository contains the source code for the Tibbles Source Of Security suite, a comprehensive security application built as a Progressive Web App and packaged with Electron for a native Windows experience.

## How to Build the `.exe` Installer

Follow these steps to package the application into a distributable `.exe` installer for Windows.

### Prerequisites (One-Time Setup)

1.  **Node.js:** You must have Node.js installed on your computer. If you don't, download and install the "LTS" version from [nodejs.org](https://nodejs.org/).
2.  **GitHub Desktop:** For an easy, user-friendly experience, download and install [GitHub Desktop](https://desktop.github.com/).

### Build Steps

1.  **Clone the Repository:**
    *   Open GitHub Desktop.
    *   Go to `File` > `Clone Repository`.
    *   Select this repository from the list and choose a folder on your computer to save it in.

2.  **Open the Project in Command Prompt:**
    *   In GitHub Desktop, with this repository selected, go to the top menu and click `Repository` > `Open in Command Prompt`. This will open a command prompt window in the correct directory.

3.  **Install Dependencies:**
    *   In the command prompt window, type the following command and press Enter. This will download Electron and the other tools needed for the build. This may take a few minutes.
    ```bash
    npm install
    ```

4.  **Build the Installer:**
    *   After the installation is complete, run the final build command:
    ```bash
    npm run dist
    ```

5.  **Find Your Installer:**
    *   Once the process is finished, look inside your project folder. You will find a new folder named `dist`.
    *   Inside the `dist` folder is your installer: `Tibbles Source Of Security Setup.exe`.

You can now run this file to install the suite on your computer or share it with others.
