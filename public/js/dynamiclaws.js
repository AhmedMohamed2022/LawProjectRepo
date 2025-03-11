// Firebase and Firestore must be initialized at the top of your script
// Make sure you have these scripts in your HTML:
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js"></script>
// And your Firebase config initialization

// Assuming Firebase is initialized, get Firestore reference
const db = firebase.firestore();

// Storage key constants (keep for fallback)
const LAWS_STORAGE_KEY = 'legal_system_laws';
const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';

// Load laws from Firestore (replaces original loadLaws function)
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
            
//             laws.push({ id: doc.id, ...data });
//         });
        
//         return laws;
//     } catch (error) {
//         console.error("Error fetching laws from Firestore:", error);
//         // Fallback to local storage if Firestore fails
//         return loadLocalLaws();
//     }
// }
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
            // If there's an id field in the data, use that, otherwise use doc.id
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

// Fallback function to load laws from local storage
function loadLocalLaws() {
    const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
    return storedLaws ? JSON.parse(storedLaws) : [];
}

// Get related explanations for a law from Firestore
// async function getRelatedExplanations(lawId) {
//     try {
//         const querySnapshot = await db.collection("lawExplanations")
//             .where("relatedLawId", "==", lawId)
//             .get();
            
//         let explanations = [];
        
//         querySnapshot.forEach((doc) => {
//             explanations.push({ id: doc.id, ...doc.data() });
//         });
        
