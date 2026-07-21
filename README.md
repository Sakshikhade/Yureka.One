<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9b44dd1d-b84a-4f12-95d8-6973b8362b7d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `pnpm install`
2. (Optional) Configure the backend API base URL in [.env](.env):
   `VITE_API_BASE_URL=` (leave empty for relative `/api/*`, or set the Java backend origin)
3. Run the app:
   `pnpm dev`
