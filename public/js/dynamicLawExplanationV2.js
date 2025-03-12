// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Constants for storage (kept for backwards compatibility)
const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';
const LAWS_STORAGE_KEY = 'legal_system_laws';
const COMMENTS_STORAGE_KEY = 'legal_system_explanation_comments';
const RATINGS_STORAGE_KEY = 'legal_system_explanation_ratings';

// Get URL parameter function (kept from original code)
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

// Load explanations from Firestore
async function loadExplanations() {
    try {
        const querySnapshot = await db.collection("lawExplanations").get();
        let explanations = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert Firestore timestamps to JavaScript Date objects
            if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
                data.datePublished = data.datePublished.toDate();
            }
            if (data.lastUpdated && data.lastUpdated instanceof firebase.firestore.Timestamp) {
                data.lastUpdated = data.lastUpdated.toDate();
            }
            
            // Add the document to the explanations array
            explanations.push({
                firestoreId: doc.id,
                ...data
            });
        });
        
        return explanations;
    } catch (error) {
        console.error("Error loading explanations from Firestore:", error);
        // Fallback to local storage if Firebase fails
        return loadExplanationsFromLocalStorage();
    }
}

// Fallback function to load from localStorage
function loadExplanationsFromLocalStorage() {
    const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
    return storedExplanations ? JSON.parse(storedExplanations) : [];
}

// Load laws from Firestore
async function loadLaws() {
    try {
        const querySnapshot = await db.collection("laws").get();
        let laws = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert Firestore timestamps if they exist
            if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
                data.datePublished = data.datePublished.toDate();
            }
            
            laws.push({
                firestoreId: doc.id,
                ...data
            });
        });
        
        return laws;
    } catch (error) {
        console.error("Error loading laws from Firestore:", error);
        // Fallback to local storage
        return loadLawsFromLocalStorage();
    }
}
// Fallback function to load laws from localStorage
function loadLawsFromLocalStorage() {
    const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
    return storedLaws ? JSON.parse(storedLaws) : [];
}

// Update explanation view count in Firestore
async function updateExplanationViewCount(explanationId) {
    try {
        // Find the explanation in Firestore
        const querySnapshot = await db.collection("lawExplanations")
            .where("id", "==", explanationId)
            .get();
            
        if (!querySnapshot.empty) {
            // Get the first matching document
            const docRef = querySnapshot.docs[0].ref;
            const explanationData = querySnapshot.docs[0].data();
            
            // Increment the view count
            const newViewCount = (explanationData.views || 0) + 1;
            
            // Update the document in Firestore
            await docRef.update({
                views: newViewCount
            });
            
            return newViewCount;
        } else {
            console.log("Explanation not found in Firestore:", explanationId);
            return null;
        }
    } catch (error) {
        console.error("Error updating view count in Firestore:", error);
        return null;
    }
}

// Load comments for a specific explanation (using localStorage as in original code)
function loadComments(explanationId) {
    const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const comments = storedComments ? JSON.parse(storedComments) : {};

    return comments[explanationId] || [];
}

// Save comments for a specific explanation (using localStorage as in original code)
function saveComments(explanationId, commentsList) {
    const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const comments = storedComments ? JSON.parse(storedComments) : {};

    comments[explanationId] = commentsList;
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
}

// Load ratings for a specific explanation (using localStorage as in original code)
function loadRatings(explanationId) {
    const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
    const ratings = storedRatings ? JSON.parse(storedRatings) : {};

    return ratings[explanationId] || { count: 0, total: 0, average: 0 };
}

// Save a new rating for an explanation (using localStorage as in original code)
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

// Format date helper function (kept from original code)
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Generate random avatar URL (kept from original code)
function getRandomAvatar() {
    const avatarId = Math.floor(Math.random() * 100);
    return `https://i.pravatar.cc/50?img=${avatarId}`;
}

