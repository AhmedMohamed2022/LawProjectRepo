// const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';
// const LAWS_STORAGE_KEY = 'legal_system_laws';
// const COMMENTS_STORAGE_KEY = 'legal_system_explanation_comments';
// const RATINGS_STORAGE_KEY = 'legal_system_explanation_ratings';
// // document.addEventListener('DOMContentLoaded', function() {
// //     setTimeout(async function() {
// //         try {
// //             await loadExplanationDetails();
// //         } catch (error) {
// //             console.error("Error initializing explanation page:", error);
// //         }
// //     }, 500); // 500ms delay
// // });
// // Initialize db variable
// let db;

// // const db = firebase.firestore();

// console.log(firebase)
// // Check if Firebase is available and set up db accordingly
// if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
//     db = firebase.firestore();
//     console.log("Firebase initialized successfully");
// } else {
//     console.warn("Firebase not available - using local storage fallback mode only");
//     // Create a mock db object that throws errors to trigger fallbacks
//     db = {
//         collection: () => ({
//             doc: () => ({
//                 get: () => Promise.reject(new Error("Firebase not available")),
//                 set: () => Promise.reject(new Error("Firebase not available")),
//                 update: () => Promise.reject(new Error("Firebase not available"))
//             }),
//             where: () => ({
//                 orderBy: () => ({
//                     get: () => Promise.reject(new Error("Firebase not available"))
//                 })
//             }),
//             get: () => Promise.reject(new Error("Firebase not available")),
//             add: () => Promise.reject(new Error("Firebase not available"))
//         }),
//         runTransaction: () => Promise.reject(new Error("Firebase not available"))
//     };
// }
// // Load explanations from Firestore

// // Load explanations from Firestore
// async function loadExplanations() {
//     try {
//         const querySnapshot = await db.collection("lawExplanations").get();
//         let explanations = [];
        
//         console.log("Number of explanations found:", querySnapshot.size);
        
//         querySnapshot.forEach((doc) => {
//             const data = doc.data();
            
//             // Log each document ID and data for debugging
//             console.log("Found document with ID:", doc.id);
//             console.log("Document data:", data);
            
//             // Use the document ID if no id field exists in the data
//             const explanationId = data.id || doc.id;
//             explanations.push({ id: explanationId, ...data });
//         });
        
//         return explanations;
//     } catch (error) {
//         console.error("Error fetching explanations from Firestore:", error);
//         // Fallback to local storage if Firestore fails
//         return loadLocalExplanations();
//     }
// }
// async function checkFirestoreAccess() {
//     try {
//         const lawsTest = await db.collection("laws").limit(1).get();
//         console.log("Laws collection access test:", lawsTest.empty ? "No documents (but access OK)" : "Access OK");
        
//         const explanationsTest = await db.collection("lawExplanations").limit(1).get();
//         console.log("LawExplanations collection access test:", explanationsTest.empty ? "No documents (but access OK)" : "Access OK");
//     } catch (error) {
//         console.error("Firestore access test failed:", error);
//     }
// }
// document.addEventListener('DOMContentLoaded', async function () {
//     // Check for Firebase initialization
//     if (typeof firebase === 'undefined' || !firebase.apps.length) {
//         console.error("Firebase not initialized. Make sure to include and initialize Firebase before using these functions.");
//         alert("Error: Firebase is not initialized. Some features may not work properly.");
//     }
    
//     try {
//         // Test Firestore access
//         await checkFirestoreAccess();
        
//         // Load explanation details
//         await loadExplanationDetails();
//     } catch (error) {
//         console.error("Error initializing explanation page:", error);
//         alert("An error occurred while loading the explanation. Please try again later.");
//     }
// });
// // Fallback: Load explanations from local storage
// function loadLocalExplanations() {
//     const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
//     return storedExplanations ? JSON.parse(storedExplanations) : [];
// }

// // Load a single explanation from Firestore by ID

// async function loadExplanationById(explanationId) {
//     console.log("Looking for explanation with ID:", explanationId);
    
//     try {
//         // Try different ID formats
//         const possibleIds = [
//             explanationId,
//             explanationId.startsWith('#') ? explanationId : '#' + explanationId,
//             explanationId.startsWith('#') ? explanationId.substring(1) : explanationId
//         ];
        
//         // First, try direct document lookups
//         for (const id of possibleIds) {
//             console.log("Trying direct lookup with ID:", id);
//             const docRef = db.collection("lawExplanations").doc(id);
//             const doc = await docRef.get();
            
//             if (doc.exists) {
//                 console.log("Found document via direct lookup:", id);
//                 return { id: doc.id, ...doc.data() };
//             }
//         }
        
//         // If direct lookup fails, try querying the "id" field
//         console.log("Direct lookup failed, trying query on 'id' field");
//         const querySnapshot = await db.collection("lawExplanations")
//             .where("id", "in", possibleIds)
//             .get();
        
//         if (!querySnapshot.empty) {
//             const doc = querySnapshot.docs[0];
//             console.log("Found via query with field id:", doc.id);
//             return { id: doc.id, ...doc.data() };
//         }
        
