// Configuration for storage
const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';
const LAWS_STORAGE_KEY = 'legal_system_laws';
const COMMENTS_STORAGE_KEY = 'legal_system_explanation_comments';
const RATINGS_STORAGE_KEY = 'legal_system_explanation_ratings';

// Load explanations from local storage
function loadExplanations() {
    const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
    return storedExplanations ? JSON.parse(storedExplanations) : [];
}


// Initialize test data if none exists
function initializeTestData() {
    // Check if data already exists
    const laws = loadLaws();
    const explanations = loadExplanations();

    if (laws.length === 0) {
        // Create sample law data
        const sampleLaws = [
            {
                id: "L001",
                title: "Sample Law Title",
                category: "criminal",
                description: "This is a sample law description.",
                datePublished: new Date().toISOString(),
                views: 0,
                tags: ["tag1", "tag2"],
                status: "active",
                content: "Section 1: Sample content\nSection 2: More sample content"
            }
        ];
        localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(sampleLaws));
    }

    if (explanations.length === 0) {
        // Create sample explanation data
        const sampleExplanations = [
            {
                id: "E001",
                title: "Explanation of Sample Law",
                category: "criminal",
                relatedLawId: "L001",
                summary: "This explains the sample law in simple terms.",
                content: "Point 1: Important detail\nPoint 2: Another critical aspect\nPoint 3: Final consideration",
                views: 0,
                tags: ["reference1", "reference2"]
            }
        ];
        localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(sampleExplanations));
    }
}

// Load laws from local storage
function loadLaws() {
    const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
    return storedLaws ? JSON.parse(storedLaws) : [];
}

console.log("explanations");
console.log(loadExplanations());
console.log("laws");
console.log(loadLaws());

// Load comments for a specific explanation
function loadComments(explanationId) {
    const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const comments = storedComments ? JSON.parse(storedComments) : {};

    return comments[explanationId] || [];
}

// Save comments for a specific explanation
function saveComments(explanationId, commentsList) {
    const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const comments = storedComments ? JSON.parse(storedComments) : {};

    comments[explanationId] = commentsList;
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
}

// Load ratings for a specific explanation
function loadRatings(explanationId) {
    const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
    const ratings = storedRatings ? JSON.parse(storedRatings) : {};

    return ratings[explanationId] || { count: 0, total: 0, average: 0 };
}

// Save a new rating for an explanation
function saveRating(explanationId, ratingValue) {
    const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
    const ratings = storedRatings ? JSON.parse(storedRatings) : {};

    if (!ratings[explanationId]) {
        ratings[explanationId] = { count: 0, total: 0, average: 0 };
    }

    ratings[explanationId].count += 1;
    ratings[explanationId].total += parseInt(ratingValue);
    ratings[explanationId].average = ratings[explanationId].total / ratings[explanationId].count;

    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
    return ratings[explanationId];
}

// Format date helper function
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Get URL parameters helper function

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    let param = urlParams.get(name);

    // If not found in search params, check if the hash might contain it
    if (!param && window.location.hash) {
        // Try to parse hash as query string
        if (window.location.hash.includes('=')) {
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            param = hashParams.get(name);
        } else {
            // If hash is just a value, return it
            param = window.location.hash.substring(1);
        }
    }

    return param;
}


console.log("Full URL:", window.location.href);
console.log("Search Params:", window.location.search);
console.log("Hash Params:", window.location.hash);
console.log("Extracted ID:", getUrlParameter("id"));
console.log("Explanations:", loadExplanations());

const explanations = JSON.parse(localStorage.getItem('legal_system_explanations')) || [];
const selectedLawId = "#LW-001";  // Example
const explanation = explanations.find(exp => exp.relatedLawId === selectedLawId);
console.log(explanation);  // Should not be undefined

// Test it


// console.log("ID Parameter:", getUrlParameter("id"));

// console.log(getUrlParameter("id"));

// Update explanation view count
function updateExplanationViewCount(explanationId) {
    const explanations = loadExplanations();
    const explanationIndex = explanations.findIndex(explanation => explanation.id === explanationId);

    console.log("here");
    console.log(explanations[0]);
    if (explanationIndex !== -1) {
        explanations[explanationIndex].views += 1;
        localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
    }
}

