# Terminal Login System

A cyberpunk-themed login/signup system with 2FA OTP verification via email.

## Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd test
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:
```
YOUR_PUBLIC_KEY_HERE = "your_emailjs_public_key"
Service_ID = "your_emailjs_service_id"
TEMPLATE_ID = "your_emailjs_template_id"
```

### 3. Get EmailJS Credentials

1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Copy your Public Key, Service ID, and Template ID

### 4. Development with Vite (Recommended)

For better environment variable handling and security:

```bash
npm install
npm run dev
```

Create `vite.config.js`:
```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: true
  }
})
```

Then in `script.js`, the environment variables will be automatically injected from `.env`.

### 5. Without Build Tool

If not using a build tool, directly edit the hardcoded values in `script.js` during development. The `.env` file is for your reference - it won't be automatically loaded by the browser.

## Files

- `index.html` - UI structure
- `style.css` - Cyberpunk styling
- `script.js` - Logic & EmailJS integration
- `.env` - API keys (ignored by git)
- `.env.example` - Template for environment variables

## Important

⚠️ **Never commit `.env` to GitHub** - it contains sensitive credentials.

The `.gitignore` file automatically excludes `.env` from version control.