//         console.log("No explanation found with any ID format");
//         return null;
//     } catch (error) {
//         console.error("Error fetching explanation from Firestore:", error);
//         return loadLocalExplanations().find(exp => 
//             exp.id === explanationId || 
//             exp.id === '#' + explanationId || 
//             exp.id.replace('#', '') === explanationId
//         );
//     }
// }
// async function checkFirestorePermissions() {
//     try {
//         // Try to read a single document from each collection
//         const lawTest = await db.collection("laws").limit(1).get();
//         console.log("Laws collection read access:", lawTest.empty ? "No docs but has access" : "Access OK");
        
//         const explanationTest = await db.collection("lawExplanations").limit(1).get();
//         console.log("lawExplanations collection read access:", 
//                     explanationTest.empty ? "No docs but has access" : "Access OK");
//     } catch (error) {
//         console.error("Permission error:", error);
//     }
// }
// // At the beginning of loadExplanationDetails function
// console.log("Starting to load explanation details");
// console.log("Current URL:", window.location.href);
// console.log("URL parameters:", new URLSearchParams(window.location.search).toString());
// console.log("Hash:", window.location.hash);

// // Call this function on page load
// checkFirestorePermissions();
// // Add this to your loadExplanationDetails function
// async function tryFindingByFieldId() {
//     console.log("Trying to find explanation by 'id' field instead of document ID...");
//     try {
//         const querySnapshot = await db.collection("lawExplanations")
//             .where("id", "in", ["EXP-006", "#EXP-006"])
//             .get();
        
//         console.log("Query results count:", querySnapshot.size);
        
//         if (!querySnapshot.empty) {
//             const doc = querySnapshot.docs[0];
//             console.log("Found explanation by field id:", doc.id);
//             console.log("Document data:", doc.data());
//             return { id: doc.id, ...doc.data() };
//         }
//         return null;
//     } catch (error) {
//         console.error("Error in field id query:", error);
//         return null;
//     }
// }

// // Then call this after your main lookup if it returns null
// // if (!explanation) {
//     explanation = await tryFindingByFieldId();
//     console.log("Search by field result:", explanation);
// // }

// // Load laws from Firestore
// async function loadLaws() {
//     try {
//         const querySnapshot = await db.collection("laws").get();
//         let laws = [];
        
//         querySnapshot.forEach((doc) => {
//             const data = doc.data();
            
//             // Convert Firestore timestamp to JavaScript Date string
//             if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
//                 data.datePublished = data.datePublished.toDate().toISOString();
//             }
            
//             // Use the correct ID from the document
//             const lawId = data.id || doc.id;
//             laws.push({ id: lawId, ...data });
//         });
        
//         return laws;
//     } catch (error) {
//         console.error("Error fetching laws from Firestore:", error);
//         // Fallback to local storage if Firestore fails
//         return loadLocalLaws();
//     }
// }

// // Fallback: Load laws from local storage
// function loadLocalLaws() {
//     const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
//     return storedLaws ? JSON.parse(storedLaws) : [];
// }

// // Load a single law from Firestore by ID
// async function loadLawById(lawId) {
//     try {
//         // Try to find with the exact ID first
//         let docRef = db.collection("laws").doc(lawId);
//         let doc = await docRef.get();

//         // If not found and ID doesn't start with #, try with # prefix
//         if (!doc.exists && !lawId.startsWith('#')) {
//             docRef = db.collection("laws").doc('#' + lawId);
//             doc = await docRef.get();
//         }
        
//         // If not found and ID starts with #, try without # prefix
//         if (!doc.exists && lawId.startsWith('#')) {
//             docRef = db.collection("laws").doc(lawId.substring(1));
//             doc = await docRef.get();
//         }

//         if (doc.exists) {
//             const data = doc.data();
            
//             // Convert Firestore timestamp to JavaScript Date string
//             if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
//                 data.datePublished = data.datePublished.toDate().toISOString();
//             }
            
//             return { id: doc.id, ...data };
//         } else {
//             console.log("No law found with ID:", lawId);
//             return null;
//         }
//     } catch (error) {
//         console.error("Error fetching law from Firestore:", error);
        
//         // Fallback to local storage
//         const localLaws = loadLocalLaws();
//         return localLaws.find(law => 
//             law.id === lawId || 
//             law.id === '#' + lawId || 
//             law.id.replace('#', '') === lawId
//         );
//     }
// }

// // Load comments for a specific explanation from Firestore
// async function loadComments(explanationId) {
//     try {
//         const querySnapshot = await db.collection("explanationComments")
//             .where("explanationId", "==", explanationId)
//             .orderBy("timestamp", "desc")
//             .get();
        
//         let comments = [];
//         querySnapshot.forEach((doc) => {
//             const data = doc.data();
            
//             // Convert Firestore timestamp to JavaScript Date
//             if (data.timestamp && data.timestamp instanceof firebase.firestore.Timestamp) {
//                 data.timestamp = data.timestamp.toDate().toISOString();
//             }
            
//             comments.push({ id: doc.id, ...data });
//         });
        
//         return comments;
//     } catch (error) {
//         console.error("Error fetching comments from Firestore:", error);
        
//         // Fallback to local storage
//         const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
//         const comments = storedComments ? JSON.parse(storedComments) : {};
//         return comments[explanationId] || [];
//     }
// }

// // Save a new comment to Firestore
// async function saveComment(explanationId, commentData) {
//     try {
//         // Convert JavaScript Date to Firestore timestamp
//         if (commentData.timestamp) {
//             commentData.timestamp = firebase.firestore.Timestamp.fromDate(new Date(commentData.timestamp));
//         }
        