// Generate random avatar URL
function getRandomAvatar() {
    const avatarId = Math.floor(Math.random() * 100);
    return `https://i.pravatar.cc/50?img=${avatarId}`;
}

console.log("wwerwrew");
console.log(getUrlParameter('id'));
// // Load and display explanation details
function loadExplanationDetails() {
    const explanationId = getUrlParameter('id');

    console.log("Looking for explanation with ID:", explanationId);

    if (!explanationId) {
        console.log("No explanation ID found in URL");
        displayNoExplanationMessage();
        return;
    }

    const explanations = loadExplanations();
    console.log("All explanations:", explanations);

    // Try to find the explanation with or without "#" prefix
    let explanation = explanations.find(exp => exp.id === explanationId ||
        exp.id === "#" + explanationId ||
        exp.id.replace("#", "") === explanationId);

    console.log("Found explanation:", explanation);

    if (!explanation) {
        displayNoExplanationMessage();
        return;
    }

    // Update view count
    updateExplanationViewCount(explanation.id);

    // Get related law if available
    const laws = loadLaws();
    const relatedLaw = laws.find(law => law.id === explanation.relatedLawId);

    // Display the explanation details
    displayExplanationHeader(explanation, relatedLaw);
    displayExplanationContent(explanation);
    displaySourceReferences(explanation);
    displayComments(explanation.id);
    displayRatings(explanation.id);

    // Set up interaction event listeners
    setupEventListeners(explanation.id);
}
// Display message when no explanation is found
function displayNoExplanationMessage() {
    const container = document.querySelector('.law-explanation-container');
    container.innerHTML = `
        <div class="no-explanation-message">
            <h2>Explanation Not Found</h2>
            <p>Sorry, the requested explanation could not be found.</p>
            <a href="index.html" class="btn btn-primary">Return to Home</a>
        </div>
    `;
}

// Display explanation header information
function displayExplanationHeader(explanation, relatedLaw) {
    const categoryElement = document.querySelector('.law-category');
    const numberElement = document.querySelector('.law-number');
    const titleElement = document.querySelector('.law-title');

    categoryElement.textContent = explanation.category;
    numberElement.textContent = explanation.id;
    titleElement.textContent = explanation.title;

    // Set law number if there's a related law
    // if (relatedLaw) {
    //     numberElement.textContent = `${explanation.id} (Related to Law: ${relatedLaw.id})`;
    // }
}

// Display explanation content
function displayExplanationContent(explanation) {
    const contentElement = document.querySelector('.explanation-content');

    // Calculate confidence level (for demo purposes: based on content length)
    const confidencePercent = Math.min(85, Math.max(60, Math.floor(explanation.content.length / 20)));
    document.querySelector('.confidence-level').style.width = `${confidencePercent}%`;
    document.querySelector('.confidence-percentage').textContent = `${confidencePercent}%`;

    // Overview
    const overviewSection = contentElement.querySelector('.explanation-section:nth-child(1)');
    overviewSection.querySelector('p').textContent = explanation.summary;

    // Key Provisions
    const keyProvisionsSection = contentElement.querySelector('.explanation-section:nth-child(2)');

    // Parse the content into key provisions (simplified for demo)
    const contentLines = explanation.content.split('\n').filter(line => line.trim() !== '');

    let keyProvisionsHTML = '<ul>';
    for (let i = 0; i < Math.min(contentLines.length, 130); i++) {
        const lineTitle = contentLines[i].split(':')[0] || `Key Point ${i + 1}`;
        const lineContent = contentLines[i].split(':')[1] || contentLines[i];

        keyProvisionsHTML += `
            <li>
                <strong>${lineTitle}:</strong>
                <p>${lineContent.trim()}</p>
            </li>
        `;
    }
    keyProvisionsHTML += '</ul>';

    keyProvisionsSection.querySelector('ul').innerHTML = keyProvisionsHTML;

    // Practical Implications
    const implicationsSection = contentElement.querySelector('.explanation-section:nth-child(3)');
    implicationsSection.querySelector('p').textContent = explanation.summary + " This explanation is designed to assist in understanding the law and its application.";
}

