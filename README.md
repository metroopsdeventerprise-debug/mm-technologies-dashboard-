# M&M Technologies — Deployment Guide

This folder is a complete, ready-to-run React project containing your operations dashboard. Follow these steps in order — no coding required, just copy/paste commands.

---

## Part 1: Get it running on your own computer (optional but recommended first)

1. Install **Node.js** (free) from https://nodejs.org — get the "LTS" version.
2. Unzip this project folder somewhere on your computer.
3. Open a terminal (Mac: Terminal app / Windows: Command Prompt or PowerShell) and navigate into the folder:
   ```
   cd path/to/mm-technologies-app
   ```
4. Install the project's dependencies:
   ```
   npm install
   ```
5. Run it locally:
   ```
   npm run dev
   ```
6. Open the link it gives you (usually `http://localhost:5173`) in your browser. You should see the full dashboard.

If step 6 works, you're ready to deploy it publicly.

---

## Part 2: Put the code on GitHub (free)

GitHub is just the storage location Vercel/Netlify will read from.

1. Create a free account at https://github.com if you don't have one.
2. Click the **+** icon (top right) → **New repository**.
3. Name it `mm-technologies-dashboard`, keep it **Public** or **Private** (either works), don't check any of the "initialize with" boxes, then click **Create repository**.
4. GitHub will show you commands — back in your terminal, inside the project folder, run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/mm-technologies-dashboard.git
   git push -u origin main
   ```
   (Replace `YOUR-USERNAME` with your actual GitHub username — GitHub shows you this exact command on the new repo page too.)
5. Refresh the GitHub page — your files should now be there.

---

## Part 3: Deploy it live with Vercel (free)

1. Go to https://vercel.com and sign up — choose **"Continue with GitHub"** so the two are connected automatically.
2. Click **Add New → Project**.
3. Select your `mm-technologies-dashboard` repo from the list and click **Import**.
4. Vercel will auto-detect it's a Vite project — leave all settings as default.
5. Click **Deploy**.
6. In under a minute, Vercel gives you a live URL like `mm-technologies-dashboard.vercel.app` — that's your permanent link.
7. From now on, any time you (or I, on your behalf) push a code change to GitHub, Vercel automatically redeploys the updated version to that same link.

**Alternative: Netlify** works almost identically — sign up at https://netlify.com, "Import from Git," pick the repo, and it auto-detects the Vite build settings.

---

## Part 4: Make it installable on phones (PWA — free, already built in)

This project already includes PWA (Progressive Web App) support in `vite.config.js`. Once it's deployed on Vercel/Netlify (Part 3):

1. Open the live URL on an iPhone in **Safari** → tap the Share icon → **Add to Home Screen**.
2. On Android in **Chrome** → tap the **⋮** menu → **Install app** (or **Add to Home screen**).
3. It now behaves like an installed app — its own icon, opens full-screen, no browser bar.

**Note:** the manifest currently points to placeholder icon files (`icon-192.png`, `icon-512.png`) that aren't included yet. Add two square PNG icons of those sizes to the `public/` folder before deploying, or the app will still work but use a default icon.

---

## Part 5: Custom domain (optional, free to set up — domain itself costs money)

If you want something like `mmtechnologies.com` instead of the `.vercel.app` link:
1. Buy the domain from any registrar (Namecheap, Google Domains, GoDaddy, etc. — this is the only paid part of this whole process).
2. In your Vercel project → **Settings → Domains** → add your domain.
3. Vercel gives you DNS records to paste into your domain registrar's settings.
4. Wait for DNS to propagate (usually under an hour) — your custom domain now points to the live dashboard.

---

## What to do if you get stuck

Bring the exact error message back to me and I'll walk through the fix with you — most issues at this stage are a typo in a command or a missing `npm install` step.