//         // Add explanationId to the comment data
//         commentData.explanationId = explanationId;
        
//         // Add to Firestore
//         const docRef = await db.collection("explanationComments").add(commentData);
//         console.log("Comment added with ID:", docRef.id);
        
//         // Return the comment with the new ID
//         return { id: docRef.id, ...commentData };
//     } catch (error) {
//         console.error("Error adding comment to Firestore:", error);
        
//         // Fallback to local storage
//         const storedComments = localStorage.getItem(COMMENTS_STORAGE_KEY);
//         const comments = storedComments ? JSON.parse(storedComments) : {};
        
//         if (!comments[explanationId]) {
//             comments[explanationId] = [];
//         }
        
//         // Convert Firestore timestamp back to ISO string for local storage
//         if (commentData.timestamp && commentData.timestamp instanceof firebase.firestore.Timestamp) {
//             commentData.timestamp = commentData.timestamp.toDate().toISOString();
//         }
        
//         // Generate an ID for local storage
//         const newComment = { id: Date.now().toString(), ...commentData };
//         comments[explanationId].push(newComment);
        
//         localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
//         return newComment;
//     }
// }

// // Load ratings for a specific explanation from Firestore
// async function loadRatings(explanationId) {
//     try {
//         const docRef = db.collection("explanationRatings").doc(explanationId);
//         const doc = await docRef.get();
        
//         if (doc.exists) {
//             return doc.data();
//         } else {
//             return { count: 0, total: 0, average: 0 };
//         }
//     } catch (error) {
//         console.error("Error fetching ratings from Firestore:", error);
        
//         // Fallback to local storage
//         const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
//         const ratings = storedRatings ? JSON.parse(storedRatings) : {};
//         return ratings[explanationId] || { count: 0, total: 0, average: 0 };
//     }
// }

// // Save a new rating to Firestore
// async function saveRating(explanationId, ratingValue) {
//     try {
//         const ratingRef = db.collection("explanationRatings").doc(explanationId);
//         const doc = await ratingRef.get();
        
//         let ratingData;
        
//         if (doc.exists) {
//             // Update existing rating
//             ratingData = doc.data();
//             ratingData.count += 1;
//             ratingData.total += parseInt(ratingValue);
//             ratingData.average = ratingData.total / ratingData.count;
            
//             await ratingRef.update(ratingData);
//         } else {
//             // Create new rating
//             ratingData = { 
//                 count: 1, 
//                 total: parseInt(ratingValue), 
//                 average: parseInt(ratingValue) 
//             };
            
//             await ratingRef.set(ratingData);
//         }
        
//         // Also update individual rating entry to track who rated what (if needed)
//         await db.collection("userRatings").add({
//             explanationId: explanationId,
//             rating: parseInt(ratingValue),
//             timestamp: firebase.firestore.Timestamp.fromDate(new Date())
//         });
        
//         return ratingData;
//     } catch (error) {
//         console.error("Error saving rating to Firestore:", error);
        
//         // Fallback to local storage
//         const storedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
//         const ratings = storedRatings ? JSON.parse(storedRatings) : {};

//         if (!ratings[explanationId]) {
//             ratings[explanationId] = { count: 0, total: 0, average: 0 };
//         }

//         ratings[explanationId].count += 1;
//         ratings[explanationId].total += parseInt(ratingValue);
//         ratings[explanationId].average = ratings[explanationId].total / ratings[explanationId].count;

//         localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
//         return ratings[explanationId];
//     }
// }

// // Update explanation view count in Firestore
// async function updateExplanationViewCount(explanationId) {
//     try {
//         const explanationRef = db.collection("lawExplanations").doc(explanationId);
        
//         // Use transaction to safely increment the view count
//         await db.runTransaction(async (transaction) => {
//             const doc = await transaction.get(explanationRef);
            
//             if (!doc.exists) {
//                 throw new Error("Explanation document does not exist!");
//             }
            
//             const newViews = (doc.data().views || 0) + 1;
//             transaction.update(explanationRef, { views: newViews });
//         });
        
//         console.log("Explanation view count updated successfully");
//     } catch (error) {
//         console.error("Error updating explanation view count in Firestore:", error);
        
//         // Fallback to local storage
//         const explanations = loadLocalExplanations();
//         const explanationIndex = explanations.findIndex(explanation => explanation.id === explanationId);

//         if (explanationIndex !== -1) {
//             explanations[explanationIndex].views = (explanations[explanationIndex].views || 0) + 1;
//             localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
//         }
//     }
// }

// // Format date helper function
// function formatDate(dateString) {
//     const date = new Date(dateString);
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
// }

// // Get URL parameters helper function

// function getUrlParameter(name) {
//     const urlParams = new URLSearchParams(window.location.search);
//     let param = urlParams.get(name);

//     // If not found in search params, check if the hash might contain it
//     if (!param && window.location.hash) {
//         // Try to parse hash as query string
//         if (window.location.hash.includes('=')) {
//             const hashParams = new URLSearchParams(window.location.hash.substring(1));
//             param = hashParams.get(name);
//         } else {
//             // If hash is just a value, return it
//             param = window.location.hash.substring(1);
//         }
//     }

//     // For testing: use a default ID when none is provided
//     if (!param && name === 'id') {
//         console.log("Using default explanation ID for testing");
//         return "#EXP-006"; // Use an ID that exists in your lawExplanations collection
//     }

//     return param;
// }
// // Generate random avatar URL

