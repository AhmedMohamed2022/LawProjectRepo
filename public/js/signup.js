document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signup-form');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('terms');
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

    // Signup form submission
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
    }