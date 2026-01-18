document.addEventListener('DOMContentLoaded', () => {
    // --- 1. CHECK FOR CONFIG ---
    if (typeof CONFIG === 'undefined') {
        console.error("Error: config.js is missing. Please create it with your API keys.");
        alert("SYSTEM ERROR: API CONFIGURATION MISSING.");
        return;
    }

    // --- 2. INITIALIZE EMAILJS HERE ---
    emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
    const EMAILJS_SERVICE_ID = CONFIG.EMAILJS_SERVICE_ID;
    const EMAILJS_TEMPLATE_ID = CONFIG.EMAILJS_TEMPLATE_ID;

    // --- DOM ELEMENTS ---
    const signinBox = document.getElementById('signin-box');
    const signupBox = document.getElementById('signup-box');
    const toSignupBtn = document.getElementById('to-signup');
    const toSigninBtn = document.getElementById('to-signin');
    const terminalTitle = document.getElementById('terminal-title');
    const loader = document.querySelector('.terminal-loader');
    const barFill = document.querySelector('.bar-fill');

    // OTP Elements
    const btnInitAccount = document.getElementById('btn-init-account');
    const step1 = document.getElementById('signup-step-1');
    const step2 = document.getElementById('signup-step-2');
    const btnVerifyOtp = document.getElementById('btn-verify-otp');
    const resendLink = document.getElementById('resend-otp');

    // Inputs
    const emailInput = document.getElementById('su-email');
    const userInput = document.getElementById('su-user');
    const otpInput = document.getElementById('otp-code');

    // State Variables
    let isAnimating = false;
    let generatedOTP = null;
    let userEmail = "";
    let userName = "";

    // --- HELPER FUNCTIONS ---

    function generateOTP() {
        // Generate a random 6-digit number
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    function switchTerminalMode(targetMode) {
        if (isAnimating) return;
        isAnimating = true;

        const currentBox = targetMode === 'signup' ? signinBox : signupBox;
        const nextBox = targetMode === 'signup' ? signupBox : signinBox;
        const newTitle = targetMode === 'signup' ? 'ROOT@ACCESS:~$ ./register.sh' : 'ROOT@ACCESS:~$ ./login.sh';

        // Reset OTP View if going back to signup
        if (targetMode === 'signup') {
            step1.classList.remove('hidden-step', 'fade-out-left');
            step2.classList.add('hidden-step');
            step2.classList.remove('fade-in-right');
        }

        currentBox.classList.add('glitching-out');

        setTimeout(() => {
            loader.classList.remove('hidden');
            barFill.style.animation = 'none';
            barFill.offsetHeight;
            barFill.style.animation = null;
        }, 400);

        setTimeout(() => {
            currentBox.classList.remove('active-box', 'glitching-out');
            nextBox.classList.add('active-box');
            terminalTitle.textContent = newTitle;
        }, 1000);

        setTimeout(() => {
            loader.classList.add('hidden');
            isAnimating = false;
            const firstInput = nextBox.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 1900);
    }

    function showToast(message) {
        // Simple alert replacement for hacker vibe
        alert(`>> SYSTEM MSG: ${message}`);
    }

    // --- CORE LOGIC ---

    // 1. Initialize Account (Send OTP)
    btnInitAccount.addEventListener('click', () => {
        userEmail = emailInput.value;
        userName = userInput.value;

        if (!userEmail || !userName) {
            showToast("ERROR: MISSING CREDENTIALS");
            return;
        }

        // 1. Generate OTP
        generatedOTP = generateOTP();

        // 2. Visual Transition (Loader)
        step1.classList.add('fade-out-left');
        loader.classList.remove('hidden');
        barFill.style.animation = 'none';
        barFill.offsetHeight;
        barFill.style.animation = 'loadingFill 2s forwards linear';

        // 3. Send Email via EmailJS
        const templateParams = {
            to_name: userName,
            otp_code: generatedOTP,
            user_email: userEmail
        };

        // Note: In emailjs.send, the 4th parameter is Public Key, 
        // but we already initialized it in HTML, so we don't strictly need it here.
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);

                // 4. If success, show OTP screen
                setTimeout(() => {
                    step1.classList.add('hidden-step');
                    step2.classList.remove('hidden-step');
                    step2.classList.add('fade-in-right');
                    loader.classList.add('hidden');
                    otpInput.value = ""; // Clear previous
                    otpInput.focus();
                    terminalTitle.textContent = 'ROOT@ACCESS:~$ ./2fa_verify.sh';
                }, 1000); // Wait for loader visual

            }, function (error) {
                console.log('FAILED...', error);
                showToast("CONNECTION FAILED: UNABLE TO SEND PACKET.");

                // Reset view on failure
                loader.classList.add('hidden');
                step1.classList.remove('fade-out-left');
            });
    });

    // 2. Verify OTP
    btnVerifyOtp.addEventListener('click', () => {
        const enteredOTP = otpInput.value;
        const btnText = btnVerifyOtp.querySelector('.btn-text');
        const originalText = ">> DECRYPT & VERIFY";

        // Stop if empty
        if (!enteredOTP) return;

        // Visual Feedback: Processing...
        btnText.textContent = ">> VERIFYING HASH...";
        btnVerifyOtp.style.cursor = "wait";

        // Simulate processing delay (1 second)
        setTimeout(() => {
            if (enteredOTP === generatedOTP) {
                // 1. Visual Success State (Green)
                btnVerifyOtp.style.borderColor = "#0f0"; // Green Border
                btnVerifyOtp.style.color = "#0f0";       // Green Text
                btnVerifyOtp.style.boxShadow = "0 0 15px #0f0"; // Glow
                btnText.textContent = ">> ACCESS GRANTED";

                showToast(`IDENTITY CONFIRMED. ACCOUNT CREATED.`);

                // 2. Redirect to Sign In after 2 seconds
                setTimeout(() => {
                    // Reset button style (cleanup)
                    btnVerifyOtp.style = "";
                    btnText.textContent = originalText;

                    // Clear inputs for security
                    otpInput.value = "";
                    emailInput.value = "";
                    userInput.value = "";
                    document.getElementById('su-pass').value = "";

                    // ---> THE REDIRECT <---
                    switchTerminalMode('signin');

                }, 2000);

            } else {
                // 1. Visual Failure State (Red)
                btnVerifyOtp.style.borderColor = "#ff0000"; // Red Border
                btnVerifyOtp.style.color = "#ff0000";       // Red Text
                btnVerifyOtp.style.boxShadow = "0 0 15px #ff0000"; // Red Glow
                btnText.textContent = ">> ACCESS DENIED";

                showToast("ERROR: INVALID TOKEN. TRY AGAIN.");

                // 2. Reset button so they can try again
                setTimeout(() => {
                    btnVerifyOtp.style = ""; // Clear red styles
                    btnText.textContent = originalText;
                    btnVerifyOtp.style.cursor = "pointer";
                }, 2000);
            }
        }, 1000); // End of simulated processing delay
    });

    // 3. Resend OTP
    resendLink.addEventListener('click', (e) => {
        e.preventDefault();
        showToast("RESENDING PACKET...");

        // Regenerate and Resend
        generatedOTP = generateOTP();

        const templateParams = {
            to_name: userName,
            otp_code: generatedOTP,
            user_email: userEmail
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                showToast("PACKET RESENT SUCCESSFULLY.");
            });
    });

    // --- NAVIGATION HANDLERS ---
    toSignupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchTerminalMode('signup');
    });

    toSigninBtn.addEventListener('click', (e) => {
        e.preventDefault();
        switchTerminalMode('signin');
    });
});