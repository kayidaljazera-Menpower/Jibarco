# JIBARCO - Deployment Guide (Vercel & Render)

This folder contains the complete, production-ready static website for **JIBARCO**.

---

## Deploy to Vercel (Recommended - Instant & Free)

### Option A: Via Vercel CLI
1. Open PowerShell or terminal in the `Frontend` folder:
   ```bash
   cd Frontend
   npx vercel
   ```
2. Follow the 2 prompts (Hit `Enter` for defaults). Done!

### Option B: Via Vercel Web Dashboard (Drag & Drop or Git)
1. Go to [vercel.com/new](https://vercel.com/new).
2. Connect your GitHub repository (or use Vercel CLI).
3. Set **Root Directory** to `Frontend` (or upload the `Frontend` folder contents directly).
4. Click **Deploy**. Your site will be live on a fast global CDN with automatic HTTPS!

---

## Deploy to Render (Static Site - Free)

1. Go to [dashboard.render.com](https://dashboard.render.com).
2. Click **New +** -> **Static Site**.
3. Connect your repository.
4. Set:
   - **Build Command**: *(leave blank)*
   - **Publish Directory**: `Frontend` (or `.` if uploading `Frontend` repo)
5. Click **Create Static Site**.
