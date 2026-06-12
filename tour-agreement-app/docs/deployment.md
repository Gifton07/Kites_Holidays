# Deployment Guide

This guide outlines how to deploy the Tour Agreement App. The application consists of two main components:
1. **Frontend (Vite/React)**: In the `client/client` directory.
2. **Backend (Express/Node.js)**: In the `server` directory.

---

## Recommended Architecture: Separate Hosting

Due to the **Puppeteer PDF Generation** and long-running node processes, hosting the backend on Vercel serverless functions has severe limitations (such as function bundle size limits and headless browser installation restrictions). 

The recommended setup is:
- **Frontend**: Deploy on **Vercel** (Static Site Hosting).
- **Backend**: Deploy on **Render**, **Railway**, or **Fly.io** (which natively support permanent Node.js apps and custom headless browser installations via buildpacks/Docker).

---

## 1. Deploying the Frontend on Vercel

Vercel is the easiest place to host the React SPA frontend.

### Steps:
1. **Prepare the Repository**:
   - Ensure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

2. **Create a Vercel Project**:
   - Go to [Vercel](https://vercel.com) and click **Add New** > **Project**.
   - Import your Git repository.

3. **Configure Project Settings**:
   - **Framework Preset**: Select **Vite** or **Other**.
   - **Root Directory**: Set this to `client/client` (since the Vite application is nested here).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Add the following environment variable to the Vercel project:
     - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).

5. **Deploy**:
   - Click **Deploy**. Vercel will build your Vite React app and publish it.

---

## 2. Deploying the Backend (Render or Railway)

Since Vercel has a 50MB function size limit and does not include chromium/headless browsers out of the box, deploying the backend on Render or Railway is the easiest path.

### Option A: Render (Free/Paid Tier)
1. Create a **Web Service** on Render.
2. Connect your Git repository.
3. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following environment variables in Render's **Environment** tab:
   - `PORT`: `5000` (Render overrides this automatically, but good to have)
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure secret string.
   - `JWT_EXPIRES_IN`: `7d`
   - `MEGA_EMAIL`: Your MEGA cloud email.
   - `MEGA_PASSWORD`: Your MEGA cloud password.
   - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS` (for SMTP emails).
5. **Adding Puppeteer (Chromium) Support**:
   - In Render, go to your Web Service settings, scroll down to **Build Filter** and **Environment Variables**.
   - Add a new environment variable: `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = true` (to avoid downloading during npm install).
   - Add the **Render Puppeteer Buildpack** or set the environment variable `PUPPETEER_EXECUTABLE_PATH = /usr/bin/google-chrome-stable` (Render automatically has Chrome installed if you use a Node.js environment or standard Docker environment).
   - Alternatively, use a **Docker** deploy by creating a `Dockerfile` inside the `server/` directory that installs Chromium.

### Option B: Railway (Highly Recommended for Express + Puppeteer)
1. Create a new project on Railway.
2. Add a **GitHub Repo** and set the root directory to `server`.
3. Railway automatically detects Node.js and installs the necessary browser packages if you use the standard Nixpacks builder, or if you provide a `Dockerfile`.
4. Add your `.env` variables in the **Variables** tab.

---

## 3. Alternative: Hosting BOTH Frontend and Backend on Vercel

If you absolutely must host both frontend and backend on Vercel, you have to run the Express backend as a **Serverless Function** and resolve the Puppeteer issue.

### A. Restructure Project / Setup `vercel.json`
To tell Vercel to route incoming API calls to your Express backend, create a `vercel.json` file in the root of the project:

```json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/server/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/client/client/$1"
    }
  ]
}
```

### B. Convert Express App to Serverless
Modify the entry point of your Express app (`server/server.js`) or create a new file `server/api/index.js` that exports the app:

```javascript
const app = require("../app");
const connectDB = require("../config/db");

// Database connection helper
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  cachedDb = await connectDB();
  return cachedDb;
}

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
```

### C. Solve Puppeteer in Vercel Serverless
Standard Vercel functions cannot exceed 50MB, meaning regular Puppeteer with Chromium will fail. You must:
1. Replace `puppeteer` package in `server/package.json` with `puppeteer-core` and `@sparticuz/chromium`.
2. Update `server/services/pdfService.js` to dynamically load `@sparticuz/chromium` when running on Vercel:

```javascript
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const generatePDF = async (agreementData) => {
  const html = agreementTemplate(agreementData);

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
  
  // ... rest of PDF generation ...
};
```
3. Set Vercel function configuration to allocate max memory (minimum 1024MB, recommended 3008MB) to allow chromium to run.
