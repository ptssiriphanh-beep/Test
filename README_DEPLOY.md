# Deploying the static storefront (Netlify)

This file documents the Netlify deployment steps and a build hook created for manual triggers.

Site (created via CLI):
- Name: `mini-banana-cupcake-store-ptssiriphanh-beep`
- Admin: https://app.netlify.com/projects/mini-banana-cupcake-store-ptssiriphanh-beep
- Live: https://mini-banana-cupcake-store-ptssiriphanh-beep.netlify.app

Build hook (manual deploy trigger)
- I created a build hook so you can trigger production deploys with a single POST request.
- Hook URL: `https://api.netlify.com/build_hooks/691ef09886c33464fb50d2e0`

Trigger with curl:

```bash
curl -X POST https://api.netlify.com/build_hooks/691ef09886c33464fb50d2e0
```

Notes:
- To enable continuous Git deploys (push → automatic deploy), open the Netlify admin URL above and "Link repository" under Build & deploy. Netlify will request GitHub authorization to create webhooks and read your repository.
- If you revoke the personal token used to create the site, re-run the CLI steps with a new token or connect via the Netlify UI.

Security reminder:
- If you created a personal Netlify token to let me deploy, revoke it from https://app.netlify.com/user/applications#personal-access-tokens when you're done.
# Deploying the static storefront

This project serves a static storefront from the `public/` folder. Below are simple, step-by-step options to publish the site so you can share a public link with customers.

1) GitHub Pages (recommended for simple hosting)

- Ensure this repository is pushed to GitHub and you have a `main` branch.
- The repository contains a GitHub Actions workflow (`.github/workflows/pages.yml`) that uploads the `public/` folder and deploys it to Pages on every push to `main`.
- After you push, open the repository on GitHub and go to "Settings → Pages" to confirm the Pages site. The Actions tab will show the deploy job. The site URL usually looks like `https://<your-user>.github.io/<repo>`.

Notes:
- The workflow publishes the contents of `public/` as-is. If you want a build step, update the workflow to run the build (e.g., npm install && npm run build) before uploading the artifact.

2) Netlify (drag-and-drop or repository connect)

- Quick drag-and-drop: ZIP the `public/` folder and drop it on Netlify's Sites → Add new site → "Deploy manually".
- Connect the repository: In Netlify, choose "New site from Git" and connect your GitHub account and this repository. Set the "Build command" to blank and the "Publish directory" to `public` (or use `netlify.toml` present in repo).

3) Local preview

To preview locally the same contents that will be deployed, run:

```bash
python3 -m http.server 3000 --directory public
# then open http://localhost:3000
```

4) After deploy checks

- Verify images load and the checkout/confirm flow reveals the QR and phone number (`020 5289 5996`).
- If you want an automated push-and-deploy flow that requires a secret token or special build step, I can add that (e.g., Netlify CI, or GH Action build step).

If you want, I can try to push the changes and verify the Actions run — let me know if you want me to push now (I may ask for credentials if not configured in the environment).