// Load and display explanation details
async function loadExplanationDetails() {
    const explanationId = getUrlParameter('id');

    console.log("Looking for explanation with ID:", explanationId);

    if (!explanationId) {
        console.log("No explanation ID found in URL");
        displayNoExplanationMessage();
        return;
    }

    try {
        // Query Firestore for the explanation
        const querySnapshot = await db.collection("lawExplanations")
            .where("id", "==", explanationId)
            .get();
            
        // If not found, try with or without "#" prefix
        if (querySnapshot.empty) {
            const alternativeId = explanationId.startsWith("#") ? 
                explanationId.substring(1) : 
                "#" + explanationId;
                
            const alternativeQuerySnapshot = await db.collection("lawExplanations")
                .where("id", "==", alternativeId)
                .get();
                
            if (alternativeQuerySnapshot.empty) {
                console.log("Explanation not found in Firestore");
                displayNoExplanationMessage();
                return;
            } else {
                // Process the explanation document
                const explanation = alternativeQuerySnapshot.docs[0].data();
                // Update view count
                await updateExplanationViewCount(explanation.id);
                
                // Get related law if available
                let relatedLaw = null;
                if (explanation.relatedLawId) {
                    const lawQuerySnapshot = await db.collection("laws")
                    .where("id", "==", explanation.relatedLawId)
                    .get();
                        
                    if (!lawQuerySnapshot.empty) {
                        relatedLaw = lawQuerySnapshot.docs[0].data();
                    }
                }
                console.log("laws");
                console.log(relatedLaw);
                console.log("second");
                console.log(explanation);
                // Display the explanation details
                displayExplanationHeader(explanation, relatedLaw);
                displayExplanationContent(explanation);
                displaySourceReferences(explanation);
                displayComments(explanation.id);
                displayRatings(explanation.id);
                
                // Set up interaction event listeners
                setupEventListeners(explanation.id);
            }
        } else {
            // Process the explanation document
            const explanation = querySnapshot.docs[0].data();
            
            // Update view count
            await updateExplanationViewCount(explanation.id);
            
            // Get related law if available
            let relatedLaw = null;
            if (explanation.relatedLawId) {
                const lawQuerySnapshot = await db.collection("laws")
                    .where("id", "==", explanation.relatedLawId)
                    .get();
                    
                if (!lawQuerySnapshot.empty) {
                    relatedLaw = lawQuerySnapshot.docs[0].data();
                }
            }
            
            // Display the explanation details
            displayExplanationHeader(explanation, relatedLaw);
            displayExplanationContent(explanation);
            displaySourceReferences(explanation);
            displayComments(explanation.id);
            displayRatings(explanation.id);
            
            // Set up interaction event listeners
            setupEventListeners(explanation.id);
        }
    } catch (error) {
        console.error("Error loading explanation from Firestore:", error);
        
        // Fallback to localStorage if Firestore fails
        const explanations = loadExplanationsFromLocalStorage();
        
        // Try to find the explanation with or without "#" prefix
        let explanation = explanations.find(exp => exp.id === explanationId || 
            exp.id === "#" + explanationId || 
            exp.id.replace("#", "") === explanationId);
            
        if (!explanation) {
            displayNoExplanationMessage();
            return;
        }
        
        // Update view count in localStorage
        const explanationIndex = explanations.findIndex(exp => exp.id === explanation.id);
        if (explanationIndex !== -1) {
            explanations[explanationIndex].views = (explanations[explanationIndex].views || 0) + 1;
            localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
        }
        
        // Get related law if available
        const laws = loadLawsFromLocalStorage();
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
}

// Display message when no explanation is found (kept from original code)
function displayNoExplanationMessage() {
    const container = document.querySelector('.law-explanation-container');
    container.innerHTML = `
        <div class="no-explanation-message">
            <h2>Explanation Not Found</h2>
            <p>Sorry, the requested explanation could not be found.</p>
            <a href="../index.html" class="btn btn-primary">Return to Home</a>
        </div>
    `;
}

// Display explanation header information
function displayExplanationHeader(explanation, relatedLaw) {
    const categoryElement = document.querySelector('.law-category');
    const numberElement = document.querySelector('.law-number');
    const titleElement = document.querySelector('.law-title');

    categoryElement.textContent = explanation.category || 'Uncategorized';
    numberElement.textContent = explanation.id || 'Unknown ID';
    titleElement.textContent = explanation.title || 'Untitled Explanation';
}

// Display explanation content (kept mostly from original code with minor adjustments)
function displayExplanationContent(explanation) {
    const contentElement = document.querySelector('.explanation-content');

    // Calculate confidence level (for demo purposes: based on content length)
    const confidencePercent = Math.min(85, Math.max(60, Math.floor((explanation.content?.length || 0) / 20)));
    document.querySelector('.confidence-level').style.width = `${confidencePercent}%`;
    document.querySelector('.confidence-percentage').textContent = `${confidencePercent}%`;

    // Overview
    const overviewSection = contentElement.querySelector('.explanation-section:nth-child(1)');
    overviewSection.querySelector('p').textContent = explanation.summary || 'No summary available';

    // Key Provisions
    const keyProvisionsSection = contentElement.querySelector('.explanation-section:nth-child(2)');

    // Parse the content into key provisions (simplified for demo)
    const contentLines = (explanation.content || '').split('\n').filter(line => line.trim() !== '');

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

// Display source references (kept from original code)
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

// Display comments for the explanation (kept from original code)
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

// Format the comment timestamp (kept from original code)
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

// Display ratings information (kept from original code)
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

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Load explanation details
    loadExplanationDetails();
});