// function getRandomAvatar() {
//     const avatarId = Math.floor(Math.random() * 100);
//     // Use robohash which is more reliable
//     return `https://robohash.org/${avatarId}?set=set4&size=50x50`;
//     // If robohash fails, try a data URI as ultimate fallback
//     // return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="%23' + Math.floor(Math.random()*16777215).toString(16) + '"/></svg>';
// }

// // Load and display explanation details
// async function loadExplanationDetails() {
    
//     const explanationId = getUrlParameter('id');

//     console.log("Looking for explanation with ID:", explanationId);

//     if (!explanationId) {
//         console.log("No explanation ID found in URL");
//         displayNoExplanationMessage();
//         return;
//     }

//     // Get explanation from Firestore
//     const explanation = await loadExplanationById(explanationId);
//     console.log("Found explanation:", explanation);

//     if (!explanation) {
//         displayNoExplanationMessage();
//         return;
//     }
//  // For debugging: List all explanations to see what's available
//  try {
//     const allExplanations = await loadExplanations();
//     console.log("All available explanations:", allExplanations);
//     console.log("Available explanation IDs:", allExplanations.map(exp => exp.id));
// } catch (error) {
//     console.error("Error listing explanations:", error);
// }

// // Get explanation from Firestore
// // const explanation = await loadExplanationById(explanationId);
// console.log("Found explanation:", explanation);
//     // Update view count
//     await updateExplanationViewCount(explanation.id);

//     // Get related law if available
//     const relatedLaw = explanation.relatedLawId ? 
//         await loadLawById(explanation.relatedLawId) : null;

//     // Display the explanation details
//     displayExplanationHeader(explanation, relatedLaw);
//     displayExplanationContent(explanation);
//     displaySourceReferences(explanation);
//     await displayComments(explanation.id);
//     await displayRatings(explanation.id);

//     // Set up interaction event listeners
//     setupEventListeners(explanation.id);
// }

// // Display message when no explanation is found
// function displayNoExplanationMessage() {
//     const container = document.querySelector('.law-explanation-container');
//     container.innerHTML = `
//         <div class="no-explanation-message">
//             <h2>Explanation Not Found</h2>
//             <p>Sorry, the requested explanation could not be found.</p>
//             <a href="../index.html" class="btn btn-primary">Return to Home</a>
//         </div>
//     `;
// }

// // Display explanation header information
// function displayExplanationHeader(explanation, relatedLaw) {
//     const categoryElement = document.querySelector('.law-category');
//     const numberElement = document.querySelector('.law-number');
//     const titleElement = document.querySelector('.law-title');

//     categoryElement.textContent = explanation.category || "General";
//     numberElement.textContent = explanation.id;
//     titleElement.textContent = explanation.title;

//     // Set law number if there's a related law
//     if (relatedLaw) {
//         numberElement.textContent = `${explanation.id} (Related to Law: ${relatedLaw.id})`;
//     }
// }

// // Display explanation content
// function displayExplanationContent(explanation) {
//     const contentElement = document.querySelector('.explanation-content');

//     // Calculate confidence level (for demo purposes: based on content length)
//     const confidencePercent = Math.min(85, Math.max(60, Math.floor(explanation.content.length / 20)));
//     document.querySelector('.confidence-level').style.width = `${confidencePercent}%`;
//     document.querySelector('.confidence-percentage').textContent = `${confidencePercent}%`;

//     // Overview
//     const overviewSection = contentElement.querySelector('.explanation-section:nth-child(1)');
//     if (overviewSection) {
//         overviewSection.querySelector('p').textContent = explanation.summary;
//     }

//     // Key Provisions
//     const keyProvisionsSection = contentElement.querySelector('.explanation-section:nth-child(2)');
//     if (keyProvisionsSection) {
//         // Parse the content into key provisions (simplified for demo)
//         const contentLines = explanation.content.split('\n').filter(line => line.trim() !== '');

//         let keyProvisionsHTML = '<ul>';
//         for (let i = 0; i < Math.min(contentLines.length, 130); i++) {
//             const lineTitle = contentLines[i].split(':')[0] || `Key Point ${i + 1}`;
//             const lineContent = contentLines[i].split(':')[1] || contentLines[i];

//             keyProvisionsHTML += `
//                 <li>
//                     <strong>${lineTitle}:</strong>
//                     <p>${lineContent.trim()}</p>
//                 </li>
//             `;
//         }
//         keyProvisionsHTML += '</ul>';

//         const ulElement = keyProvisionsSection.querySelector('ul');
//         if (ulElement) {
//             ulElement.innerHTML = keyProvisionsHTML;
//         }
//     }

//     // Practical Implications
//     const implicationsSection = contentElement.querySelector('.explanation-section:nth-child(3)');
//     if (implicationsSection) {
//         implicationsSection.querySelector('p').textContent = explanation.summary + " This explanation is designed to assist in understanding the law and its application.";
//     }
// }

// // Display source references
// function displaySourceReferences(explanation) {
//     const referencesElement = document.querySelector('.ai-source-references ul');
//     if (!referencesElement) return;

//     // Use tags as sources
//     if (explanation.tags && explanation.tags.length > 0) {
//         referencesElement.innerHTML = '';
//         explanation.tags.forEach(tag => {
//             const listItem = document.createElement('li');
//             listItem.textContent = tag;
//             referencesElement.appendChild(listItem);
//         });
//     } else {
//         // Default references
//         referencesElement.innerHTML = `
//             <li>Legal Code Reference</li>
//             <li>Judicial Precedents</li>
//             <li>Academic Legal Commentary</li>
//         `;
//     }
// }

