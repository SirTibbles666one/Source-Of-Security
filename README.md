# Tibbles Source Of Security

This repository contains the source code for the Tibbles Source Of Security suite.

## How to Create Your Windows `.exe` Installer

We've identified the final issue preventing your installer from being created. The build process requires administrator permissions to work correctly. Please follow these updated steps.

### Step 1: Install Node.js (One-Time Setup)

If you haven't already, you must install Node.js to build the installer.

1.  Go to the official website: **[https://nodejs.org/](https://nodejs.org/)**
2.  Download and install the version labeled **"LTS"**.
3.  During installation, use all the default settings.
4.  After it finishes, **you must restart your computer**. This is a critical step.

### Step 2: Open Command Prompt as an Administrator

This is the most important step to fix the error you were seeing.

1.  Click the **Start Menu** button.
2.  Type **`cmd`**.
3.  In the search results, right-click on **"Command Prompt"** and select **"Run as administrator"**.
4.  A black command window will open. Now, you must tell it to navigate to your project folder. Type `cd` followed by a space, and then the full path to your project folder.

    **Important:** If your folder path contains spaces, you **must** wrap the entire path in quotes (`"`).

    For example, if your project is on your D: drive in a folder named "The Source Of Security", you would type:
    ```
    cd "D:\The Source Of Security"
    ```
    Press **Enter**. The command prompt should now show your project's path.

### Step 3: Install Tools and Build the App

Now that you are in the administrator command prompt and in the correct folder, run the following two commands. Press **Enter** after each one.

1.  First, install the necessary tools. This may take a few minutes.
    ```
    npm install
    ```

2.  Next, build the installer. This can take several minutes. Please be patient and let it finish completely.
    ```
    npm run dist
    ```

### Step 4: Find Your One-Click Installer

Once the process is complete, you will find your new, simplified installer inside a folder named `dist`.

This installer is now a **one-click installer**. Just double-click the setup file, and the application will be installed and launched for you automatically.

### Troubleshooting

-   **`'npm' is not recognized...`**: Node.js was not installed correctly, or you did not restart your PC after installing it. Please reinstall the **LTS version** from [nodejs.org](https://nodejs.org/) and **restart your PC**.

-   **`Cannot create symbolic link : A required privilege is not held by the client`**: This error means you did not run the command prompt as an administrator. Please close the command window and follow **Step 2** again very carefully.

-   **`image ... has unknown format`**: The application icon file is corrupted. The icon has been removed from the build configuration to fix this. The installer will build successfully with a default icon.