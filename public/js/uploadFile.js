// Modal functionality for law explanations
// Law Explanations JavaScript
let explanations = [];
let currentExplanationsPage = 1;
let explanationsPerPage = 6;
const addExplanationButton = document.getElementById('add-explanation-btn');
const addExplanationModal = document.getElementById('add-explanation-modal');
const closeExplanationModalButton = document.querySelector('.close-explanation-modal');
const cancelAddExplanationButton = document.getElementById('cancel-add-explanation');
const saveNewExplanationButton = document.getElementById('save-new-explanation');

function openAddExplanationModal() {
    const modal = document.getElementById('add-explanation-modal');
    if (!modal) return;
    
    // Reset form
    document.getElementById('add-explanation-form').reset();
    document.getElementById('add-explanation-form').removeAttribute('data-edit-id');
    document.querySelector('.explanation-tags-container').innerHTML = '';
    document.querySelector('.explanation-uploaded-files').innerHTML = '';
    
    // Update modal title
    document.querySelector('#add-explanation-modal .modal-header h3').textContent = 'Add Law Explanation';
    
    // Populate related laws dropdown
    populateRelatedLawsDropdown();
    
    // Show modal
    modal.style.display = 'block';
}

}
function closeAddExplanationModal() {
    const modal = document.getElementById('add-explanation-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

addExplanationButton.addEventListener('click', openAddExplanationModal);
closeExplanationModalButton.addEventListener('click', closeAddExplanationModal);
cancelAddExplanationButton.addEventListener('click', closeAddExplanationModal);

// // Function to populate the "Related Law" dropdown with existing laws
///replace if not 

async function populateRelatedLawsDropdown() {
    const relatedLawSelect = document.getElementById('related-law');
    if (!relatedLawSelect) return;
    
    // Clear existing options except the first one
    while (relatedLawSelect.options.length > 1) {
        relatedLawSelect.remove(1);
    }
    
    // Load laws
    const laws = await loadLaws();
    
    // Add laws to dropdown
    laws.forEach(law => {
        const option = document.createElement('option');
        option.value = law.id;
        option.textContent = `#${law.id} - ${law.title}`;
        relatedLawSelect.appendChild(option);
    });
}



async function handleExplanationFormSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    showNotification('Saving explanation...', 'info');
    
    const formData = {
        title: document.getElementById('explanation-title').value,
        relatedLawId: document.getElementById('related-law').value,
        category: document.getElementById('explanation-category').value,
        status: document.getElementById('explanation-status').value,
        summary: document.getElementById('explanation-summary').value,
        content: document.getElementById('explanation-content').value,
        dateCreated: new Date().toISOString().split('T')[0],
        views: 0
    };
    
    // Get tags
    const tagElements = document.querySelectorAll('.explanation-tags-container .tag');
    formData.tags = Array.from(tagElements).map(tag => tag.getAttribute('data-value'));
    
    // Check if editing an existing explanation
    const editId = document.getElementById('add-explanation-form').getAttribute('data-edit-id');
    
    try {
        // Handle file uploads
        const fileInput = document.getElementById('explanation-documents');
        let documentsList = [];
        
        // Only process documents if there are files selected
        if (fileInput.files && fileInput.files.length > 0) {
            // Generate ID for new explanations if needed
            const explanationId = editId ? editId : await generateExplanationId();
            
            // Upload documents and get their metadata
            documentsList = await uploadExplanationDocuments(explanationId, fileInput.files);
        }
        
        // Add documents to formData
        formData.documents = documentsList;
        
        // Save the explanation with documents included
        let savedExplanation;
        if (editId) {
            formData.id = editId;
            savedExplanation = await updateExplanation(editId, formData);
        } else {
            savedExplanation = await addNewExplanation(formData);
        }
        
        if (savedExplanation) {
            // Close modal and refresh display
            closeAddExplanationModal();
            displayExplanations();
            
            // Show success notification
            showNotification('Explanation saved successfully with documents!', 'success');
        } else {
            // Show error notification
            showNotification('Error saving explanation. Please try again.', 'error');
        }
    } catch (error) {
        console.error("Error handling form submission:", error);
        showNotification('An error occurred while saving. Please try again.', 'error');
    }
}
// Handle tags input for explanations
const explanationTagInput = document.getElementById('explanation-tag-input');
const explanationTagsContainer = document.querySelector('.explanation-tags-container');

explanationTagInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && explanationTagInput.value.trim() !== '') {
        e.preventDefault();

        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${explanationTagInput.value.trim()}
            <span class="tag-close"><i class="fas fa-times"></i></span>
        `;

        tag.querySelector('.tag-close').addEventListener('click', function () {
            tag.remove();
        });

        explanationTagsContainer.appendChild(tag);
        explanationTagInput.value = '';
    }
});

// // Handle file uploads for explanations
const explanationFileInput = document.getElementById('explanation-documents');
const explanationUploadedFiles = document.querySelector('.explanation-uploaded-files');


explanationFileInput.addEventListener('change', function() {
    explanationUploadedFiles.innerHTML = '';
    
    if (!this.files || this.files.length === 0) return;
    
    const totalFileSize = Array.from(this.files).reduce((total, file) => total + file.size, 0);
    const maxFileSizeMB = 20; // Maximum total file size in MB
    const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;
    
    if (totalFileSize > maxFileSizeBytes) {
        showNotification(`Total file size exceeds the ${maxFileSizeMB}MB limit`, 'error');
        this.value = ''; // Clear the file input
        return;
    }
    
    Array.from(this.files).forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        
        // Get appropriate icon based on file type
        let fileIcon = 'fa-file';
        if (file.type.includes('pdf')) fileIcon = 'fa-file-pdf';
        else if (file.type.includes('word')) fileIcon = 'fa-file-word';
        else if (file.type.includes('image')) fileIcon = 'fa-file-image';
        
        // Format file size
        const fileSize = formatFileSize(file.size);
        
        fileElement.innerHTML = `
            <span class="file-icon"><i class="fas ${fileIcon}"></i></span>
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${fileSize}</span>
            </div>
            <span class="file-remove"><i class="fas fa-times"></i></span>
        `;
        
        fileElement.querySelector('.file-remove').addEventListener('click', function() {
            fileElement.remove();
            // Note: This doesn't actually remove the file from the input
            // In a real implementation, we would need to create a new FileList object
        });
        
        explanationUploadedFiles.appendChild(fileElement);
    });
});
// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}
const EXPLANATIONS_STORAGE_KEY = 'legal_ai_explanations';
//  this function to handle file uploads to Firebase Storage
async function uploadExplanationDocuments(explanationId, files) {
    if (!files || files.length === 0) return [];
    
    const uploadedDocs = [];
    
    try {
        // Create a reference to the Firebase storage
        const storageRef = firebase.storage().ref();
        
        // Upload each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const timestamp = new Date().getTime();
            const fileExtension = file.name.split('.').pop();
            const fileName = `explanations/${explanationId}/${timestamp}_${i}.${fileExtension}`;
            
            // Upload file to Firebase Storage
            const fileRef = storageRef.child(fileName);
            const snapshot = await fileRef.put(file);
            
            // Get download URL
            const downloadURL = await snapshot.ref.getDownloadURL();
            
            // Add file info to uploaded documents array
            uploadedDocs.push({
                name: file.name,
                type: file.type,
                size: file.size,
                url: downloadURL,
                path: fileName,
                uploadedAt: firebase.firestore.Timestamp.fromDate(new Date())
            });
        }
        
        return uploadedDocs;
    } catch (error) {
        console.error("Error uploading documents:", error);
        showNotification('Error uploading documents', 'error');
        return [];
    }
}
// Function to save law explanations

async function saveLawExplanations(explanations) {
    try {
        const explanationsCollection = db.collection("lawExplanations");
        
        for (const explanation of explanations) {
            // Create a valid date object for each explanation
            let dateObj;
            try {
                dateObj = new Date(explanation.datePublished);
                if (isNaN(dateObj.getTime())) {
                    dateObj = new Date();
                }
            } catch (e) {
                dateObj = new Date();
            }
            
            // Check if this explanation already exists in Firestore
            const querySnapshot = await explanationsCollection
                .where("id", "==", explanation.id)
                .get();
            
            if (!querySnapshot.empty) {
                // Update existing explanation
                const docRef = querySnapshot.docs[0].ref;
                await docRef.update({
                    title: explanation.title,
                    relatedLawId: explanation.relatedLawId,
                    category: explanation.category,
                    status: explanation.status,
                    summary: explanation.summary,
                    content: explanation.content,
                    lastUpdated: firebase.firestore.Timestamp.fromDate(new Date()),
                    tags: explanation.tags || [],
                    documents: explanation.documents || []
                });
            } else {
                // Add new explanation
                await explanationsCollection.add({
                    id: explanation.id,
                    title: explanation.title,
                    relatedLawId: explanation.relatedLawId,
                    category: explanation.category,
                    status: explanation.status,
                    summary: explanation.summary,
                    content: explanation.content,
                    datePublished: firebase.firestore.Timestamp.fromDate(dateObj),
                    lastUpdated: firebase.firestore.Timestamp.fromDate(new Date()),
                    views: explanation.views || 0,
                    tags: explanation.tags || [],
                    documents: explanation.documents || []
                });
            }
        }
        
        console.log("Law explanations saved successfully!"); 
        // Also save to localStorage as backup
        localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
    } catch (error) {
        console.error("Error saving explanations to Firebase:", error);
        // Save to localStorage
        localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
    }
}


// Function to load law explanations
async function loadExplanations() {
    try {
        const querySnapshot = await db.collection("lawExplanations").get();
        let explanations = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert Firestore timestamps to JavaScript Date
            if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
                data.datePublished = data.datePublished.toDate();
            }
            if (data.lastUpdated && data.lastUpdated instanceof firebase.firestore.Timestamp) {
                data.lastUpdated = data.lastUpdated.toDate();
            }
             // Store the Firestore document ID along with the data
            explanations.push({ 
                firestoreId: doc.id,  // Add this to keep reference to the Firestore document
                ...data 
            });
        });
        
        return explanations;
    } catch (error) {
        console.error("Error fetching law explanations:", error);
        return loadLocalExplanations();
    }
}


// Function to load explanations from localStorage (fallback)
function loadLocalExplanations() {
    const explanationsJson = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
    return explanationsJson ? JSON.parse(explanationsJson) : [];
}

// Function to generate a unique ID for new explanations
async function generateExplanationId() {
    const explanations = await loadExplanations();
    let maxId = 0;

    explanations.forEach(explanation => {
        const idMatch = explanation.id.match(/(?:#EXP-)?(\d+)/);
        if (idMatch && idMatch[1]) {
            const idNum = parseInt(idMatch[1]);
            if (idNum > maxId) maxId = idNum;
        }
    });

    const newId = maxId + 1;
    return `#EXP-${String(newId).padStart(3, '0')}`;
}