// // Display comments for the explanation
// async function displayComments(explanationId) {
//     const commentsContainer = document.querySelector('.existing-comments');
//     if (!commentsContainer) return;
    
//     const comments = await loadComments(explanationId);

//     if (comments.length === 0) {
//         commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
//         return;
//     }

//     commentsContainer.innerHTML = '';

//     comments.forEach(comment => {
//         const commentElement = document.createElement('div');
//         commentElement.className = 'comment';
//         commentElement.innerHTML = `
//             <img src="${comment.avatar || getRandomAvatar()}" alt="User Avatar" class="user-avatar">
//             <div class="comment-content">
//                 <h4>${comment.username}</h4>
//                 <p>${comment.text}</p>
//                 <div class="comment-meta">
//                     <span>${formatCommentTime(comment.timestamp)}</span>
//                     <a href="#" class="reply-link" data-comment-id="${comment.id}">Reply</a>
//                 </div>
//             </div>
//         `;

//         commentsContainer.appendChild(commentElement);
//     });
// }

// // Format the comment timestamp
// function formatCommentTime(timestamp) {
//     const commentDate = new Date(timestamp);
//     const now = new Date();
//     const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

//     if (diffInMinutes < 1) {
//         return 'Just now';
//     } else if (diffInMinutes < 60) {
//         return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
//     } else if (diffInMinutes < 1440) {
//         const hours = Math.floor(diffInMinutes / 60);
//         return `${hours} hour${hours === 1 ? '' : 's'} ago`;
//     } else {
//         return formatDate(timestamp);
//     }
// }

// // Display ratings information
// async function displayRatings(explanationId) {
//     const starRating = document.querySelector('.star-rating');
//     if (!starRating) return;
    
//     const ratingData = await loadRatings(explanationId);

//     // Reset all stars
//     const starInputs = starRating.querySelectorAll('input');
//     starInputs.forEach(input => {
//         input.checked = false;
//     });

//     // Remove any existing rating info
//     const existingRatingInfo = starRating.querySelector('.rating-info');
//     if (existingRatingInfo) {
//         existingRatingInfo.remove();
//     }

//     // If there are ratings, show the average
//     if (ratingData.count > 0) {
//         const averageRating = Math.round(ratingData.average);
//         const ratingInput = document.getElementById(`star${averageRating}`);
//         if (ratingInput) {
//             ratingInput.checked = true;
//         }

//         // Add rating count info
//         const ratingInfo = document.createElement('div');
//         ratingInfo.className = 'rating-info';
//         ratingInfo.textContent = `(${ratingData.count} rating${ratingData.count === 1 ? '' : 's'})`;
//         starRating.appendChild(ratingInfo);
//     }
// }

// // Set up event listeners for user interactions
// function setupEventListeners(explanationId) {
//     // Rating submission
//     const starInputs = document.querySelectorAll('.star-rating input');
//     starInputs.forEach(input => {
//         input.addEventListener('change', async function () {
//             const ratingValue = this.value;
//             await saveRating(explanationId, ratingValue);

//             // Show thank you message
//             const ratingSection = document.querySelector('.explanation-rating');
//             const thankYouMsg = document.createElement('div');
//             thankYouMsg.className = 'thank-you-message';
//             thankYouMsg.textContent = 'Thank you for your rating!';
//             ratingSection.appendChild(thankYouMsg);

//             // Remove message after 3 seconds
//             setTimeout(async () => {
//                 thankYouMsg.remove();
//                 await displayRatings(explanationId); // Refresh ratings display
//             }, 3000);
//         });
//     });

//     // Comment submission
//     const commentForm = document.querySelector('.comment-form');
//     if (commentForm) {
//         commentForm.addEventListener('submit', async function (e) {
//             e.preventDefault();

//             const commentText = this.querySelector('textarea').value.trim();
//             if (!commentText) return;

//             // Generate a random username (for demo)
//             const usernames = ['Legal Eagle', 'Justice Seeker', 'Law Student', 'Curious Citizen', 'Policy Expert'];
//             const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];

//             // Add comment
//             const newComment = {
//                 username: randomUsername,
//                 text: commentText,
//                 timestamp: new Date().toISOString(),
//                 avatar: getRandomAvatar()
//             };

//             // Save the comment to Firestore
//             await saveComment(explanationId, newComment);

//             // Reset form and refresh comments
//             this.reset();
//             await displayComments(explanationId);
//         });
//     }

//     // Reply to comment functionality
//     document.addEventListener('click', function (e) {
//         if (e.target.classList.contains('reply-link')) {
//             e.preventDefault();
//             const commentId = e.target.getAttribute('data-comment-id');

//             // Focus comment textarea and add reply prefix
//             const textarea = document.querySelector('.comment-form textarea');
//             if (textarea) {
//                 textarea.focus();
//                 textarea.value = `@Reply to comment: `;
//             }
//         }
//     });
// }

// // Initialize when the DOM is loaded
// document.addEventListener('DOMContentLoaded', async function () {
//     // Check for Firebase initialization
//     if (typeof firebase === 'undefined' || !firebase.apps.length) {
//         console.error("Firebase not initialized. Make sure to include and initialize Firebase before using these functions.");
//         alert("Error: Firebase is not initialized. Some features may not work properly.");
//     }
    
