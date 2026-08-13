# SK Health Club Website - Development & Deployment Guide

Welcome to the source code for the SK Health Club Pune website. This document explains how the project is structured, how to develop locally, and how to push changes to the live website.

## Project Overview
This project is a static front-end website built using HTML, CSS (Tailwind CSS), and Vanilla JavaScript.
- **Animations & Smooth Scrolling:** Handled via GSAP, Lenis, and ScrollTrigger.
- **Sliders:** Handled via SwiperJS.
- **Form Submissions:** Contact forms use **Web3Forms** and have a client-side rate limit (max 4 submissions per user, per month) stored in the browser's `localStorage` to prevent spam.

## Environments

### Development (Local) Environment
When you are working on the website and making changes, you should run the local development server. 
1. Open your terminal in this folder.
2. Run `npm install` (if you haven't already).
3. To watch for CSS changes (Tailwind) in the background, open a terminal and run: 
   ```bash
   npm run dev
   ```
4. To start a local live server to see your website on `localhost:3000`, open a second terminal and run:
   ```bash
   npm start
   ```

### Build Environment
When the code is ready for production, the CSS needs to be compiled and minified. This is handled by the build command:
```bash
npm run build
```
*(Note: Vercel automatically runs this command for you when deploying).*

### Production Environment
The live website is hosted on **Vercel**.
- **Live URL:** [https://sk-health-club.vercel.app](https://sk-health-club.vercel.app)
- Vercel is configured via the `vercel.json` file in this directory to run the `npm run build` command and serve the root directory (`.`).

---

## How to Make Changes and Update the Live Website

If you want to make text edits, add images, or change styling in the future, follow this workflow:

### 1. Make Changes Locally
Make your edits in the HTML, CSS, or JS files. You can preview them immediately by running `npm start` and viewing `localhost:3000` in your browser.

### 2. Save and Commit to GitHub
Once you are happy with the changes locally, you need to commit them and push them to your GitHub repository's `master` branch.

In your terminal, run:
```bash
git add .
git commit -m "Describe what you changed here"
git push origin master
```

### 3. See Changes on the Live Website
**If your GitHub account is linked to Vercel (Recommended):**
The moment you run `git push origin master`, Vercel will detect the new code, automatically run the build command, and update the live website. This usually takes less than a minute. You can view the build progress in your [Vercel Dashboard](https://vercel.com/dashboard).

**If you prefer manual deployment:**
You can deploy directly from your local machine using the Vercel CLI without going through GitHub. Just run:
```bash
vercel --prod
```
This will upload your current folder to Vercel and update the live URL.
