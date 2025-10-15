# Tibbles Source Of Security

This repository contains the source code for the Tibbles Source Of Security suite.

## How to Create Your Windows `.exe` Installer

It looks like the automated script wasn't working on your PC. Let's switch to a manual method that is much more reliable. Please follow these steps carefully.

### Step 1: Install Node.js (One-Time Setup)

Your computer needs Node.js to build the installer. If you don't already have it, please download and install the **"LTS" version** from the official website:

- **[https://nodejs.org/](https://nodejs.org/)**

During installation, use the default settings. After installing, **you must restart your computer** for it to work correctly.

### Step 2: Open Command Prompt in Your Project Folder

This is the most important step. We need to open a command window *inside* the folder where you have all the project files (`package.json`, `electron.js`, etc.).

1.  Open the folder containing the project files in Windows File Explorer.
2.  Click on the address bar at the top of the File Explorer window (the area that shows the folder path, like `C:\Users\YourName\Desktop\ProjectFolder`).
3.  Delete all the text in the address bar, type **`cmd`**, and press **Enter**.

A black command window will appear. It is now "looking" at your project folder, which is exactly what we need.

### Step 3: Install Tools and Build the App

Now, type the following two commands into the black command window. Press **Enter** after each one.

1.  First, install the necessary tools. This might take a few minutes depending on your internet speed. Type this and press Enter:
    ```
    npm install
    ```

2.  Next, build the installer. This is the longest step and can take several minutes. Please be patient and let it finish. Type this and press Enter:
    ```
    npm run dist
    ```

You will see a lot of text as it works. Wait until you can type again and the command prompt returns to a new line.

### Step 4: Find Your One-Click Installer

Once the process is complete, you will find your new, simplified installer inside a folder named `dist`.

This installer is now a **one-click installer**, making it extremely easy to use on Windows 11. Just double-click the setup file, and the application will be installed and launched for you automatically—no extra steps or questions asked!

### Troubleshooting

-   **`'npm' is not recognized as an internal or external command...`**
    This means Node.js was not installed correctly or you didn't restart your computer after installing it. Please go back to Step 1, reinstall the **LTS version** from [nodejs.org](https://nodejs.org/), and **restart your PC** before trying Step 2 again.

-   **A JavaScript error appears saying `Cannot find module 'electron-squirrel-startup'`:**
    This means a necessary package is missing. To fix this, simply re-run the `npm install` command from Step 3 in your project folder. This will download the missing piece. After it's done, you can run `npm run dist` again to create the installer.

-   **The build fails with `image ... has unknown format`:**
    This means the application icon file (`assets/icons/icon.ico`) is corrupted or not in a valid `.ico` format. To fix this, the icon has been removed from the build configuration. The installer will now build successfully with a default icon. If you want a custom icon, you must create a correctly formatted `.ico` file and add the `icon` path back to the `package.json` file.

-   **The process fails with errors during `npm install`:**
    This is often due to a poor internet connection. Please check your connection and try running `npm install` again.