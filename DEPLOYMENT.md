# Publish TaskFlow AI

## 1. Run locally

Install Node.js 18 or newer, then run:

```bash
npm install
npm start
```

Open `http://127.0.0.1:3000`.

## 2. Upload to GitHub

Create an empty GitHub repository, then run these commands in the extracted project folder:

```bash
git init
git add .
git commit -m "Initial TaskFlow AI release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/taskflow-ai.git
git push -u origin main
```

## 3. Deploy on Render

1. Sign in to Render and select **New +** → **Blueprint**.
2. Connect the GitHub repository.
3. Select the repository and approve the generated `taskflow-ai` service.
4. Click **Apply**. Render installs Node, runs `npm install`, starts the app with `npm start`, and gives you a public HTTPS URL.

The app uses the `PORT` supplied by the hosting platform and exposes `/health` for deployment checks.

## MongoDB Atlas

In Render, open **Environment** and add `MONGODB_URI` with your MongoDB Atlas connection string. The server connects automatically when this variable is present. Do not put credentials in GitHub or in source files.

## Other hosting platforms

The included `Dockerfile` works on Railway, Fly.io, DigitalOcean App Platform, and any Docker-compatible host. Set the service port to the platform-provided `PORT` value.
