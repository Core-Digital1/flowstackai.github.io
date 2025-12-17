        const supabaseUrl = 'https://mdvczbswbwbghschjthq.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdmN6YnN3YndiZ2hzY2hqdGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxOTcwNzIsImV4cCI6MjA3ODc3MzA3Mn0.LhiKgP0EWAANGJK7ocN8rbTBmEFttgTsCqwEzHzbezk';

        // Initialize Supabase
        let supabase;
        if (window.supabase) {
            supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        } else {
            console.error('Supabase SDK not loaded - some features may be unavailable');
        }

        // Modal functions
        function openSignupModal() {
            closeAllModals();
            document.getElementById('signupModal').style.display = 'flex';
        }

        function closeSignupModal() {
            document.getElementById('signupModal').style.display = 'none';
        }

        function openLoginModal() {
            closeAllModals();
            document.getElementById('loginModal').style.display = 'flex';
        }

        function closeLoginModal() {
            document.getElementById('loginModal').style.display = 'none';
        }

        function openForgotPasswordModal() {
            closeAllModals();
            document.getElementById('forgotPasswordModal').style.display = 'flex';
        }

        function closeForgotPasswordModal() {
            document.getElementById('forgotPasswordModal').style.display = 'none';
        }

        function openNewPasswordModal() {
            closeAllModals();
            document.getElementById('newPasswordModal').style.display = 'flex';
        }

        function closeNewPasswordModal() {
            document.getElementById('newPasswordModal').style.display = 'none';
        }

        function closeAllModals() {
            document.getElementById('signupModal').style.display = 'none';
            document.getElementById('loginModal').style.display = 'none';
            document.getElementById('forgotPasswordModal').style.display = 'none';
            document.getElementById('newPasswordModal').style.display = 'none';
            clearMessages();
        }

        function clearMessages() {
            const messages = ['signupMessage',
                'loginMessage',
                'forgotPasswordMessage',
                'newPasswordMessage'];

            messages.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'none';
            });
        }

        function showMessage(elementId, message, type) {
            const element = document.getElementById(elementId);

            if (element) {
                element.textContent = message;

                element.className = `message ${type}`;
                element.style.display = 'block';
            }
        }

        // Close modal when clicking outside
        window.onclick = function (event) {
            if (event.target.classList.contains('modal')) {
                closeAllModals();
            }
        }

        // FORCE PASSWORD RESET DETECTION
        function forcePasswordResetDetection() {

            // Check hash for password reset
            if (window.location.hash && window.location.hash.includes('type=recovery')) {
                // Manually parse hash
                const hash = window.location.hash.substring(1);

                const params = {}

                    ;

                hash.split('&').forEach(pair => {
                    const [key, value] = pair.split('=');
                    params[key] = value;
                });

                const access_token = params['access_token'];

                if (access_token) {
                    sessionStorage.setItem('reset_token', access_token);

                    // Open modal immediately
                    setTimeout(() => {
                        openNewPasswordModal();
                    }

                        , 1000);

                    // Clean URL
                    setTimeout(() => {
                        window.history.replaceState({}

                            , document.title, window.location.pathname);
                    }

                        , 2000);

                    return true;
                }
            }

            return false;
        }

        // SUPABASE SIGNUP
        document.getElementById('signupForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const signupBtn = document.getElementById('signupBtn');

            signupBtn.disabled = true;
            signupBtn.textContent = 'Creating Account...';

            try {

                // Create user in Supabase with email verification
                const {
                    data, error
                }

                    = await supabase.auth.signUp({

                        email: email,
                        password: password,
                        options: {
                            data: {
                                full_name: fullName
                            }

                            ,
                            emailRedirectTo: 'https://flowstackai.github.io'
                        }
                    });

                if (error) throw error;

                if (data.user) {
                    if (data.user.identities && data.user.identities.length === 0) {
                        showMessage('signupMessage',
                            'Account already exists with this email. Please log in instead.',
                            'error'
                        );
                    }

                    else if (data.user.confirmed_at) {
                        showMessage('signupMessage',
                            'Account created and email verified! You can now log in.',
                            'success'
                        );
                    }

                    else {
                        showMessage('signupMessage',
                            '🎉 Account created! Please check your email (including spam folder) for verification link.',
                            'success'
                        );
                    }

                    document.getElementById('signupForm').reset();
                }

            }

            catch (error) {
                let errorMessage = 'Error creating account. ';

                if (error.message.includes('already registered')) {
                    errorMessage += 'Email already exists. Please log in.';
                }

                else if (error.message.includes('Invalid email')) {
                    errorMessage += 'Invalid email address.';
                }

                else if (error.message.includes('Password')) {
                    errorMessage += 'Password should be at least 6 characters.';
                }

                else {
                    errorMessage += error.message;
                }

                showMessage('signupMessage', errorMessage, 'error');
            }

            finally {
                signupBtn.disabled = false;
                signupBtn.textContent = 'CREATE ACCOUNT';
            }
        });

        // PASSWORD VISIBILITY TOGGLE
        function togglePasswordVisibility(inputId, iconElement) {
            const input = document.getElementById(inputId);
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Toggle icons
            if (type === 'text') {
                // Show "Hide" icon (Slash Eye)
                iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
            }

            else {
                // Show "Show" icon (Normal Eye)
                iconElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            }
        }

        // SUPABASE LOGIN
        document.getElementById('loginForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const loginBtn = document.getElementById('loginBtn');

            loginBtn.disabled = true;
            loginBtn.textContent = 'Logging in...';

            try {
                const {
                    data, error
                }

                    = await supabase.auth.signInWithPassword({
                        email: email,
                        password: password
                    });

                if (error) throw error;

                if (data.user) {
                    showMessage('loginMessage', '✅ Login successful! Redirecting to dashboard...', 'success');

                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }

                        , 1500);
                }

            }

            catch (error) {
                let errorMessage = 'Login failed. ';

                if (error.message.includes('Invalid login credentials')) {
                    errorMessage += 'Invalid email or password.';
                }

                else if (error.message.includes('Email not confirmed')) {
                    errorMessage += 'Please verify your email address first.';
                }

                else {
                    errorMessage += error.message;
                }

                showMessage('loginMessage', errorMessage, 'error');
            }

            finally {
                loginBtn.disabled = false;
                loginBtn.textContent = 'LOG IN';
            }
        });

        // FORGOT PASSWORD
        document.getElementById('forgotPasswordForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('forgotEmail').value;
            const forgotBtn = document.getElementById('forgotPasswordBtn');

            forgotBtn.disabled = true;
            forgotBtn.textContent = 'Sending...';

            try {
                const {
                    error
                }

                    = await supabase.auth.resetPasswordForEmail(email, {
                        redirectTo: 'https://flowstackai.github.io'
                    });

                if (error) throw error;

                showMessage('forgotPasswordMessage',
                    '✅ Password reset link sent! Check your email (including spam folder).',
                    'success'
                );

                document.getElementById('forgotPasswordForm').reset();

            }

            catch (error) {
                showMessage('forgotPasswordMessage',
                    'Error sending reset link: ' + error.message,
                    'error'
                );
            }

            finally {
                forgotBtn.disabled = false;
                forgotBtn.textContent = 'SEND RESET LINK';
            }
        });

        // NEW PASSWORD
        document.getElementById('newPasswordForm').addEventListener('submit', async function (e) {
            e.preventDefault();

            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const newPasswordBtn = document.getElementById('newPasswordBtn');

            if (newPassword !== confirmPassword) {
                showMessage('newPasswordMessage', 'Passwords do not match', 'error');
                return;
            }

            newPasswordBtn.disabled = true;
            newPasswordBtn.textContent = 'Updating...';

            try {
                const {
                    error
                }

                    = await supabase.auth.updateUser({
                        password: newPassword
                    });

                if (error) throw error;

                showMessage('newPasswordMessage',
                    '✅ Password updated successfully! You can now log in with your new password.',
                    'success'
                );

                // Clear stored token
                sessionStorage.removeItem('reset_token');
                document.getElementById('newPasswordForm').reset();

                setTimeout(() => {
                    closeNewPasswordModal();
                    openLoginModal();
                }

                    , 3000);

            }

            catch (error) {
                showMessage('newPasswordMessage',
                    'Error updating password: ' + error.message,
                    'error'
                );
            }

            finally {
                newPasswordBtn.disabled = false;
                newPasswordBtn.textContent = 'UPDATE PASSWORD';
            }
        });

        // Check auth state and password reset on load
        document.addEventListener('DOMContentLoaded', function () {

            // Check for password reset - Immediately
            setTimeout(() => {
                forcePasswordResetDetection();
            }

                , 100);

            // Animation for feature cards
            const cards = document.querySelectorAll('.feature-card');

            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }

                    , index * 200);
            });
        });

        // Automatic check - Added
        window.addEventListener('hashchange', function () {
            setTimeout(() => {
                forcePasswordResetDetection();
            }

                , 100);
        });

        // Check immediately when script loads (before DOM ready)
        setTimeout(() => {
            forcePasswordResetDetection();
        }

            , 50);

        // Auth state listener
        if (supabase) {
            supabase.auth.onAuthStateChange((event, session) => {
                if (event === 'SIGNED_IN') {

                    // Check if this is a password recovery flow
                    if (window.location.hash && window.location.hash.includes('type=recovery')) {

                        // Do not redirect, let forcePasswordResetDetection handle it
                        setTimeout(() => {
                            forcePasswordResetDetection();
                        }

                            , 500);
                    }

                    else {

                        // Normal login or signup verification
                        // Redirect to dashboard
                        setTimeout(() => {
                            window.location.href = 'dashboard.html';
                        }

                            , 500);
                    }
                }

                else if (event === 'PASSWORD_RECOVERY') {
                    setTimeout(() => {
                        forcePasswordResetDetection();
                    }

                        , 500);
                }
            });
        }
    </script>
