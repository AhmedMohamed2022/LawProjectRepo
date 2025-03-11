// Configuration for storage keys (fallback)
const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';
const LAWS_STORAGE_KEY = 'legal_system_laws';
const COMMENTS_STORAGE_KEY = 'legal_system_explanation_comments';
const RATINGS_STORAGE_KEY = 'legal_system_explanation_ratings';

// Load explanations from Firestore
async function loadExplanations() {
    try {
        const querySnapshot = await db.collection("lawExplanations").get();
        let explanations = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Use the document ID if no id field exists in the data
            const explanationId = data.id || doc.id;
            explanations.push({ id: explanationId, ...data });
        });
        
        return explanations;
    } catch (error) {
        console.error("Error fetching explanations from Firestore:", error);
        // Fallback to local storage if Firestore fails
        return loadLocalExplanations();
    }
}

// Fallback: Load explanations from local storage
function loadLocalExplanations() {
    const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
    return storedExplanations ? JSON.parse(storedExplanations) : [];
}

// Load a single explanation from Firestore by ID
async function loadExplanationById(explanationId) {
    try {
        // Try to find with the exact ID first
        let docRef = db.collection("lawExplanations").doc(explanationId);
        let doc = await docRef.get();

        // If not found and ID doesn't start with #, try with # prefix
        if (!doc.exists && !explanationId.startsWith('#')) {
            docRef = db.collection("lawExplanations").doc('#' + explanationId);
            doc = await docRef.get();
        }
        
        // If not found and ID starts with #, try without # prefix
        if (!doc.exists && explanationId.startsWith('#')) {
            docRef = db.collection("lawExplanations").doc(explanationId.substring(1));
            doc = await docRef.get();
        }

        if (doc.exists) {
            const data = doc.data();
            return { id: doc.id, ...data };
        } else {
            console.log("No explanation found with ID:", explanationId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching explanation from Firestore:", error);
        
        // Fallback to local storage
        const localExplanations = loadLocalExplanations();
        return localExplanations.find(exp => 
            exp.id === explanationId || 
            exp.id === '#' + explanationId || 
            exp.id.replace('#', '') === explanationId
        );
    }
}

// Load laws from Firestore
async function loadLaws() {
    try {
        const querySnapshot = await db.collection("laws").get();
        let laws = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert Firestore timestamp to JavaScript Date string
            if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
                data.datePublished = data.datePublished.toDate().toISOString();
            }
            
            // Use the correct ID from the document
            const lawId = data.id || doc.id;
            laws.push({ id: lawId, ...data });
        });
        
        return laws;
    } catch (error) {
        console.error("Error fetching laws from Firestore:", error);
        // Fallback to local storage if Firestore fails
        return loadLocalLaws();
    }
}

// Fallback: Load laws from local storage
function loadLocalLaws() {
    const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
    return storedLaws ? JSON.parse(storedLaws) : [];
}

// Load a single law from Firestore by ID
async function loadLawById(lawId) {
    try {
        // Try to find with the exact ID first
        let docRef = db.collection("laws").doc(lawId);
        let doc = await docRef.get();

        // If not found and ID doesn't start with #, try with # prefix
        if (!doc.exists && !lawId.startsWith('#')) {
            docRef = db.collection("laws").doc('#' + lawId);
            doc = await docRef.get();
        }
        
        // If not found and ID starts with #, try without # prefix
        if (!doc.exists && lawId.startsWith('#')) {
            docRef = db.collection("laws").doc(lawId.substring(1));
            doc = await docRef.get();
        }

        if (doc.exists) {
            const data = doc.data();
            
            // Convert Firestore timestamp to JavaScript Date string
            if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
                data.datePublished = data.datePublished.toDate().toISOString();
            }
            
            return { id: doc.id, ...data };
        } else {
            console.log("No law found with ID:", lawId);
            return null;
        }
    } catch (error) {
        console.error("Error fetching law from Firestore:", error);
        
        // Fallback to local storage
        const localLaws = loadLocalLaws();
        return localLaws.find(law => 
            law.id === lawId || 
            law.id === '#' + lawId || 
            law.id.replace('#', '') === lawId
        );
    }
}

// Load comments for a specific explanation from Firestore
async function loadComments(explanationId) {
    try {
        const querySnapshot = await db.collection("explanationComments")
            .where("explanationId", "==", explanationId)
            .orderBy("timestamp", "desc")
            .get();
        
        let comments = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert Firestore timestamp to JavaScript Date
            if (data.timestamp && data.timestamp instanceof firebase.firestore.Timestamp) {
                data.timestamp = data.timestamp.toDate().toISOString();
            }
            
            comments.push({ id: doc.id, ...data });
        });
        
        return comments;
    } catch (error) {
        console.error("Error fetching comments from Firestore:", error);
        
        // Fallback to local storage
        const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
        const comments = storedComments ? JSON.parse(storedComments) : {};
        return comments[explanationId] || [];
    }
}

