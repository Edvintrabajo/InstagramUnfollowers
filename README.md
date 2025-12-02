# 👁️ Instagram Unfollower Pro

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/Edvintrabajo/InstagramUnfollowers)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with](https://img.shields.io/badge/Built%20with-Preact%20%26%20TypeScript-blueviolet)](https://preactjs.com/)

A modern, safe, and privacy-focused tool to detect who isn't following you back on Instagram.
**No downloads, no passwords, and completely browser-based.**

> **New v2.0:** Features a stunning **Glassmorphism UI**, Shadow DOM isolation, and full mobile support.

---

## ✨ Key Features

- **🛡️ 100% Safe:** Runs locally in your browser. No password required.
- **🎨 Modern UI:** Beautiful Dark Mode with Glassmorphism design.
- **📱 Responsive:** Works perfectly on Desktop and Mobile.
- **🧩 Isolated:** Uses Shadow DOM technology, so it never conflicts with Instagram's layout.
- **⚡ Super Fast:** Built with Preact and TypeScript for maximum performance.
- **⚙️ Configurable:** Customize scanning speeds to prevent soft-bans.
- **🤍 Whitelist:** Protect specific users from accidental unfollowing.

---

## 🚀 How to Use (Desktop)

1. **Get the Code:**
   Go to the [Official Tool Page](https://edvintrabajo.github.io/InstagramUnfollowers/) (Replace with your actual GitHub Pages link later) or copy the code from `dist/dist.js`.

2. **Copy:**
   Click the **"Copy Code to Clipboard"** button.

3. **Open Instagram:**
   Go to [instagram.com](https://www.instagram.com) and log in.

4. **Open Console:**

   - **Windows/Linux:** Press `Ctrl + Shift + J` or `F12`.
   - **Mac OS:** Press `Cmd + Option + J`.

5. **Paste & Run:**
   Paste the code into the console and hit **Enter**.

   > _The overlay will appear instantly on your screen._

---

## 📱 How to Use (Mobile)

This tool is optimized for mobile browsers using the **Bookmarklet** method.

1. Go to the [Tool Page](https://edvintrabajo.github.io/InstagramUnfollowers/) on your phone.
2. Click **"Copy Code"**.
3. Create a new bookmark in your browser (Chrome/Safari).
4. Instead of a URL, paste the code you just copied. Name it "IG Scan".
5. Open Instagram in your browser.
6. Type "IG Scan" in the address bar and click the bookmark you created. The tool will launch!

---

## ⚙️ Configuration & Safety

To prevent Instagram from flagging your account for "suspicious activity," we include a **Safe Mode** by default.

You can customize the timings in the **Settings (⚙️)** menu:

- **Scan Interval:** Time between fetching pages of followers.
- **Unfollow Interval:** Delay between unfollowing users.
- **Cooldowns:** Auto-pause after every 5 actions to mimic human behavior.

> **⚠️ WARNING:** Decreasing these values significantly increases the risk of a temporary block. Use the defaults for safety.

---

## 🛠️ Local Development

Want to contribute or modify the code?

1. **Clone the repo:**

   ```bash
   git clone [https://github.com/Edvintrabajo/InstagramUnfollowers.git](https://github.com/Edvintrabajo/InstagramUnfollowers.git)
   cd InstagramUnfollowers
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run Development Server:**

   ```bash
   npm run build-dev
   ```

4. **Build Production Version:**
   This command compiles TypeScript, injects styles, and updates the HTML landing page automatically.

   ```bash
   npm run build
   ```

---

## ⚖️ Legal & Disclaimer

**Disclaimer:** This tool is an independent project and is not affiliated, associated, authorized, endorsed by, or officially connected with Instagram or Meta Platforms, Inc.

- **Use at your own risk.** The author is not responsible for any account restrictions resulting from the misuse of this tool.
- This tool does not collect any personal data. Everything runs locally on your machine.

---

## ❤️ Credits

Developed with ❤️ by **Edvin**.

Licensed under the [MIT License](https://www.google.com/search?q=LICENSE).