// Function to add a new explanation
async function addNewExplanation(explanationData) {
    const explanations = await loadExplanations();
    // Create a proper date string in ISO format
    const today = new Date();
    const dateString = today.toISOString();
    
    const newExplanation = {
        id: await generateExplanationId(),
        title: explanationData.title,
        relatedLawId: explanationData.relatedLawId,
        category: explanationData.category,
        status: explanationData.status,
        summary: explanationData.summary,
        content: explanationData.content,
        datePublished: dateString,
        lastUpdated: dateString,
        views: 0,
        tags: explanationData.tags || [],
        documents: explanationData.documents || []
    };

    explanations.push(newExplanation);
    await saveLawExplanations([newExplanation]); // Save only the new explanation
    return newExplanation;
}

// Function to get explanations for a specific law
async function getRelatedExplanations(lawId) {
    const allExplanations = await loadExplanations();
    return allExplanations.filter(explanation => explanation.relatedLawId === lawId);
}


// Update the updateExplanation function to handle documents
async function updateExplanation(explanationId, updatedData) {
    try {
        // Find the document in Firestore
        const querySnapshot = await db.collection("lawExplanations")
            .where("id", "==", explanationId)
            .get();
            
        if (querySnapshot.empty) {
            console.error("Explanation not found:", explanationId);
            return null;
        }
        
        // Get the document reference
        const docRef = querySnapshot.docs[0].ref;
        
        // Get existing documents if any
        const currentData = querySnapshot.docs[0].data();
        let combinedDocuments = currentData.documents || [];
        
        // Add new documents if provided
        if (updatedData.documents && updatedData.documents.length > 0) {
            combinedDocuments = [...combinedDocuments, ...updatedData.documents];
        }
        
        // Update the document
        await docRef.update({
            title: updatedData.title,
            relatedLawId: updatedData.relatedLawId,
            category: updatedData.category,
            status: updatedData.status,
            summary: updatedData.summary,
            content: updatedData.content,
            lastUpdated: firebase.firestore.Timestamp.fromDate(new Date()),
            tags: updatedData.tags || [],
            documents: combinedDocuments
        });
        
        // Return the updated data
        const updatedDoc = await docRef.get();
        return { firestoreId: updatedDoc.id, ...updatedDoc.data() };
    } catch (error) {
        console.error("Error updating explanation:", error);
        return null;
    }
}
// Function to delete an explanation

