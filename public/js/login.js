document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');

    // Password visibility toggle
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const passwordField = this.previousElementSibling;
            const icon = this.querySelector('i');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // Login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Basic validation
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Simulate login (replace with actual authentication logic)
        console.log('Attempting login with:', email);

        // Simulated successful login
        try {
            // In a real app, this would be an API call
            localStorage.setItem('userEmail', email);
            alert('Login successful!');
            window.location.href = 'index.html'; // Redirect to homepage
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    });

    // Google Sign-In (simulated)
    const googleSignInButton = document.querySelector('.btn-google');
    googleSignInButton.addEventListener('click', function () {
        alert('Google Sign-In functionality will be implemented');
        // In a real app, this would trigger Google OAuth
    });

    // Forgot Password
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Password reset link will be sent to your email');
        // In a real app, this would trigger a password reset flow
    });
});