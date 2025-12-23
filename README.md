# Mirror Simple

This project contains a static frontend (`public/`) and a serverless API (`api/analyze.js`) that calls OpenAI. The API key must be set as an environment variable `OPENAI_API_KEY` on the host.

How to publish (recommended: Vercel Dashboard):

1. Push your repo to GitHub (you already did):

   git add .
   git commit -m "Prepare for deploy"
   git push

2. Import project on Vercel (web UI):
   - Go to https://vercel.com/new
   - Select your GitHub repo `LanbingL/mirror-simple`
   - Use defaults; Vercel will detect `api/` and `public/`

3. Set environment variable on Vercel:
   - Project → Settings → Environment Variables
   - Add `OPENAI_API_KEY` = your key
   - Redeploy

4. Open the provided URL and click the "Start" button.

Local test (optional):

- Start a local static server for `public/`:
  npx http-server public -p 8080

- To test the API locally, set `OPENAI_API_KEY` in your shell and call `api/analyze` using curl or a small script.

If you want, I can finish the Git push and trigger a dashboard deploy for you, or walk you through the Vercel import step-by-step.