async function deleteExplanation(id) {
    if (!confirm('Are you sure you want to delete this explanation? This action cannot be undone.')) {
        return;
    }
    
    try {
        // If using Firebase
        if (typeof db !== 'undefined') {
            await db.collection('explanations').doc(id).delete();
        } else {
            // If using localStorage
            const explanations = await loadExplanations();
            const updatedExplanations = explanations.filter(e => e.id !== id);
            localStorage.setItem('lawExplanations', JSON.stringify(updatedExplanations));
        }
        
        // Refresh display
        displayExplanations();
        showNotification('Explanation deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting explanation:', error);
        showNotification('Error deleting explanation', 'error');
    }
}

// Function to increment the view count of an explanation
async function incrementExplanationViews(explanationId) {
    try {
        const explanations = await loadExplanations();
        const explanationIndex = explanations.findIndex(exp => exp.id === explanationId);
        
        if (explanationIndex !== -1) {
            // Increment view count
            explanations[explanationIndex].views = (explanations[explanationIndex].views || 0) + 1;
            
            // Update in Firebase
            const querySnapshot = await db.collection("lawExplanations")
                .where("id", "==", explanationId)
                .get();
                
            querySnapshot.forEach((doc) => {
                doc.ref.update({
                    views: explanations[explanationIndex].views
                });
            });
            
            // Update in localStorage
            localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
            
            return explanations[explanationIndex].views;
        }
        
        return null; // Return null if explanation not found
    } catch (error) {
        console.error("Error incrementing explanation views:", error);
        return null;
    }
}
// Helper function for tag input
function setupTagInput(inputId, containerId) {
    const tagInput = document.getElementById(inputId);
    const tagsContainer = document.getElementById(containerId) || document.querySelector(`.${containerId}`);
    
    if (!tagInput || !tagsContainer) return;
    
    tagInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            
            const tagValue = tagInput.value.trim();
            if (tagValue) {
                addTag(tagValue, tagsContainer, inputId);
                tagInput.value = '';
            }
        }
    });
}

