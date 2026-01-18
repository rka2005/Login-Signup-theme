# Terminal Login System

A cyberpunk-themed login/signup system with 2FA OTP verification via email using EmailJS.

## Project Structure

```
test/
├── index.html              # Main HTML structure
├── style.css               # Cyberpunk styling & animations
├── script.js               # Logic & EmailJS integration
├── config.js               # API keys (⚠️ DO NOT COMMIT)
├── config.example.js       # Template for config.js
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Features

✨ **Cyberpunk UI** - Terminal-style design with neon colors and glitch effects
🔐 **2FA OTP** - Email-based one-time password verification
📧 **EmailJS Integration** - Send OTP directly via email
🎨 **Smooth Animations** - Transition effects between login/signup screens
📱 **Responsive Design** - Works on desktop and mobile devices

## Quick Setup

### 1. Get EmailJS Credentials

1. Sign up at [EmailJS.com](https://www.emailjs.com/)
2. Create an email service
3. Create an email template
4. Copy your credentials:
   - **Public Key**
   - **Service ID**
   - **Template ID**

### 2. Configure API Keys

Create `config.js` from the template:

```bash
cp config.example.js config.js
```

Then edit `config.js` with your EmailJS credentials:

```javascript
const CONFIG = {
    EMAILJS_PUBLIC_KEY: "your_public_key_here",
    EMAILJS_SERVICE_ID: "your_service_id_here",
    EMAILJS_TEMPLATE_ID: "your_template_id_here"
};
```

### 3. Run Locally

Simply open `index.html` in a browser:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Or use Live Server extension in VS Code
```

Then visit `http://localhost:8000`

## How It Works

### Sign Up Flow
1. User enters email, username, and password
2. Click "INITIALIZE ACCOUNT"
3. OTP is generated and sent to email via EmailJS
4. Loading animation shows connection progress
5. User enters 6-digit OTP code
6. If correct, account is created and user is redirected to login

### Login Flow
1. User enters credentials
2. Click "EXECUTE LOGIN"
3. System validates credentials (ready for backend integration)

## File Descriptions

| File | Purpose |
|------|---------|
| `index.html` | HTML structure with form layouts, OTP input, and loader |
| `style.css` | Terminal aesthetics, animations, responsive design |
| `script.js` | Event handling, OTP generation, EmailJS integration |
| `config.js` | **API credentials (ignored by git)** |
| `config.example.js` | Template showing required config structure |
| `.gitignore` | Prevents `config.js` from being committed |

## Security

⚠️ **Important Security Notes:**

- `config.js` is added to `.gitignore` to prevent API keys from being committed
- Always keep `config.js` local - never push it to GitHub
- Each developer should have their own `config.js` file
- For production, use environment variables or server-side API calls

## EmailJS Template Variables

Your EmailJS template should use these variables:

```
{{to_name}}      - Username
{{otp_code}}     - Generated 6-digit OTP
{{user_email}}   - User's email address
```

## Customization

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --neon-green: #0f0;
    --neon-cyan: #0ff;
    --dark-bg: #050a05;
    --terminal-bg: #0a120a;
}
```

### Change OTP Timer
Edit in `script.js` - search for `TOKEN_EXPIRY` (currently 120 seconds)

### Change Messages
Update terminal text in `index.html` boot sequences

## Troubleshooting

**"SYSTEM ERROR: API CONFIGURATION MISSING"**
- Make sure `config.js` exists and is loaded before `script.js`
- Check browser console for errors

**OTP email not received**
- Verify EmailJS credentials in `config.js`
- Check spam/junk folder
- Ensure EmailJS template variables match

**CORS errors**
- EmailJS handles CORS - check your EmailJS account settings
- Verify domain is authorized in EmailJS console