// Display source references
function displaySourceReferences(explanation) {
    const referencesElement = document.querySelector('.ai-source-references ul');

    // Use tags as sources
    if (explanation.tags && explanation.tags.length > 0) {
        referencesElement.innerHTML = '';
        explanation.tags.forEach(tag => {
            const listItem = document.createElement('li');
            listItem.textContent = tag;
            referencesElement.appendChild(listItem);
        });
    } else {
        // Default references
        referencesElement.innerHTML = `
            <li>Legal Code Reference</li>
            <li>Judicial Precedents</li>
            <li>Academic Legal Commentary</li>
        `;
    }
}

// Display comments for the explanation
function displayComments(explanationId) {
    const commentsContainer = document.querySelector('.existing-comments');
    const comments = loadComments(explanationId);

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsContainer.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <img src="${comment.avatar}" alt="User Avatar" class="user-avatar">
            <div class="comment-content">
                <h4>${comment.username}</h4>
                <p>${comment.text}</p>
                <div class="comment-meta">
                    <span>${formatCommentTime(comment.timestamp)}</span>
                    <a href="#" class="reply-link" data-comment-id="${comment.id}">Reply</a>
                </div>
            </div>
        `;

        commentsContainer.appendChild(commentElement);
    });
}

// Format the comment timestamp
function formatCommentTime(timestamp) {
    const commentDate = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
        return formatDate(timestamp);
    }
}

// Display ratings information
function displayRatings(explanationId) {
    const ratingData = loadRatings(explanationId);
    const starRating = document.querySelector('.star-rating');

    // Reset all stars
    const starInputs = starRating.querySelectorAll('input');
    starInputs.forEach(input => {
        input.checked = false;
    });

    // If there are ratings, show the average
    if (ratingData.count > 0) {
        const averageRating = Math.round(ratingData.average);
        const ratingInput = document.getElementById(`star${averageRating}`);
        if (ratingInput) {
            ratingInput.checked = true;
        }

        // Add rating count info
        const ratingInfo = document.createElement('div');
        ratingInfo.className = 'rating-info';
        ratingInfo.textContent = `(${ratingData.count} rating${ratingData.count === 1 ? '' : 's'})`;
        starRating.appendChild(ratingInfo);
    }
}

// Set up event listeners for user interactions
function setupEventListeners(explanationId) {
    // Rating submission
    const starInputs = document.querySelectorAll('.star-rating input');
    starInputs.forEach(input => {
        input.addEventListener('change', function () {
            const ratingValue = this.value;
            saveRating(explanationId, ratingValue);

            // Show thank you message
            const ratingSection = document.querySelector('.explanation-rating');
            const thankYouMsg = document.createElement('div');
            thankYouMsg.className = 'thank-you-message';
            thankYouMsg.textContent = 'Thank you for your rating!';
            ratingSection.appendChild(thankYouMsg);

            // Remove message after 3 seconds
            setTimeout(() => {
                thankYouMsg.remove();
                displayRatings(explanationId); // Refresh ratings display
            }, 3000);
        });
    });

    // Comment submission
    const commentForm = document.querySelector('.comment-form');
    commentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const commentText = this.querySelector('textarea').value.trim();
        if (!commentText) return;

        // Generate a random username (for demo)
        const usernames = ['Legal Eagle', 'Justice Seeker', 'Law Student', 'Curious Citizen', 'Policy Expert'];
        const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];

        // Add comment
        const comments = loadComments(explanationId);
        const newComment = {
            id: Date.now().toString(),
            username: randomUsername,
            text: commentText,
            timestamp: new Date().toISOString(),
            avatar: getRandomAvatar()
        };

        comments.push(newComment);
        saveComments(explanationId, comments);

        // Reset form and refresh comments
        this.reset();
        displayComments(explanationId);
    });

    // Reply to comment (for future implementation)
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('reply-link')) {
            e.preventDefault();
            const commentId = e.target.getAttribute('data-comment-id');

            // Focus comment textarea and add reply prefix
            const textarea = document.querySelector('.comment-form textarea');
            textarea.focus();
            textarea.value = `@Reply to comment: `;
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize test data
    initializeTestData();

    // Load explanation details
    loadExplanationDetails();
});