//     try {
//         // Initialize test data if needed
//         // await initializeTestData();
        
//         // Load explanation details
//         await loadExplanationDetails();
//     } catch (error) {
//         console.error("Error initializing explanation page:", error);
//         alert("An error occurred while loading the explanation. Please try again later.");
//     }
// });

// Storage keys for local fallback
const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';
const LAWS_STORAGE_KEY = 'legal_system_laws';
const COMMENTS_STORAGE_KEY = 'legal_system_explanation_comments';
const RATINGS_STORAGE_KEY = 'legal_system_explanation_ratings';

// Initialize db variable
let db;

// Check if Firebase is available and set up db accordingly
if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length > 0) {
    db = firebase.firestore();
    console.log("Firebase initialized successfully");
} else {
    console.warn("Firebase not available - using local storage fallback mode only");
    // Create a mock db object that throws errors to trigger fallbacks
    db = {
        collection: () => ({
            doc: () => ({
                get: () => Promise.reject(new Error("Firebase not available")),
                set: () => Promise.reject(new Error("Firebase not available")),
                update: () => Promise.reject(new Error("Firebase not available"))
            }),
            where: () => ({
                orderBy: () => ({
                    get: () => Promise.reject(new Error("Firebase not available"))
                }),
                get: () => Promise.reject(new Error("Firebase not available"))
            }),
            limit: () => ({
                get: () => Promise.reject(new Error("Firebase not available"))
            }),
            get: () => Promise.reject(new Error("Firebase not available")),
            add: () => Promise.reject(new Error("Firebase not available"))
        }),
        runTransaction: () => Promise.reject(new Error("Firebase not available"))
    };
}

// Load explanations from Firestore
async function loadExplanations() {
    try {
        const querySnapshot = await db.collection("lawExplanations").get();
        let explanations = [];
        
        console.log("Number of explanations found:", querySnapshot.size);
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Log each document ID and data for debugging
            console.log("Found document with ID:", doc.id);
            console.log("Document data:", data);
            
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
// Test Firestore access
async function checkFirestoreAccess() {
    try {
        const lawsTest = await db.collection("laws").limit(1).get();
        console.log("Laws collection access test:", lawsTest.empty ? "No documents (but access OK)" : "Access OK");
        
        const explanationsTest = await db.collection("lawExplanations").limit(1).get();
        console.log("LawExplanations collection access test:", explanationsTest.empty ? "No documents (but access OK)" : "Access OK");
        return true;
    } catch (error) {
        console.error("Firestore access test failed:", error);
        return false;
    }
}

// Main initialization function
async function initializePage() {
    // Check for Firebase initialization
    if (typeof firebase === 'undefined' || !firebase.apps.length) {
        console.error("Firebase not initialized. Make sure to include and initialize Firebase before using these functions.");
        alert("Error: Firebase is not initialized. Some features may not work properly.");
    }
    
    try {
        // Test Firestore access
        await checkFirestoreAccess();
        
        // Load explanation details
        await loadExplanationDetails();
    } catch (error) {
        console.error("Error initializing explanation page:", error);
        alert("An error occurred while loading the explanation. Please try again later.");
    }
}
async function loadExplanationDetails() {
    console.log("Starting to load explanation details");
    console.log("Current URL:", window.location.href);
    
    const explanationId = getUrlParameter('id');
    console.log("Looking for explanation with ID:", explanationId);

    if (!explanationId) {
        console.log("No explanation ID found in URL");
        displayNoExplanationMessage();
        return;
    }

    // Try loading with enhanced function
    let explanation = await enhancedLoadExplanationById(explanationId);
    
    // Debug: List all explanations if not found
    if (!explanation) {
        try {
            const allExplanations = await loadExplanations();
            console.log("All available explanations:", allExplanations);
            console.log("Available explanation IDs:", allExplanations.map(exp => exp.id));
            
            // Try using one of the available explanations as fallback (just for testing)
            if (allExplanations.length > 0) {
                explanation = allExplanations[0];
                console.log("Using fallback explanation:", explanation.id);
            }
        } catch (error) {
            console.error("Error listing explanations:", error);
        }
    }

    if (!explanation) {
        displayNoExplanationMessage();
        return;
    }

    console.log("Successfully found explanation:", explanation);
    console.log("Successfully found explanation: id:", explanation.id);
    console.log("Successfully found explanation: docID:", explanation.docId);

    // Update view count with both the field ID and document ID
    await updateExplanationViewCount(explanation.id, explanation.docId || explanation.id);

    // Get related law if available
    let relatedLaw = null;
    if (explanation.relatedLawId) {
        relatedLaw = await loadLawById(explanation.relatedLawId);
        console.log("Related law:", relatedLaw);
    }

    // Display the explanation details
    displayExplanationHeader(explanation, relatedLaw);
    displayExplanationContent(explanation);
    displaySourceReferences(explanation);
    
    // Display comments and ratings
    await displayComments(explanation.id);
    await displayRatings(explanation.id);

    // Set up interaction event listeners
    setupEventListeners(explanation.id);
}
// Display message when no explanation is found
function displayNoExplanationMessage() {
    const container = document.querySelector('.law-explanation-container');
    if (container) {
        container.innerHTML = `
            <div class="no-explanation-message">
                <h2>Explanation Not Found</h2>
                <p>Sorry, the requested explanation could not be found.</p>
                <br>
                <a href="../index.html" class="btn btn-primary">Return to Home</a>
            </div>
        `;
    }
}
async function enhancedLoadExplanationById(explanationId) {
    console.log("Enhanced load explanation by ID:", explanationId);
    
    if (!explanationId) return null;
    
    // 1. Try standard method
    let explanation = await loadExplanationById(explanationId);
    if (explanation) return explanation;
    
    // 2. Try querying both collections with different ID formats
    try {
        // First try the exact ID in lawExplanations collection
        const querySnapshot = await db.collection("lawExplanations").get();
        console.log("Total documents in collection:", querySnapshot.size);
        
        // Debug: List all document IDs
        querySnapshot.forEach(doc => {
            console.log("Document ID:", doc.id, "Data ID:", doc.data().id || "none");
        });
        
        // Try with different ID formats
        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            
            // Check actual document ID
            if (doc.id === explanationId || 
                doc.id === "#" + explanationId || 
                doc.id.replace("#", "") === explanationId) {
                console.log("Found by document ID:", doc.id);
                return { id: doc.id, docId: doc.id, ...data };
            }
            
            // Check id field in data
            if (data.id === explanationId || 
                data.id === "#" + explanationId || 
                (data.id && data.id.replace("#", "") === explanationId)) {
                console.log("Found by data.id field:", data.id);
                // Store both the document ID and the field ID
               // When finding by data.id field
return { 
    id: data.id, 
    docId: doc.id, // Store the actual document ID
    ...data 
        };
            }
        }
        
        console.log("No matching explanation found after checking all documents");
        return null;
    } catch (error) {
        console.error("Error in enhanced explanation loading:", error);
        return null;
    }
}

// Load a single explanation from Firestore by ID
async function loadExplanationById(explanationId) {
    console.log("Looking for explanation with ID:", explanationId);
    
    try {
        // Try different ID formats
        const possibleIds = [
            explanationId,
            explanationId.startsWith('#') ? explanationId : '#' + explanationId,
            explanationId.startsWith('#') ? explanationId.substring(1) : explanationId
        ];
        
        // First, try direct document lookups
        for (const id of possibleIds) {
            console.log("Trying direct lookup with ID:", id);
            const docRef = db.collection("lawExplanations").doc(id);
            const doc = await docRef.get();
            
            if (doc.exists) {
                console.log("Found document via direct lookup:", id);
                return { id: doc.id, ...doc.data() };
            }
        }
        
        // If direct lookup fails, try querying the "id" field
        console.log("Direct lookup failed, trying query on 'id' field");
        const querySnapshot = await db.collection("lawExplanations")
            .where("id", "in", possibleIds)
            .get();
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            console.log("Found via query with field id:", doc.id);
            return { id: doc.id, ...doc.data() };
        }
        
        console.log("No explanation found with any ID format");
        return null;
    } catch (error) {
        console.error("Error fetching explanation from Firestore:", error);
        return loadLocalExplanations().find(exp => 
            exp.id === explanationId || 
            exp.id === '#' + explanationId || 
            exp.id.replace('#', '') === explanationId
        );
    }
}