// Save a new comment to Firestore
async function saveComment(explanationId, commentData) {
    try {
        // Convert JavaScript Date to Firestore timestamp
        if (commentData.timestamp) {
            commentData.timestamp = firebase.firestore.Timestamp.fromDate(new Date(commentData.timestamp));
        }
        
        // Add explanationId to the comment data
        commentData.explanationId = explanationId;
        
        // Add to Firestore
        const docRef = await db.collection("explanationComments").add(commentData);
        console.log("Comment added with ID:", docRef.id);
        
        // Return the comment with the new ID
        return { id: docRef.id, ...commentData };
    } catch (error) {
        console.error("Error adding comment to Firestore:", error);
        
        // Fallback to local storage
        const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
        const comments = storedComments ? JSON.parse(storedComments) : {};
        
        if (!comments[explanationId]) {
            comments[explanationId] = [];
        }
        
        // Convert Firestore timestamp back to ISO string for local storage
        if (commentData.timestamp && commentData.timestamp instanceof firebase.firestore.Timestamp) {
            commentData.timestamp = commentData.timestamp.toDate().toISOString();
        }
        
        // Generate an ID for local storage
        const newComment = { id: Date.now().toString(), ...commentData };
        comments[explanationId].push(newComment);
        
        localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
        return newComment;
    }
}

// Load ratings for a specific explanation from Firestore
async function loadRatings(explanationId) {
    try {
        const docRef = db.collection("explanationRatings").doc(explanationId);
        const doc = await docRef.get();
        
        if (doc.exists) {
            return doc.data();
        } else {
            return { count: 0, total: 0, average: 0 };
        }
    } catch (error) {
        console.error("Error fetching ratings from Firestore:", error);
        
        // Fallback to local storage
        const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
        const ratings = storedRatings ? JSON.parse(storedRatings) : {};
        return ratings[explanationId] || { count: 0, total: 0, average: 0 };
    }
}

