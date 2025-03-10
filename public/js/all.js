// script.js
document.addEventListener("DOMContentLoaded", function () {
    // FAQ accordion functionality
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach((question) => {
        question.addEventListener("click", () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector("i");

            // Toggle answer visibility
            if (answer.style.display === "block") {
                answer.style.display = "none";
                icon.classList.remove("fa-minus");
                icon.classList.add("fa-plus");
            } else {
                answer.style.display = "block";
                icon.classList.remove("fa-plus");
                icon.classList.add("fa-minus");
            }
        });
    });

    // Reviews carousel functionality
    const reviewCards = document.querySelector(".review-cards");
    const prevButton = document.querySelector(".review-nav.prev");
    const nextButton = document.querySelector(".review-nav.next");
    let currentIndex = 0;

    // This would need to be expanded for a real implementation
    // with proper carousel functionality
    nextButton.addEventListener("click", () => {
        currentIndex++;
        updateCarousel();
    });

    prevButton.addEventListener("click", () => {
        currentIndex--;
        updateCarousel();
    });

    function updateCarousel() {
        // Basic carousel functionality
        // Would need to be enhanced for a production site
        console.log("Updating carousel to index:", currentIndex);
    }

    // Form validation
    const contactForm = document.querySelector(".contact-form");
    const formControls = contactForm.querySelectorAll(".form-control");
    const sendButton = contactForm.querySelector(".btn");

    sendButton.addEventListener("click", (e) => {
        e.preventDefault();
        let isValid = true;

        formControls.forEach((control) => {
            if (!control.value.trim()) {
                isValid = false;
                control.style.borderColor = "red";
            } else {
                control.style.borderColor = "";
            }
        });

        if (isValid) {
            alert("Form submitted successfully!");
            // In a real implementation, you would send the form data to a server
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // Existing code...

    // Law Categories Filter Functionality
    const categoryFilters = document.querySelectorAll(".category-filter");
    const lawCards = document.querySelectorAll(".law-card");

    categoryFilters.forEach((filter) => {
        filter.addEventListener("click", () => {
            // Update active filter
            categoryFilters.forEach((f) => f.classList.remove("active"));
            filter.classList.add("active");

            const selectedCategory = filter.getAttribute("data-category");

            // Filter the law cards
            lawCards.forEach((card) => {
                if (
                    selectedCategory === "all" ||
                    card.getAttribute("data-category") === selectedCategory
                ) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // Law Search Functionality
    const searchInput = document.getElementById("law-search");
    const searchButton = document.querySelector(".search-btn");

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        lawCards.forEach((card) => {
            const title = card.querySelector(".law-title").textContent.toLowerCase();
            const excerpt = card
                .querySelector(".law-excerpt")
                .textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    // Law Detail Modal Functionality
    const viewButtons = document.querySelectorAll(".law-footer .btn-outline");
    const lawModal = document.getElementById("lawModal");
    const closeModalBtn = document.querySelector(".close-modal");

    viewButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const lawCard = this.closest(".law-card");
            const category = lawCard.querySelector(".law-category").textContent;
            const title = lawCard.querySelector(".law-title").textContent;
            const excerpt = lawCard.querySelector(".law-excerpt").textContent;
            const date = lawCard
                .querySelector(".law-date")
                .textContent.replace("Last updated: ", "");

            // Update modal content
            lawModal.querySelector(".law-category-tag").textContent = category;
            lawModal.querySelector(".law-full-title").textContent = title;
            lawModal.querySelector(".law-description").textContent =
                excerpt +
                " This is additional detailed content that appears when the law is viewed in detail. It provides comprehensive information about the law's purpose, implementation, and impact on various stakeholders. The content includes analysis of key provisions, historical context, and practical applications.";
            document.getElementById("modalLawDate").textContent = date;

            // Show modal
            lawModal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        });
    });

    closeModalBtn.addEventListener("click", function () {
        lawModal.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable scrolling
    });

    // Close modal if clicked outside content
    lawModal.addEventListener("click", function (event) {
        if (event.target === lawModal) {
            lawModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Pagination functionality (basic implementation)
    const paginationButtons = document.querySelectorAll(".pagination-btn");

    paginationButtons.forEach((button) => {
        button.addEventListener("click", function () {
            if (
                !this.classList.contains("active") &&
                !this.classList.contains("next")
            ) {
                paginationButtons.forEach((btn) => btn.classList.remove("active"));
                this.classList.add("active");

                // In a real implementation, this would fetch a new set of laws
                console.log("Switching to page:", this.textContent);
            }
        });
    });
});
//   lawsPage.js
document.addEventListener("DOMContentLoaded", function () {
    // Existing code...

    // Law Categories Filter Functionality
    const categoryFilters = document.querySelectorAll(".category-filter");
    const lawCards = document.querySelectorAll(".law-card");

    categoryFilters.forEach((filter) => {
        filter.addEventListener("click", () => {
            // Update active filter
            categoryFilters.forEach((f) => f.classList.remove("active"));
            filter.classList.add("active");

            const selectedCategory = filter.getAttribute("data-category");

            // Filter the law cards
            lawCards.forEach((card) => {
                if (
                    selectedCategory === "all" ||
                    card.getAttribute("data-category") === selectedCategory
                ) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // Law Search Functionality
    const searchInput = document.getElementById("law-search");
    const searchButton = document.querySelector(".search-btn");

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        lawCards.forEach((card) => {
            const title = card.querySelector(".law-title").textContent.toLowerCase();
            const excerpt = card
                .querySelector(".law-excerpt")
                .textContent.toLowerCase();

            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    searchButton.addEventListener("click", performSearch);
    searchInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    // Law Detail Modal Functionality
    const viewButtons = document.querySelectorAll(".law-footer .btn-outline");
    const lawModal = document.getElementById("lawModal");
    const closeModalBtn = document.querySelector(".close-modal");

    viewButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const lawCard = this.closest(".law-card");
            const category = lawCard.querySelector(".law-category").textContent;
            const title = lawCard.querySelector(".law-title").textContent;
            const excerpt = lawCard.querySelector(".law-excerpt").textContent;
            const date = lawCard
                .querySelector(".law-date")
                .textContent.replace("Last updated: ", "");

            // Update modal content
            lawModal.querySelector(".law-category-tag").textContent = category;
            lawModal.querySelector(".law-full-title").textContent = title;
            lawModal.querySelector(".law-description").textContent =
                excerpt +
                " This is additional detailed content that appears when the law is viewed in detail. It provides comprehensive information about the law's purpose, implementation, and impact on various stakeholders. The content includes analysis of key provisions, historical context, and practical applications.";
            document.getElementById("modalLawDate").textContent = date;

            // Show modal
            lawModal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        });
    });

    closeModalBtn.addEventListener("click", function () {
        lawModal.classList.remove("active");
        document.body.style.overflow = ""; // Re-enable scrolling
    });

    // Close modal if clicked outside content
    lawModal.addEventListener("click", function (event) {
        if (event.target === lawModal) {
            lawModal.classList.remove("active");
            document.body.style.overflow = "";
        }
    });

    // Pagination functionality (basic implementation)
    const paginationButtons = document.querySelectorAll(".pagination-btn");

    paginationButtons.forEach((button) => {
        button.addEventListener("click", function () {
            if (
                !this.classList.contains("active") &&
                !this.classList.contains("next")
            ) {
                paginationButtons.forEach((btn) => btn.classList.remove("active"));
                this.classList.add("active");

                // In a real implementation, this would fetch a new set of laws
                console.log("Switching to page:", this.textContent);
            }
        });
    });
});
// lawsExpalnation.js
// document.addEventListener('DOMContentLoaded', function () {
//     // Star Rating Interaction
//     const starRating = document.querySelector('.star-rating');

//     starRating.addEventListener('change', function (e) {
//         if (e.target.type === 'radio') {
//             const rating = e.target.value;
//             // Here you would typically send the rating to the backend
//             console.log('Selected Rating:', rating);

//             // Optional: Show a thank you message
//             alert(`Thank you for rating this explanation ${rating}/5 stars!`);
//         }
//     });

//     // Comment Submission
//     const commentForm = document.querySelector('.comment-form');
//     const existingComments = document.querySelector('.existing-comments');

//     commentForm.addEventListener('submit', function (e) {
//         e.preventDefault();
//         const textarea = commentForm.querySelector('textarea');
//         const commentText = textarea.value.trim();

//         if (commentText) {
//             // Create a new comment element
//             const newComment = document.createElement('div');
//             newComment.classList.add('comment');
//             newComment.innerHTML = `
//                 <img src="https://via.placeholder.com/50" alt="User Avatar" class="user-avatar">
//                 <div class="comment-content">
//                     <h4>Anonymous User</h4>
//                     <p>${commentText}</p>
//                     <div class="comment-meta">
//                         <span>Just now</span>
//                         <a href="#" class="reply-link">Reply</a>
//                     </div>
//                 </div>
//             `;

//             // Add the new comment to existing comments
//             existingComments.appendChild(newComment);

//             // Clear the textarea
//             textarea.value = '';

//             // Here you would typically send the comment to the backend
//             console.log('New Comment:', commentText);
//         }
//     });
// });

//v2

// Law Explanations Database
const lawExplanations = {
    '123/2024': {
        category: 'Constitutional Law',
        title: 'Constitution of the Republic - Fundamental Rights',
        overview: 'This constitutional law defines and protects the fundamental rights of citizens, establishing the core principles of individual liberty, equality, and justice within the republic.',
        keyProvisions: [
            {
                title: 'Right to Equality',
                description: 'Guarantees equal protection under the law, prohibiting discrimination based on race, gender, religion, or social status.'
            },
            {
                title: 'Freedom of Expression',
                description: 'Protects the right to free speech, press, and peaceful assembly, with reasonable restrictions to maintain social harmony.'
            },
            {
                title: 'Right to Fair Trial',
                description: 'Ensures access to justice, right to legal representation, and protection against arbitrary arrest and detention.'
            }
        ],
        practicalImplications: 'This law serves as a foundational document that guides judicial interpretation, legislative action, and protects citizens\' fundamental rights against potential governmental overreach.',
        sourceReferences: [
            'Supreme Court Precedent Cases',
            'International Human Rights Conventions',
            'Legal Scholarly Articles'
        ],
        confidenceLevel: 85
    },
    '456/2024': {
        category: 'Cyber Law',
        title: 'Digital Privacy and Data Protection Act',
        overview: 'A comprehensive law addressing digital privacy, data protection, and cybersecurity in the digital age.',
        keyProvisions: [
            {
                title: 'Personal Data Protection',
                description: 'Establishes strict guidelines for collection, storage, and use of personal digital information.'
            },
            {
                title: 'Consent Mechanism',
                description: 'Requires explicit user consent for data collection and provides right to withdraw consent.'
            },
            {
                title: 'Data Breach Notification',
                description: 'Mandates immediate notification to users and authorities in case of data security breaches.'
            }
        ],
        practicalImplications: 'This law aims to protect individual privacy rights in the digital ecosystem and hold organizations accountable for data management.',
        sourceReferences: [
            'International Cybersecurity Standards',
            'Digital Rights Organizations',
            'Technology Policy Research'
        ],
        confidenceLevel: 75
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Dynamic Law Loading Function
    function loadLawExplanation(lawNumber) {
        const explanation = lawExplanations[lawNumber];

        if (!explanation) {
            console.error('Law not found');
            return;
        }

        // Update Law Header
        document.querySelector('.law-meta .law-category').textContent = explanation.category;
        document.querySelector('.law-meta .law-number').textContent = `No. ${lawNumber}`;
        document.querySelector('.law-title').textContent = explanation.title;

        // Update AI Explanation Content
        const confidenceBar = document.querySelector('.confidence-level');
        const confidencePercentage = document.querySelector('.confidence-percentage');
        confidenceBar.style.width = `${explanation.confidenceLevel}%`;
        confidencePercentage.textContent = `${explanation.confidenceLevel}%`;

        // Overview
        const overviewSection = document.querySelector('.explanation-content .explanation-section:first-child p');
        overviewSection.textContent = explanation.overview;

        // Key Provisions
        const keyProvisionsContainer = document.querySelector('.explanation-content ul');
        keyProvisionsContainer.innerHTML = explanation.keyProvisions.map(provision => `
            <li>
                <strong>${provision.title}:</strong>
                <p>${provision.description}</p>
            </li>
        `).join('');

        // Practical Implications
        const practicalImplicationsSection = document.querySelector('.explanation-content .explanation-section:last-child p');
        practicalImplicationsSection.textContent = explanation.practicalImplications;

        // Source References
        const sourceReferencesContainer = document.querySelector('.ai-source-references ul');
        sourceReferencesContainer.innerHTML = explanation.sourceReferences.map(ref => `
            <li>${ref}</li>
        `).join('');
    }

    // Star Rating Interaction
    const starRating = document.querySelector('.star-rating');
    starRating.addEventListener('change', function (e) {
        if (e.target.type === 'radio') {
            const rating = e.target.value;
            console.log('Selected Rating:', rating);
            alert(`Thank you for rating this explanation ${rating}/5 stars!`);
        }
    });

    // Comment Submission
    const commentForm = document.querySelector('.comment-form');
    const existingComments = document.querySelector('.existing-comments');
    commentForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const textarea = commentForm.querySelector('textarea');
        const commentText = textarea.value.trim();

        if (commentText) {
            const newComment = document.createElement('div');
            newComment.classList.add('comment');
            newComment.innerHTML = `
                <img src="https://via.placeholder.com/50" alt="User Avatar" class="user-avatar">
                <div class="comment-content">
                    <h4>Anonymous User</h4>
                    <p>${commentText}</p>
                    <div class="comment-meta">
                        <span>Just now</span>
                        <a href="#" class="reply-link">Reply</a>
                    </div>
                </div>
            `;

            existingComments.appendChild(newComment);
            textarea.value = '';
            console.log('New Comment:', commentText);
        }
    });

    // Add Law Selection Mechanism (example implementation)
    // You would replace this with actual buttons or links from your laws page
    const debugButton1 = document.createElement('button');
    debugButton1.textContent = 'Load Constitutional Law';
    debugButton1.addEventListener('click', () => loadLawExplanation('123/2024'));

    const debugButton2 = document.createElement('button');
    debugButton2.textContent = 'Load Cyber Law';
    debugButton2.addEventListener('click', () => loadLawExplanation('456/2024'));

    document.body.prepend(debugButton2);
    document.body.prepend(debugButton1);

    // Initial load (optional)
    loadLawExplanation('123/2024');
});
// login.js
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
// signup.js
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