async function displayExplanations() {
    const tableBody = document.getElementById('explanations-table-body');
    if (!tableBody) return;
    
    explanations = await loadExplanations();
    
    // Clear the table
    tableBody.innerHTML = '';
    
    // Calculate pagination
    const startIndex = (currentExplanationsPage - 1) * explanationsPerPage;
    const endIndex = startIndex + explanationsPerPage;
    const paginatedExplanations = explanations.slice(startIndex, endIndex);
    
    if (paginatedExplanations.length === 0) {
        // Display empty state
        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="empty-state">
                        <i class="fas fa-lightbulb"></i>
                        <h3>No explanations yet</h3>
                        <p>Add your first law explanation to help users understand legal concepts.</p>
                        <button class="btn-primary" id="empty-add-explanation"><i class="fas fa-plus"></i> Add Law Explanation</button>
                    </div>
                </td>
            </tr>
        `;
        
        // Attach event listener to the empty state button
        document.getElementById('empty-add-explanation')?.addEventListener('click', openAddExplanationModal);
    } else {
        // Populate the table with explanations
        paginatedExplanations.forEach(explanation => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><input type="checkbox" class="explanation-checkbox" data-id="${explanation.id}"></td>
                <td>#${explanation.id}</td>
                <td>${explanation.title}</td>
                <td>${explanation.relatedLaw || ''}</td>
                <td><span class="category-badge ${explanation.category.toLowerCase()}">${capitalizeFirstLetter(explanation.category)}</span></td>
                <td>${formatDate(explanation.dateCreated || new Date())}</td>
                <td><span class="status-badge ${explanation.status.toLowerCase()}">${capitalizeFirstLetter(explanation.status)}</span></td>
                <td>${explanation.views || 0}</td>
                <td class="action-buttons">
                    <button class="btn-icon view-explanation" data-id="${explanation.id}"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon edit-explanation" data-id="${explanation.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-explanation" data-id="${explanation.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Attach event listeners to buttons
        attachExplanationEventListeners();
    }
    
    // Update pagination display
    updateExplanationsPagination();
}
function updateExplanationsPagination() {
    const totalPages = Math.ceil(explanations.length / explanationsPerPage);
    document.getElementById('explanations-showing').textContent =  explanations.length > 0 ? 
        `${(currentExplanationsPage - 1) * explanationsPerPage + 1}-${Math.min(currentExplanationsPage * explanationsPerPage, explanations.length)}` : 
        '0-0';
    document.getElementById('explanations-total').textContent = explanations.length;
    
    // Generate pagination numbers
    const paginationNumbers = document.getElementById('explanations-pagination-numbers');
    paginationNumbers.innerHTML = '';
    
    if (totalPages <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= totalPages; i++) {
            addPaginationNumber(i, paginationNumbers);
        }
    } else {
        // Complex pagination with ellipses
        if (currentExplanationsPage <= 4) {
            // Near start
            for (let i = 1; i <= 5; i++) {
                addPaginationNumber(i, paginationNumbers);
            }
            addEllipsis(paginationNumbers);
            addPaginationNumber(totalPages, paginationNumbers);
        } else if (currentExplanationsPage >= totalPages - 3) {
            // Near end
            addPaginationNumber(1, paginationNumbers);
            addEllipsis(paginationNumbers);
            for (let i = totalPages - 4; i <= totalPages; i++) {
                addPaginationNumber(i, paginationNumbers);
            }
        } else {
            // Middle
            addPaginationNumber(1, paginationNumbers);
            addEllipsis(paginationNumbers);
            for (let i = currentExplanationsPage - 1; i <= currentExplanationsPage + 1; i++) {
                addPaginationNumber(i, paginationNumbers);
            }
            addEllipsis(paginationNumbers);
            addPaginationNumber(totalPages, paginationNumbers);
        }
    }
    
    // Enable/disable prev/next buttons
    document.getElementById('explanations-prev-page').disabled = currentExplanationsPage === 1;
    document.getElementById('explanations-next-page').disabled = currentExplanationsPage === totalPages || totalPages === 0;
}

function addPaginationNumber(number, container) {
    const button = document.createElement('button');
    button.className = `pagination-btn${number === currentExplanationsPage ? ' active' : ''}`;
    button.textContent = number;
    button.addEventListener('click', () => {
        currentExplanationsPage = number;
        displayExplanations();
    });
    container.appendChild(button);
}
// Helper function to add ellipsis
function addEllipsis(container) {
    const span = document.createElement('span');
    span.className = 'pagination-ellipsis';
    span.textContent = '...';
    container.appendChild(span);
}
function attachExplanationEventListeners() {
    // View explanation buttons
    document.querySelectorAll('.view-explanation').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            viewExplanation(id);
        });
    });
    
    // Edit explanation buttons
    document.querySelectorAll('.edit-explanation').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            editExplanation(id);
        });
    });
    
    // Delete explanation buttons
    document.querySelectorAll('.delete-explanation').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            deleteExplanation(id);
        });
    });
    
    // Select all checkbox
    document.getElementById('select-all-explanations')?.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        document.querySelectorAll('.explanation-checkbox').forEach(checkbox => {
            checkbox.checked = isChecked;
        });
    });
}
// Function to attach event listeners to explanation action buttons
function attachExplanationActionListeners() {
    // View explanation
    document.querySelectorAll('.view-explanation').forEach(button => {
        button.addEventListener('click', function () {
            const explanationId = this.getAttribute('data-id');
            viewExplanation(explanationId);
        });
    });

    // Edit explanation
    document.querySelectorAll('.edit-explanation').forEach(button => {
        button.addEventListener('click', function () {
            const explanationId = this.getAttribute('data-id');
            editExplanation(explanationId);
        });
    });

    // Delete explanation
    document.querySelectorAll('.delete-explanation').forEach(button => {
        button.addEventListener('click', function () {
            const explanationId = this.getAttribute('data-id');
            confirmDeleteExplanation(explanationId);
        });
    });
}

// Function to view an explanation

async function viewExplanation(id) {
    const explanations = await loadExplanations();
    const explanation = explanations.find(e => e.id === id);
    
    if (!explanation) {
        showNotification('Explanation not found', 'error');
        return;
    }
    
    // Implement your view modal or page here
    // This is a placeholder for the view functionality
    console.log('Viewing explanation:', explanation);
    showNotification('View explanation functionality to be implemented', 'info');
}


// Update the editExplanation function to display existing documents
async function editExplanation(id) {
    const explanations = await loadExplanations();
    const explanation = explanations.find(e => e.id === id);
    
    if (!explanation) {
        showNotification('Explanation not found', 'error');
        return;
    }
    
    // Open the modal
    openAddExplanationModal();
    
    // Set form as editing mode
    document.getElementById('add-explanation-form').setAttribute('data-edit-id', id);
    document.querySelector('#add-explanation-modal .modal-header h3').textContent = 'Edit Law Explanation';
    
    // Populate form fields
    document.getElementById('explanation-title').value = explanation.title;
    document.getElementById('explanation-summary').value = explanation.summary || '';
    document.getElementById('explanation-content').value = explanation.content || '';
    
    // Wait for the related law dropdown to be populated
    setTimeout(() => {
        document.getElementById('related-law').value = explanation.relatedLawId || '';
        document.getElementById('explanation-category').value = explanation.category || '';
        document.getElementById('explanation-status').value = explanation.status || 'published';
    }, 100);
    
    // Add tags
    const tagsContainer = document.querySelector('.explanation-tags-container');
    tagsContainer.innerHTML = '';
    
    if (explanation.tags && explanation.tags.length > 0) {
        explanation.tags.forEach(tag => {
            addTag(tag, tagsContainer, 'explanation-tag-input');
        });
    }
    
    // Display existing documents
    const uploadedFilesContainer = document.querySelector('.explanation-uploaded-files');
    uploadedFilesContainer.innerHTML = '';
    
    if (explanation.documents && explanation.documents.length > 0) {
        explanation.documents.forEach(doc => {
            const fileElement = document.createElement('div');
            fileElement.className = 'uploaded-file';
            fileElement.innerHTML = `
                <span class="file-icon"><i class="fas fa-file"></i></span>
                ${doc.name}
                <a href="${doc.url}" target="_blank" class="file-download"><i class="fas fa-download"></i></a>
                <span class="file-remove" data-path="${doc.path}"><i class="fas fa-times"></i></span>
            `;
            
            // Add listener for document removal
            fileElement.querySelector('.file-remove').addEventListener('click', function() {
                const path = this.getAttribute('data-path');
                if (confirm('Are you sure you want to remove this document?')) {
                    removeExplanationDocument(id, path, fileElement);
                }
            });
            
            uploadedFilesContainer.appendChild(fileElement);
        });
    }
}
// Add function to remove a document
async function removeExplanationDocument(explanationId, docPath, fileElement) {
    try {
        // Get the explanation from Firestore
        const querySnapshot = await db.collection("lawExplanations")
            .where("id", "==", explanationId)
            .get();
            
        if (querySnapshot.empty) {
            showNotification('Explanation not found', 'error');
            return false;
        }
        
        const docRef = querySnapshot.docs[0].ref;
        const explanationData = querySnapshot.docs[0].data();
        
        // Filter out the document to remove
        const updatedDocs = (explanationData.documents || []).filter(doc => doc.path !== docPath);
        
        // Update Firestore
        await docRef.update({
            documents: updatedDocs,
            lastUpdated: firebase.firestore.Timestamp.fromDate(new Date())
        });
        
        // Remove from Storage
        try {
            const storageRef = firebase.storage().ref(docPath);
            await storageRef.delete();
        } catch (storageError) {
            console.warn("Could not delete file from storage:", storageError);
            // Continue anyway as we've removed it from the document
        }
        
        // Remove element from the UI
        if (fileElement) {
            fileElement.remove();
        }
        
        showNotification('Document removed successfully', 'success');
        return true;
    } catch (error) {
        console.error("Error removing document:", error);
        showNotification('Error removing document', 'error');
        return false;
    }
}

// Helper function to add a tag
function addTag(text, container, inputId) {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.setAttribute('data-value', text);
    tag.innerHTML = `
        ${text}
        <button class="tag-remove" data-input="${inputId}">&times;</button>
    `;
    container.appendChild(tag);
    
    // Add event listener to remove button
    tag.querySelector('.tag-remove').addEventListener('click', (e) => {
        e.preventDefault();
        tag.remove();
    });
}
// Function to confirm and delete an explanation
async function confirmDeleteExplanation(explanationId) {
    if (confirm('Are you sure you want to delete this explanation?')) {
        const success = await deleteExplanation(explanationId);
        
        if (success) {
            // Refresh the display
            displayExplanations();
        } else {
            alert('Failed to delete explanation. Please try again.');
        }
    }
}
// Helper function to show notifications
function showNotification(message, type = 'info') {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Add close event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Update the save explanation functionality
saveNewExplanationButton.addEventListener('click', async function () {
    const form = document.getElementById('add-explanation-form');

    if (form.checkValidity()) {
        // Collect form data
        const explanationData = {
            title: document.getElementById('explanation-title').value,
            relatedLawId: document.getElementById('related-law').value,
            category: document.getElementById('explanation-category').value,
            status: document.getElementById('explanation-status').value,
            summary: document.getElementById('explanation-summary').value,
            content: document.getElementById('explanation-content').value,
            tags: Array.from(document.querySelectorAll('.explanation-tags-container .tag')).map(tag => tag.textContent.trim())
        };

        // Check if we're editing or adding
        const editingId = saveNewExplanationButton.getAttribute('data-editing');

        if (editingId) {
            // Editing existing explanation
            await updateExplanation(editingId, explanationData);
            saveNewExplanationButton.removeAttribute('data-editing');
        } else {
            // Adding new explanation
            await addNewExplanation(explanationData);
        }

        // Display success message
        alert('Explanation saved successfully!');

        // Close the modal
        closeAddExplanationModal();

        // Refresh the display
        displayExplanations();
    } else {
        // Trigger browser's built-in validation UI
        form.reportValidity();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Set up tabs for switching between laws and explanations
    const lawsTab = document.createElement('div');
    lawsTab.className = 'section-tab active';
    lawsTab.textContent = 'Laws';
    lawsTab.id = 'laws-tab';
    
    const explanationsTab = document.createElement('div');
    explanationsTab.className = 'section-tab';
    explanationsTab.textContent = 'Explanations';
    explanationsTab.id = 'explanations-tab';
    
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'section-tabs';
    tabsContainer.appendChild(lawsTab);
    tabsContainer.appendChild(explanationsTab);
    
    // Insert tabs before the laws table
    const lawsManagementSection = document.getElementById('laws-management');
    if (lawsManagementSection) {
        const firstChild = lawsManagementSection.querySelector('.section-header');
        if (firstChild) {
            lawsManagementSection.insertBefore(tabsContainer, firstChild);
        }
    }
    
    // Initialize tag inputs
    setupTagInput('explanation-tag-input', 'explanation-tags-container');
    
    // Set up tabs event listeners
    lawsTab.addEventListener('click', function() {
        lawsTab.classList.add('active');
        explanationsTab.classList.remove('active');
        
        // Show laws content, hide explanations content
        document.querySelector('.laws-table-container').style.display = 'block';
        document.querySelector('.explanations-table-container').style.display = 'none';
        
        // Show laws pagination, hide explanations pagination
        document.querySelectorAll('.table-pagination')[0].style.display = 'flex';
        document.querySelectorAll('.table-pagination')[1].style.display = 'none';
    });
    
    explanationsTab.addEventListener('click', function() {
        explanationsTab.classList.add('active');
        lawsTab.classList.remove('active');
        
        // Hide laws content, show explanations content
        document.querySelector('.laws-table-container').style.display = 'none';
        document.querySelector('.explanations-table-container').style.display = 'block';
        
        // Hide laws pagination, show explanations pagination
        document.querySelectorAll('.table-pagination')[0].style.display = 'none';
        document.querySelectorAll('.table-pagination')[1].style.display = 'flex';
        
        // Load explanations data
        displayExplanations();
    });
    
    // Add event listeners for explanation modal
    document.getElementById('add-explanation-btn')?.addEventListener('click', openAddExplanationModal);
    document.querySelector('.close-explanation-modal')?.addEventListener('click', closeAddExplanationModal);
    document.getElementById('cancel-add-explanation')?.addEventListener('click', closeAddExplanationModal);
    document.getElementById('add-explanation-form')?.addEventListener('submit', handleExplanationFormSubmit);
    document.getElementById('save-new-explanation')?.addEventListener('click', function(e) {
        document.getElementById('add-explanation-form').dispatchEvent(new Event('submit'));
    });
    
    // Add event listeners for pagination
    document.getElementById('explanations-prev-page')?.addEventListener('click', function() {
        if (currentExplanationsPage > 1) {
            currentExplanationsPage--;
            displayExplanations();
        }
    });
    
    document.getElementById('explanations-next-page')?.addEventListener('click', function() {
        const totalPages = Math.ceil(explanations.length / explanationsPerPage);
        if (currentExplanationsPage < totalPages) {
            currentExplanationsPage++;
            displayExplanations();
        }
    });
    
    document.getElementById('explanations-per-page')?.addEventListener('change', function(e) {
        explanationsPerPage = parseInt(e.target.value);
        currentExplanationsPage = 1;
        displayExplanations();
    });
    
    // Initialize notifications container
    if (!document.querySelector('.notification-container')) {
        const notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
});
async function initializeSampleExplanations() {
    const explanations = await loadExplanations();
    
    if (!explanations || explanations.length === 0) {
        const sampleExplanations = [
            {
                id: "EXP-001",
                title: "Understanding Property Rights",
                relatedLaw: "LW-002",
                category: "interpretation",
                summary: "This explanation clarifies the scope of property rights under the Civil Code.",
                content: "Property rights are fundamental to our legal system...",
                dateCreated: "2025-02-15",
                status: "published",
                views: 128,
                tags: ["property", "rights", "civil code"]
            },
            {
                id: "EXP-002",
                title: "Applying Criminal Code Section 15",
                relatedLaw: "LW-003",
                category: "clarification",
                summary: "This explanation provides guidance on how to apply Section 15 of the Criminal Code.",
                content: "Section 15 of the Criminal Code addresses...",
                dateCreated: "2025-02-20",
                status: "published",
                views: 75,
                tags: ["criminal", "section 15", "application"]
            },
            {
                id: "EXP-003",
                title: "Recent Court Precedents on Article 5",
                relatedLaw: "LW-001",
                category: "precedent",
                summary: "This explanation summarizes recent court decisions related to Article 5 of the Constitution.",
                content: "In the past year, several landmark cases have interpreted Article 5...",
                dateCreated: "2025-03-01",
                status: "published",
                views: 210,
                tags: ["constitution", "article 5", "court decisions"]
            }
        ];
        
        // Save sample explanations
        for (const explanation of sampleExplanations) {
            await saveExplanation(explanation);
        }
    }
}
initializeSampleExplanations();

// You may want to create additional functions to display explanations in a table
// Similar to how you display laws, but I'll include the function structure here
/*
function displayExplanations() {
    const explanations = loadExplanations();
    const explanationsTableBody = document.querySelector('.explanations-table tbody');
    // Implement similar to displayLaws() function
}
*/