// Save a new rating to Firestore
async function saveRating(explanationId, ratingValue) {
    try {
        const ratingRef = db.collection("explanationRatings").doc(explanationId);
        const doc = await ratingRef.get();
        
        let ratingData;
        
        if (doc.exists) {
            // Update existing rating
            ratingData = doc.data();
            ratingData.count += 1;
            ratingData.total += parseInt(ratingValue);
            ratingData.average = ratingData.total / ratingData.count;
            
            await ratingRef.update(ratingData);
        } else {
            // Create new rating
            ratingData = { 
                count: 1, 
                total: parseInt(ratingValue), 
                average: parseInt(ratingValue) 
            };
            
            await ratingRef.set(ratingData);
        }
        
        // Also update individual rating entry to track who rated what (if needed)
        await db.collection("userRatings").add({
            explanationId: explanationId,
            rating: parseInt(ratingValue),
            timestamp: firebase.firestore.Timestamp.fromDate(new Date())
        });
        
        return ratingData;
    } catch (error) {
        console.error("Error saving rating to Firestore:", error);
        
        // Fallback to local storage
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
}

// Update explanation view count in Firestore
async function updateExplanationViewCount(explanationId) {
    try {
        const explanationRef = db.collection("lawExplanations").doc(explanationId);
        
        // Use transaction to safely increment the view count
        await db.runTransaction(async (transaction) => {
            const doc = await transaction.get(explanationRef);
            
            if (!doc.exists) {
                throw new Error("Explanation document does not exist!");
            }
            
            const newViews = (doc.data().views || 0) + 1;
            transaction.update(explanationRef, { views: newViews });
        });
        
        console.log("Explanation view count updated successfully");
    } catch (error) {
        console.error("Error updating explanation view count in Firestore:", error);
        
        // Fallback to local storage
        const explanations = loadLocalExplanations();
        const explanationIndex = explanations.findIndex(explanation => explanation.id === explanationId);

        if (explanationIndex !== -1) {
            explanations[explanationIndex].views = (explanations[explanationIndex].views || 0) + 1;
            localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
        }
    }
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

// Generate random avatar URL
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

    // Get explanation from Firestore
    const explanation = await loadExplanationById(explanationId);
    console.log("Found explanation:", explanation);

    if (!explanation) {
        displayNoExplanationMessage();
        return;
    }

    // Update view count
    await updateExplanationViewCount(explanation.id);

    // Get related law if available
    const relatedLaw = explanation.relatedLawId ? 
        await loadLawById(explanation.relatedLawId) : null;

    // Display the explanation details
    displayExplanationHeader(explanation, relatedLaw);
    displayExplanationContent(explanation);
    displaySourceReferences(explanation);
    await displayComments(explanation.id);
    await displayRatings(explanation.id);

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

    categoryElement.textContent = explanation.category || "General";
    numberElement.textContent = explanation.id;
    titleElement.textContent = explanation.title;

    // Set law number if there's a related law
    if (relatedLaw) {
        numberElement.textContent = `${explanation.id} (Related to Law: ${relatedLaw.id})`;
    }
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
    if (overviewSection) {
        overviewSection.querySelector('p').textContent = explanation.summary;
    }

    // Key Provisions
    const keyProvisionsSection = contentElement.querySelector('.explanation-section:nth-child(2)');
    if (keyProvisionsSection) {
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

        const ulElement = keyProvisionsSection.querySelector('ul');
        if (ulElement) {
            ulElement.innerHTML = keyProvisionsHTML;
        }
    }

    // Practical Implications
    const implicationsSection = contentElement.querySelector('.explanation-section:nth-child(3)');
    if (implicationsSection) {
        implicationsSection.querySelector('p').textContent = explanation.summary + " This explanation is designed to assist in understanding the law and its application.";
    }
}

// Display source references
function displaySourceReferences(explanation) {
    const referencesElement = document.querySelector('.ai-source-references ul');
    if (!referencesElement) return;

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
async function displayComments(explanationId) {
    const commentsContainer = document.querySelector('.existing-comments');
    if (!commentsContainer) return;
    
    const comments = await loadComments(explanationId);

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsContainer.innerHTML = '';

    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <img src="${comment.avatar || getRandomAvatar()}" alt="User Avatar" class="user-avatar">
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
async function displayRatings(explanationId) {
    const starRating = document.querySelector('.star-rating');
    if (!starRating) return;
    
    const ratingData = await loadRatings(explanationId);

    // Reset all stars
    const starInputs = starRating.querySelectorAll('input');
    starInputs.forEach(input => {
        input.checked = false;
    });

    // Remove any existing rating info
    const existingRatingInfo = starRating.querySelector('.rating-info');
    if (existingRatingInfo) {
        existingRatingInfo.remove();
    }

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
        input.addEventListener('change', async function () {
            const ratingValue = this.value;
            await saveRating(explanationId, ratingValue);

            // Show thank you message
            const ratingSection = document.querySelector('.explanation-rating');
            const thankYouMsg = document.createElement('div');
            thankYouMsg.className = 'thank-you-message';
            thankYouMsg.textContent = 'Thank you for your rating!';
            ratingSection.appendChild(thankYouMsg);

            // Remove message after 3 seconds
            setTimeout(async () => {
                thankYouMsg.remove();
                await displayRatings(explanationId); // Refresh ratings display
            }, 3000);
        });
    });

    // Comment submission
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const commentText = this.querySelector('textarea').value.trim();
            if (!commentText) return;

            // Generate a random username (for demo)
            const usernames = ['Legal Eagle', 'Justice Seeker', 'Law Student', 'Curious Citizen', 'Policy Expert'];
            const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];

            // Add comment
            const newComment = {
                username: randomUsername,
                text: commentText,
                timestamp: new Date().toISOString(),
                avatar: getRandomAvatar()
            };

            // Save the comment to Firestore
            await saveComment(explanationId, newComment);

            // Reset form and refresh comments
            this.reset();
            await displayComments(explanationId);
        });
    }

    // Reply to comment functionality
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('reply-link')) {
            e.preventDefault();
            const commentId = e.target.getAttribute('data-comment-id');

            // Focus comment textarea and add reply prefix
            const textarea = document.querySelector('.comment-form textarea');
            if (textarea) {
                textarea.focus();
                textarea.value = `@Reply to comment: `;
            }
        }
    });
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', async function () {
    // Check for Firebase initialization
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error("Firebase not initialized. Make sure to include and initialize Firebase before using these functions.");
        alert("Error: Firebase is not initialized. Some features may not work properly.");
    }
    
    try {
        // Initialize test data if needed
        await initializeTestData();
        
        // Load explanation details
        await loadExplanationDetails();
    } catch (error) {
        console.error("Error initializing explanation page:", error);
        alert("An error occurred while loading the explanation. Please try again later.");
    }
});