// Check Firestore permissions
async function checkFirestorePermissions() {
    try {
        // Try to read a single document from each collection
        const lawTest = await db.collection("laws").limit(1).get();
        console.log("Laws collection read access:", lawTest.empty ? "No docs but has access" : "Access OK");
        
        const explanationTest = await db.collection("lawExplanations").limit(1).get();
        console.log("lawExplanations collection read access:", 
                    explanationTest.empty ? "No docs but has access" : "Access OK");
        return true;
    } catch (error) {
        console.error("Permission error:", error);
        return false;
    }
}

// Try finding explanation by ID field
async function tryFindingByFieldId() {
    console.log("Trying to find explanation by 'id' field instead of document ID...");
    try {
        const querySnapshot = await db.collection("lawExplanations")
            .where("id", "in", ["EXP-006", "#EXP-006"])
            .get();
        
        console.log("Query results count:", querySnapshot.size);
        
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            console.log("Found explanation by field id:", doc.id);
            console.log("Document data:", doc.data());
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error("Error in field id query:", error);
        return null;
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
        console.log("Searching for law with ID:", lawId);
        
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
            // Try query-based search if direct lookup fails
            console.log("Direct lookup failed, trying query on laws 'id' field");
            const querySnapshot = await db.collection("laws")
                .where("id", "in", [lawId, '#' + lawId, lawId.substring(1)])
                .get();
            
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                console.log("Found law via query with field id:", doc.id);
                const data = doc.data();
                
                // Convert Firestore timestamp to JavaScript Date string
                if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
                    data.datePublished = data.datePublished.toDate().toISOString();
                }
                
                return { id: doc.id, ...data };
            }
            
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
        
        // If it's an index error, provide specific guidance
        if (error.message && error.message.includes("index")) {
            console.warn("You need to create an index for this query. Please visit the link in the error message.");
        }
        
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
async function updateExplanationViewCount(explanationId, documentId) {
    try {
        // Use the document ID from Firestore, not the field ID
        const explanationRef = db.collection("lawExplanations").doc(documentId);
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

    // For testing: use a default ID when none is provided
    if (!param && name === 'id') {
        console.log("Using default explanation ID for testing");
        return "#EXP-006"; // Use an ID that exists in your lawExplanations collection
    }

    return param;
}

// Generate random avatar URL
function getRandomAvatar() {
    const avatarId = Math.floor(Math.random() * 100);
    // Use robohash which is more reliable
    return `https://robohash.org/${avatarId}?set=set4&size=50x50`;
}







// Display explanation header information
function displayExplanationHeader(explanation, relatedLaw) {
    const categoryElement = document.querySelector('.law-category');
    const numberElement = document.querySelector('.law-number');
    const titleElement = document.querySelector('.law-title');

    if (categoryElement) categoryElement.textContent = explanation.category || "General";
    if (numberElement) {
        // Set law number if there's a related law
        if (relatedLaw) {
            numberElement.textContent = `${explanation.id} (Related to Law: ${relatedLaw.id})`;
        } else {
            numberElement.textContent = explanation.id;
        }
    }
    if (titleElement) titleElement.textContent = explanation.title;
}

// Display explanation content
function displayExplanationContent(explanation) {
    const contentElement = document.querySelector('.explanation-content');
    if (!contentElement) return;

    // Calculate confidence level (for demo purposes: based on content length)
    const confidenceElement = document.querySelector('.confidence-level');
    const confidencePercentElement = document.querySelector('.confidence-percentage');
    
    if (confidenceElement && confidencePercentElement) {
        const confidencePercent = Math.min(85, Math.max(60, Math.floor(explanation.content.length / 20)));
        confidenceElement.style.width = `${confidencePercent}%`;
        confidencePercentElement.textContent = `${confidencePercent}%`;
    }

    // Overview
    const overviewSection = contentElement.querySelector('.explanation-section:nth-child(1)');
    if (overviewSection) {
        const overviewParagraph = overviewSection.querySelector('p');
        if (overviewParagraph) {
            overviewParagraph.textContent = explanation.summary;
        }
    }

    // Key Provisions
    const keyProvisionsSection = contentElement.querySelector('.explanation-section:nth-child(2)');
    if (keyProvisionsSection) {
        // Parse the content into key provisions
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
        const implicationsParagraph = implicationsSection.querySelector('p');
        if (implicationsParagraph) {
            implicationsParagraph.textContent = explanation.summary + " This explanation is designed to assist in understanding the law and its application.";
        }
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
            if (ratingSection) {
                const thankYouMsg = document.createElement('div');
                thankYouMsg.className = 'thank-you-message';
                thankYouMsg.textContent = 'Thank you for your rating!';
                ratingSection.appendChild(thankYouMsg);

                // Remove message after 3 seconds
                setTimeout(async () => {
                    thankYouMsg.remove();
                    await displayRatings(explanationId); // Refresh ratings display
                }, 3000);
            }
        });
    });

    // Comment submission
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const commentTextarea = this.querySelector('textarea');
            if (!commentTextarea) return;

            const commentText = commentTextarea.value.trim();
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
// Function to display error messages
function displayErrorMessage(message) {
    const container = document.querySelector('.law-explanation-container') || 
                      document.querySelector('.main-content') || 
                      document.body;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<p>${message}</p>`;
    
    container.prepend(errorDiv);
}
async function loadExplanationList() {
    console.log("Loading explanation list...");
    
    const explanationsContainer = document.querySelector('.explanations-list');
    if (!explanationsContainer) {
        console.log("No explanations list container found. Not on listing page.");
        return;
    }
    
    // Show loading state
    explanationsContainer.innerHTML = '<div class="loading">Loading explanations...</div>';
    
    try {
        // Attempt to load explanations from Firestore
        const explanations = await loadExplanations();
        console.log(`Loaded ${explanations.length} explanations`);
        
        if (explanations.length === 0) {
            explanationsContainer.innerHTML = '<div class="no-content">No explanations available.</div>';
            return;
        }
        
        // Create HTML for the explanations list
        explanationsContainer.innerHTML = '';
        explanations.forEach(explanation => {
            const card = document.createElement('div');
            card.className = 'explanation-card';
            
            const datePublished = explanation.datePublished ? 
                formatDate(explanation.datePublished) : 'Date not available';
            
            card.innerHTML = `
                <h3><a href="explanation/details.html?id=${encodeURIComponent(explanation.id)}">${explanation.title || 'Untitled Explanation'}</a></h3>
                <p class="summary">${explanation.summary || 'No summary available'}</p>
                <div class="card-meta">
                    <span class="date">${datePublished}</span>
                    <span class="views"><i class="fa fa-eye"></i> ${explanation.views || 0}</span>
                </div>
                <div class="tags">
                    ${(explanation.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            `;
            
            explanationsContainer.appendChild(card);
        });
    } catch (error) {
        console.error("Failed to load explanations:", error);
        explanationsContainer.innerHTML = '<div class="error">Failed to load explanations. Please try again later.</div>';
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // First check if we're on the explanation details page
    const isExplanationPage = document.querySelector('.law-explanation-container');
    
    if (isExplanationPage) {
        // Run the async initialization function for the explanation page
        initializePage().catch(error => {
            console.error("Error during initialization:", error);
            displayErrorMessage("Failed to load explanation. Please try again later.");
        });
    } else {
        // We're likely on the index/listing page
        loadExplanationList().catch(error => {
            console.error("Error loading explanation list:", error);
            displayErrorMessage("Failed to load explanations. Please try again later.");
        });
    }
});