//         return explanations;
//     } catch (error) {
//         console.error("Error fetching explanations from Firestore:", error);
//         // Fallback to local storage
//         const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
//         const explanations = storedExplanations ? JSON.parse(storedExplanations) : [];
//         return explanations.filter(exp => exp.relatedLawId === lawId);
//     }
// }
async function getRelatedExplanations(lawId) {
    try {
        // Try with original ID
        let querySnapshot = await db.collection("lawExplanations")
            .where("relatedLawId", "==", lawId)
            .get();
            
        // If no results, try with the ID without the # prefix
        if (querySnapshot.empty && lawId.startsWith('#')) {
            const cleanId = lawId.replace(/^#/, '');
            querySnapshot = await db.collection("lawExplanations")
                .where("relatedLawId", "==", cleanId)
                .get();
        }
            
        let explanations = [];
        
        querySnapshot.forEach((doc) => {
            explanations.push({ id: doc.id, ...doc.data() });
        });
        
        return explanations;
    } catch (error) {
        console.error("Error fetching explanations from Firestore:", error);
        // Fallback to local storage
        const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
        const explanations = storedExplanations ? JSON.parse(storedExplanations) : [];
        return explanations.filter(exp => exp.relatedLawId === lawId || exp.relatedLawId === lawId.replace(/^#/, ''));
    }
}
// Initialize test data in Firestore if needed
async function initializeTestData() {
    try {
        // Check if laws exist in Firestore
        const lawsSnapshot = await db.collection("laws").limit(1).get();
        
        if (lawsSnapshot.empty) {
            console.log("No laws found in Firestore, initializing sample data");
            // Get laws from local storage first
            const localLaws = loadLocalLaws();
            
            if (localLaws.length > 0) {
                // Use existing local storage data for Firestore
                for (const law of localLaws) {
                    // Remove the id field since it will be the document ID
                    const { id, ...lawData } = law;
                    // Convert date string to Firestore timestamp if needed
                    if (lawData.datePublished) {
                        lawData.datePublished = firebase.firestore.Timestamp.fromDate(new Date(lawData.datePublished));
                    }
                    // Add to Firestore
                    await db.collection("laws").doc(id).set(lawData);
                }
            } else {
                // Create a new sample law in Firestore
                const sampleLaw = {
                    title: "Sample Law Title",
                    category: "criminal",
                    description: "This is a sample law description.",
                    datePublished: firebase.firestore.Timestamp.fromDate(new Date()),
                    views: 0,
                    tags: ["tag1", "tag2"],
                    status: "active",
                    content: "Section 1: Sample content\nSection 2: More sample content"
                };
                await db.collection("laws").doc("L001").set(sampleLaw);
            }
        }
        
        // Check if explanations exist in Firestore
        const explanationsSnapshot = await db.collection("lawExplanations").limit(1).get();
        
        if (explanationsSnapshot.empty) {
            console.log("No explanations found in Firestore, initializing sample data");
            // Get explanations from local storage
            const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
            const localExplanations = storedExplanations ? JSON.parse(storedExplanations) : [];
            
            if (localExplanations.length > 0) {
                // Use existing local storage data
                for (const explanation of localExplanations) {
                    const { id, ...explanationData } = explanation;
                    await db.collection("lawExplanations").doc(id).set(explanationData);
                }
            } else {
                // Create a new sample explanation
                const sampleExplanation = {
                    title: "Explanation of Sample Law",
                    category: "criminal",
                    relatedLawId: "L001",
                    summary: "This explains the sample law in simple terms.",
                    content: "Point 1: Important detail\nPoint 2: Another critical aspect\nPoint 3: Final consideration",
                    views: 0,
                    tags: ["reference1", "reference2"]
                };
                await db.collection("lawExplanations").doc("E001").set(sampleExplanation);
            }
        }
    } catch (error) {
        console.error("Error initializing Firestore data:", error);
        // Fall back to local storage initialization
        const localLaws = loadLocalLaws();
        
        if (localLaws.length === 0) {
            // Create sample law data in local storage
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

        // Check if explanations exist
        const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
        const explanations = storedExplanations ? JSON.parse(storedExplanations) : [];

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
}

// Update law view count in Firestore
async function updateLawViews(lawId) {
    try {
        const lawRef = db.collection("laws").doc(lawId);
        await lawRef.update({
            views: firebase.firestore.FieldValue.increment(1)
        });
    } catch (error) {
        console.error("Error updating view count in Firestore:", error);
        // Fallback to local storage update
        const laws = loadLocalLaws();
        const lawIndex = laws.findIndex(law => law.id === lawId);
        if (lawIndex !== -1) {
            laws[lawIndex].views += 1;
            localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
        }
    }
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Generate law cards from Firestore data
async function generateLawCards() {
    const lawsContainer = document.querySelector('.laws-container');
    
    // Show loading indicator
    lawsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading laws...</div>';
    
    try {
        // Get laws from Firestore
        const laws = await loadLaws();
        
        // Clear existing content
        lawsContainer.innerHTML = '';

        // If no laws found, show message
        if (laws.length === 0) {
            lawsContainer.innerHTML = `
                <div class="no-laws-message">
                    <i class="fas fa-book-open"></i>
                    <h3>No laws found</h3>
                    <p>There are no laws in the system yet. Add laws from the dashboard.</p>
                </div>
            `;
            return;
        }

        // Generate each law card
        laws.forEach(law => {
            const lawCard = document.createElement('div');
            lawCard.className = 'law-card';
            lawCard.setAttribute('data-category', law.category);

            lawCard.innerHTML = `
                <div class="law-card-header">
                    <span class="law-category">${capitalizeFirstLetter(law.category)}</span>
                    <span class="law-date">Last updated: ${formatDate(law.datePublished)}</span>
                </div>
                <h3 class="law-title">${law.title}</h3>
                <p class="law-excerpt">${law.description}</p>
                <div class="law-footer">
                    <button class="btn btn-outline" data-id="${law.id}">View Details</button>
                    <div class="law-stats">
                        <span><i class="fas fa-eye"></i> ${law.views}</span>
                        <span><i class="fas fa-bookmark"></i> ${law.tags ? law.tags.length : 0}</span>
                    </div>
                </div>
            `;

            lawsContainer.appendChild(lawCard);
        });

        // Add event listeners to view details buttons
        attachViewDetailsListeners();
    } catch (error) {
        console.error("Error generating law cards:", error);
        lawsContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error loading laws</h3>
                <p>There was a problem loading the laws. Please try again later.</p>
            </div>
        `;
    }
}

// Attach event listeners to "View Details" buttons
function attachViewDetailsListeners() {
    const viewButtons = document.querySelectorAll('.law-footer .btn-outline');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lawId = this.getAttribute('data-id');
            openLawModal(lawId);
        });
    });
}
function formatDate(date) {
    // If it's already a Date object, use it directly
    let dateObj;
    if (date instanceof Date) {
        dateObj = date;
    } else {
        // Otherwise try to parse it as a string
        try {
            dateObj = new Date(date);
        } catch (e) {
            return "Invalid Date";
        }
    }
    
    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
    }
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
}
// Open law modal with Firestore data
// async function openLawModal(lawId) {
//     const lawModal = document.getElementById('lawModal');
    
//     // Reset and show the modal with loading state
//     lawModal.querySelector('.law-full-title').textContent = "Loading...";
//     lawModal.querySelector('.law-description').textContent = "";
//     lawModal.querySelector('.law-sections').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading law details...</div>';
    
//     // Show modal
//     lawModal.classList.add('active');
//     document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
//     try {
//         // Try to get law from Firestore first
//         const docRef = db.collection("laws").doc(lawId);
//         const doc = await docRef.get();
        
//         let law;
//         if (doc.exists) {
//             // Get data from Firestore
//             law = { id: doc.id, ...doc.data() };
            
//             // Update view count in Firestore
//             await updateLawViews(lawId);
            
//             // Convert Firestore timestamp if needed
//             if (law.datePublished instanceof firebase.firestore.Timestamp) {
//                 law.datePublished = law.datePublished.toDate().toISOString();
//             }
//         } else {
//             // Try fallback to local storage
//             console.log("Law not found in Firestore, checking local storage");
//             const laws = loadLocalLaws();
//             law = laws.find(l => l.id === lawId);
            
//             if (!law) {
//                 throw new Error("Law not found in Firestore or local storage");
//             }
            
//             // Update view count in local storage
//             const lawIndex = laws.findIndex(l => l.id === lawId);
//             if (lawIndex !== -1) {
//                 laws[lawIndex].views += 1;
//                 localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
//             }
//         }

//         // Update modal content
//         lawModal.querySelector('.law-category-tag').textContent = capitalizeFirstLetter(law.category);
//         lawModal.querySelector('.law-full-title').textContent = law.title;
//         lawModal.querySelector('.law-number').textContent = law.id;
//         document.getElementById('modalLawDate').textContent = formatDate(law.datePublished);

//         // Fill in metadata
//         const metadataSection = lawModal.querySelector('.law-metadata');
//         metadataSection.innerHTML = `
//             <div class="metadata-item">
//                 <span class="metadata-label">Effective since:</span>
//                 <span class="metadata-value">${formatDate(law.datePublished)}</span>
//             </div>
//             <div class="metadata-item">
//                 <span class="metadata-label">Status:</span>
//                 <span class="metadata-value">${capitalizeFirstLetter(law.status)}</span>
//             </div>
//             <div class="metadata-item">
//                 <span class="metadata-label">Tags:</span>
//                 <span class="metadata-value">${law.tags ? law.tags.length : 0}</span>
//             </div>
//             <div class="metadata-item">
//                 <span class="metadata-label">Views:</span>
//                 <span class="metadata-value">${law.views}</span>
//             </div>
//         `;

//         // Fill in description
//         lawModal.querySelector('.law-description').textContent = law.description;

//         // Display law content directly instead of just key sections
//         const sectionsContainer = lawModal.querySelector('.law-sections');
//         if (law.content) {
//             // Format content to display properly
//             const formattedContent = law.content.replace(/\n/g, '<br>');
//             sectionsContainer.innerHTML = `
//                 <h4>Law Content</h4>
//                 <div class="law-content-text">${formattedContent}</div>
//             `;
//         } else {
//             sectionsContainer.innerHTML = '<p>No detailed content available for this law.</p>';
//         }

//         // Show tags if available
//         if (law.tags && law.tags.length > 0) {
//             const tagsHtml = law.tags.map(tag => `<span class="law-tag">${tag}</span>`).join('');
//             sectionsContainer.innerHTML += `
//                 <div class="law-tags-section">
//                     <h4>Tags</h4>
//                     <div class="law-tags">${tagsHtml}</div>
//                 </div>
//             `;
//         }

//         // Add related explanations
//         const relatedExplanations = await getRelatedExplanations(lawId);

//         // Update the AI Analysis button link
//         const aiAnalysisBtn = lawModal.querySelector('.law-modal-footer .btn-primary');
//         if (relatedExplanations.length > 0) {
//             // Set href with the first explanation ID
//             aiAnalysisBtn.href = `dynamicExplanation.html?id=${relatedExplanations[0].id.replace("#", "")}`;
//             aiAnalysisBtn.classList.remove('disabled');
//         } else {
//             aiAnalysisBtn.href = '#';
//             aiAnalysisBtn.classList.add('disabled');
//         }
//     } catch (error) {
//         console.error("Error opening law modal:", error);
//         // Show error in modal
//         lawModal.querySelector('.law-full-title').textContent = "Error";
//         lawModal.querySelector('.law-sections').innerHTML = `
//             <div class="error-message">
//                 <i class="fas fa-exclamation-triangle"></i>
//                 <h3>Could not load law details</h3>
//                 <p>${error.message || "An unexpected error occurred."}</p>
//             </div>
//         `;
//     }
// }
// async function openLawModal(lawId) {
//     const lawModal = document.getElementById('lawModal');
    
//     // Reset and show the modal with loading state
//     lawModal.querySelector('.law-full-title').textContent = "Loading...";
//     lawModal.querySelector('.law-description').textContent = "";
//     lawModal.querySelector('.law-sections').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading law details...</div>';
    
//     console.log(`Attempting to open law with ID: ${lawId}`);
    
//     // Show modal
//     lawModal.classList.add('active');
//     document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
//     try {
//         // Try to get law from Firestore first
//         const docRef = db.collection("laws").doc(lawId);
//         const doc = await docRef.get();
        
//         let law;
//         if (doc.exists) {
//             console.log(`Found law ${lawId} in Firestore`);
//             // Get data from Firestore
//             law = { id: doc.id, ...doc.data() };
            
//             // Update view count in Firestore
//             await updateLawViews(lawId);
            
//             // Convert Firestore timestamp if needed
//             if (law.datePublished instanceof firebase.firestore.Timestamp) {
//                 law.datePublished = law.datePublished.toDate().toISOString();
//             }
//         } else {
//             // Try fallback to local storage
//             console.log(`Law not found in Firestore, checking local storage for ID: ${lawId}`);
//             const laws = loadLocalLaws();
//             console.log("Laws in local storage:", laws);
//             law = laws.find(l => l.id === lawId);
            
//             if (!law) {
//                 // Instead of throwing an error, create a placeholder law
//                 console.log("Law not found in either location. Creating placeholder.");
//                 law = {
//                     id: lawId,
//                     title: "Law Not Found",
//                     category: "unknown",
//                     description: "This law entry could not be found in the database. It may have been removed or there might be a connection issue.",
//                     datePublished: new Date().toISOString(),
//                     views: 0,
//                     status: "unknown",
//                     content: "No content available."
//                 };
//             } else {
//                 // Update view count in local storage
//                 const lawIndex = laws.findIndex(l => l.id === lawId);
//                 if (lawIndex !== -1) {
//                     laws[lawIndex].views += 1;
//                     localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
//                 }
//             }
//         }

//         // Update modal content
//         lawModal.querySelector('.law-category-tag').textContent = capitalizeFirstLetter(law.category);
//         lawModal.querySelector('.law-full-title').textContent = law.title;
//         lawModal.querySelector('.law-number').textContent = law.id;
//         document.getElementById('modalLawDate').textContent = formatDate(law.datePublished);

//         // Fill in metadata
//         const metadataSection = lawModal.querySelector('.law-metadata');
//         metadataSection.innerHTML = `
//             <div class="metadata-item">
//                 <span class="metadata-label">Effective since:</span>
//                 <span class="metadata-value">${formatDate(law.datePublished)}</span>
//             </div>
//             <div class="metadata-item">
//                 <span class="metadata-label">Status:</span>
//                 <span class="metadata-value">${capitalizeFirstLetter(law.status)}</span>
//             </div>
//             <div class="metadata-item">
//                 <span class="metadata-label">Tags:</span>
//                 <span class="metadata-value">${law.tags ? law.tags.length : 0}</span>
//             </div>
//             <div class="metadata-item">
//                 <span class="metadata-label">Views:</span>
//                 <span class="metadata-value">${law.views}</span>
//             </div>
//         `;

//         // Fill in description
//         lawModal.querySelector('.law-description').textContent = law.description;

//         // Display law content directly instead of just key sections
//         const sectionsContainer = lawModal.querySelector('.law-sections');
//         if (law.content) {
//             // Format content to display properly
//             const formattedContent = law.content.replace(/\n/g, '<br>');
//             sectionsContainer.innerHTML = `
//                 <h4>Law Content</h4>
//                 <div class="law-content-text">${formattedContent}</div>
//             `;
//         } else {
//             sectionsContainer.innerHTML = '<p>No detailed content available for this law.</p>';
//         }

//         // Show tags if available
//         if (law.tags && law.tags.length > 0) {
//             const tagsHtml = law.tags.map(tag => `<span class="law-tag">${tag}</span>`).join('');
//             sectionsContainer.innerHTML += `
//                 <div class="law-tags-section">
//                     <h4>Tags</h4>
//                     <div class="law-tags">${tagsHtml}</div>
//                 </div>
//             `;
//         }

//         // Add related explanations
//         const relatedExplanations = await getRelatedExplanations(lawId);

//         // Update the AI Analysis button link
//         const aiAnalysisBtn = lawModal.querySelector('.law-modal-footer .btn-primary');
//         if (relatedExplanations.length > 0) {
//             // Set href with the first explanation ID
//             aiAnalysisBtn.href = `dynamicExplanation.html?id=${relatedExplanations[0].id.replace("#", "")}`;
//             aiAnalysisBtn.classList.remove('disabled');
//         } else {
//             aiAnalysisBtn.href = '#';
//             aiAnalysisBtn.classList.add('disabled');
//             console.log(`No explanations found for law ${lawId}`);
//         }
//     } catch (error) {
//         console.error("Error opening law modal:", error);
//         // Show error in modal
//         lawModal.querySelector('.law-full-title').textContent = "Error";
//         lawModal.querySelector('.law-sections').innerHTML = `
//             <div class="error-message">
//                 <i class="fas fa-exclamation-triangle"></i>
//                 <h3>Could not load law details</h3>
//                 <p>${error.message || "An unexpected error occurred."}</p>
//                 <button class="btn btn-outline reload-btn">Try Again</button>
//             </div>
//         `;
        
//         // Add reload button functionality
//         const reloadBtn = lawModal.querySelector('.reload-btn');
//         if (reloadBtn) {
//             reloadBtn.addEventListener('click', () => {
//                 openLawModal(lawId);
//             });
//         }
//     }
// }
async function openLawModal(lawId) {
    const lawModal = document.getElementById('lawModal');
    
    // Reset and show the modal with loading state
    lawModal.querySelector('.law-full-title').textContent = "Loading...";
    lawModal.querySelector('.law-description').textContent = "";
    lawModal.querySelector('.law-sections').innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading law details...</div>';
    
    console.log(`Attempting to open law with ID: ${lawId}`);
    
    // Show modal
    lawModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    try {
        // Clean the ID by removing the # if present, for Firestore document ID
        const cleanId = lawId.replace(/^#/, '');
        
        // First try with the original ID
        let docRef = db.collection("laws").doc(lawId);
        let doc = await docRef.get();
        
        // If not found, try with the cleaned ID
        if (!doc.exists) {
            console.log(`Trying with cleaned ID: ${cleanId}`);
            docRef = db.collection("laws").doc(cleanId);
            doc = await docRef.get();
        }
        
        // Also try to query by the ID field
        let lawFromQuery = null;
        if (!doc.exists) {
            console.log(`Document not found by ID, trying query where id field equals: ${lawId}`);
            const querySnapshot = await db.collection("laws").where("id", "==", lawId).get();
            if (!querySnapshot.empty) {
                doc = querySnapshot.docs[0];
            }
        }
        
        let law;
        if (doc && doc.exists) {
            console.log(`Found law with ID: ${doc.id}`);
            // Get data from Firestore
            law = { id: lawId, ...doc.data() };
            
            // Update view count in Firestore
            await updateLawViews(doc.id);
            
            // Convert Firestore timestamp if needed
            if (law.datePublished instanceof firebase.firestore.Timestamp) {
                law.datePublished = law.datePublished.toDate().toISOString();
            }
        } else {
            // Try fallback to local storage
            console.log(`Law not found in Firestore, checking local storage for ID: ${lawId}`);
            const laws = loadLocalLaws();
            console.log("Laws in local storage:", laws);
            law = laws.find(l => l.id === lawId);
            
            if (!law) {
                // Instead of throwing an error, create a placeholder law
                console.log("Law not found in either location. Creating placeholder.");
                law = {
                    id: lawId,
                    title: "Law Not Found",
                    category: "unknown",
                    description: "This law entry could not be found in the database. It may have been removed or there might be a connection issue.",
                    datePublished: new Date().toISOString(),
                    views: 0,
                    status: "unknown",
                    content: "No content available."
                };
            } else {
                // Update view count in local storage
                const lawIndex = laws.findIndex(l => l.id === lawId);
                if (lawIndex !== -1) {
                    laws[lawIndex].views += 1;
                    localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
                }
            }
        }

        // Update modal content
        lawModal.querySelector('.law-category-tag').textContent = capitalizeFirstLetter(law.category);
        lawModal.querySelector('.law-full-title').textContent = law.title;
        lawModal.querySelector('.law-number').textContent = law.id;
        document.getElementById('modalLawDate').textContent = formatDate(law.datePublished);

        // Fill in metadata
        const metadataSection = lawModal.querySelector('.law-metadata');
        metadataSection.innerHTML = `
            <div class="metadata-item">
                <span class="metadata-label">Effective since:</span>
                <span class="metadata-value">${formatDate(law.datePublished)}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Status:</span>
                <span class="metadata-value">${capitalizeFirstLetter(law.status)}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Tags:</span>
                <span class="metadata-value">${law.tags ? law.tags.length : 0}</span>
            </div>
            <div class="metadata-item">
                <span class="metadata-label">Views:</span>
                <span class="metadata-value">${law.views}</span>
            </div>
        `;

        // Fill in description
        lawModal.querySelector('.law-description').textContent = law.description;

        // Display law content directly instead of just key sections
        const sectionsContainer = lawModal.querySelector('.law-sections');
        if (law.content) {
            // Format content to display properly
            const formattedContent = law.content.replace(/\n/g, '<br>');
            sectionsContainer.innerHTML = `
                <h4>Law Content</h4>
                <div class="law-content-text">${formattedContent}</div>
            `;
        } else {
            sectionsContainer.innerHTML = '<p>No detailed content available for this law.</p>';
        }

        // Show tags if available
        if (law.tags && law.tags.length > 0) {
            const tagsHtml = law.tags.map(tag => `<span class="law-tag">${tag}</span>`).join('');
            sectionsContainer.innerHTML += `
                <div class="law-tags-section">
                    <h4>Tags</h4>
                    <div class="law-tags">${tagsHtml}</div>
                </div>
            `;
        }

        // Add related explanations
        // Also fix the getRelatedExplanations function to match how we handle law IDs
        const relatedExplanations = await getRelatedExplanations(lawId);

        // Update the AI Analysis button link
        const aiAnalysisBtn = lawModal.querySelector('.law-modal-footer .btn-primary');
        if (relatedExplanations.length > 0) {
            // Set href with the first explanation ID
            const explanationId = relatedExplanations[0].id.replace("#", "");
            aiAnalysisBtn.href = `dynamicExplanation.html?id=${explanationId}`;
            aiAnalysisBtn.classList.remove('disabled');
        } else {
            aiAnalysisBtn.href = '#';
            aiAnalysisBtn.classList.add('disabled');
            console.log(`No explanations found for law ${lawId}`);
        }
    } catch (error) {
        console.error("Error opening law modal:", error);
        // Show error in modal
        lawModal.querySelector('.law-full-title').textContent = "Error";
        lawModal.querySelector('.law-sections').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Could not load law details</h3>
                <p>${error.message || "An unexpected error occurred."}</p>
                <button class="btn btn-outline reload-btn">Try Again</button>
            </div>
        `;
        
        // Add reload button functionality
        const reloadBtn = lawModal.querySelector('.reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                openLawModal(lawId);
            });
        }
    }
}


// Update page initialization to use async/await
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firestore and load data asynchronously
    (async function() {
        try {
            // Make sure Firebase is initialized first
            if (typeof firebase === 'undefined' || !firebase.apps.length) {
                throw new Error("Firebase is not initialized. Please check your Firebase configuration.");
            }
            
            // Initialize test data
            await initializeTestData();

            // Generate law cards
            await generateLawCards();
            
            // Rest of your initialization code can remain unchanged
            // Category filter functionality
            const categoryFilters = document.querySelectorAll('.category-filter');
            categoryFilters.forEach(filter => {
                filter.addEventListener('click', () => {
                    // Update active filter
                    categoryFilters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');

                    const selectedCategory = filter.getAttribute('data-category');
                    filterLawsByCategory(selectedCategory);
                });
            });

            // Search functionality
            const searchInput = document.getElementById('law-search');
            const searchButton = document.querySelector('.search-btn');

            function performSearch() {
                searchLaws(searchInput.value);
            }

            searchButton.addEventListener('click', performSearch);
            searchInput.addEventListener('keyup', function(event) {
                if (event.key === 'Enter') {
                    performSearch();
                }
            });

            // Modal close functionality
            const lawModal = document.getElementById('lawModal');
            const closeModalBtn = document.querySelector('.close-modal');

            closeModalBtn.addEventListener('click', async function() {
                lawModal.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling

                // Refresh the law cards to update view counts
                await generateLawCards();
            });

            // Close modal if clicked outside content
            lawModal.addEventListener('click', async function(event) {
                if (event.target === lawModal) {
                    lawModal.classList.remove('active');
                    document.body.style.overflow = '';

                    // Refresh the law cards to update view counts
                    await generateLawCards();
                }
            });

            // Pagination functionality
            const paginationButtons = document.querySelectorAll('.pagination-btn');
            paginationButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (!this.classList.contains('active') && !this.classList.contains('next')) {
                        paginationButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');

                        // In a real implementation, this would change the page of laws
                        console.log('Switching to page:', this.textContent);
                    }
                });
            });
        } catch (error) {
            console.error("Error during page initialization:", error);
            document.querySelector('.laws-container').innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error loading application</h3>
                    <p>${error.message || "Could not initialize the application. Please check your connection and reload the page."}</p>
                </div>
            `;
        }
    })();
});