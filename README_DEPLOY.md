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
