const firebaseConfig = {
    apiKey: "AIzaSyAVXgBSIDI6bjXRAbFbOMH392jDD3KDZ20",
    authDomain: "legalai-59b8d.firebaseapp.com",
    projectId: "legalai-59b8d",
    storageBucket: "legalai-59b8d.firebasestorage.app",
    messagingSenderId: "236789677114",
    appId: "1:236789677114:web:a4ea3b26877f2ee66a0903"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    const currentDate = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', dateOptions);

    setupBulkOperations();


    // Setup navigation
    // setupNavigation();

    // Setup Charts
    // setupCharts();
});


// Get Firestore reference
// Mobile sidebar toggle functionality
function setupMobileSidebar() {
    // Create the sidebar toggle button if it doesn't exist
    if (!document.querySelector('.sidebar-toggle')) {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'sidebar-toggle';
        toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('.dashboard-header').prepend(toggleButton);
    }

    // Add click event to toggle sidebar
    document.querySelector('.sidebar-toggle').addEventListener('click', function () {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function (e) {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.querySelector('.sidebar-toggle');

        if (sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}
////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
    // Set current date
    const currentDateElement = document.getElementById("current-date");
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);

    // Sidebar toggle for mobile
    setupMobileSidebar();

    // Navigation active state
    const navLinks = document.querySelectorAll('.sidebar-nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.parentElement.classList.remove('active');
            });

            // Add active class to clicked link
            this.parentElement.classList.add('active');

            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const sections = document.querySelectorAll('.dashboard-section');

            sections.forEach(section => {
                section.style.display = 'none';
            });

            document.getElementById(targetId).style.display = 'block';
        });
    });

    // Charts
    // User Activity Chart
    const userActivityCtx = document.getElementById('userActivityChart').getContext('2d');
    const userActivityChart = new Chart(userActivityCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'This Week',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    borderColor: '#056d6c',
                    backgroundColor: 'rgba(5, 109, 108, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Last Week',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    borderColor: '#cccccc',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Laws by Category Chart
    const lawCategoriesCtx = document.getElementById('lawCategoriesChart').getContext('2d');
    const lawCategoriesChart = new Chart(lawCategoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Constitutional', 'Civil', 'Criminal', 'Administrative', 'Corporate', 'Tax'],
            datasets: [{
                data: [18, 25, 30, 15, 22, 20],
                backgroundColor: [
                    '#056d6c',
                    '#35a29f',
                    '#97dece',
                    '#071952',
                    '#0b666a',
                    '#35a29f'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            cutout: '70%'
        }
    });

    // Chart period selectors
    const chartPeriodButtons = document.querySelectorAll('.chart-actions .btn-outline');

    chartPeriodButtons.forEach(button => {
        button.addEventListener('click', function () {
            chartPeriodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Here you would update chart data based on selected period
            // For demo purposes, we'll just randomize the data
            const newData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
            userActivityChart.data.datasets[0].data = newData;
            userActivityChart.update();
        });
    });

    // Activity item dropdown menus
    const activityDropdownButtons = document.querySelectorAll('.activity-item .btn-icon');

    activityDropdownButtons.forEach(button => {
        button.addEventListener('click', function () {
            const dropdown = document.createElement('div');
            dropdown.classList.add('activity-dropdown');
            dropdown.innerHTML = `
                <ul>
                    <li><a href="#"><i class="fas fa-eye"></i> View Details</a></li>
                    <li><a href="#"><i class="fas fa-edit"></i> Edit</a></li>
                    <li><a href="#" class="text-danger"><i class="fas fa-trash"></i> Delete</a></li>
                </ul>
            `;

            // Remove any existing dropdowns
            document.querySelectorAll('.activity-dropdown').forEach(d => d.remove());

            // Add new dropdown
            this.appendChild(dropdown);

            // Close dropdown when clicking outside
            document.addEventListener('click', function closeDropdown(e) {
                if (!e.target.closest('.btn-icon')) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });

            // Prevent event propagation
            dropdown.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        });
    });
});
// Handle category and status filters
const categoryFilter = document.getElementById('category-filter');
const statusFilter = document.getElementById('status-filter');
const searchInput = document.getElementById('law-search');

function applyFilters() {
    const categoryValue = categoryFilter.value.toLowerCase();
    const statusValue = statusFilter.value.toLowerCase();
    const searchValue = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('.laws-table tbody tr');

    rows.forEach(row => {
        const categoryText = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        const statusText = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
        const lawTitle = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const lawId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

        const matchesCategory = categoryValue === '' || categoryText.includes(categoryValue);
        const matchesStatus = statusValue === '' || statusText.includes(statusValue);
        const matchesSearch = searchValue === '' ||
            lawTitle.includes(searchValue) ||
            lawId.includes(searchValue);

        if (matchesCategory && matchesStatus && matchesSearch) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    updatePaginationInfo();
}


// Event listeners for filters
categoryFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);


// Select all checkbox functionality
const selectAllCheckbox = document.getElementById('select-all-laws');

if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function () {
        // Get all checkboxes that currently exist in the DOM
        const currentLawCheckboxes = document.querySelectorAll('.law-checkbox');
        
        currentLawCheckboxes.forEach(checkbox => {
            const row = checkbox.closest('tr');
            if (!row || row.style.display !== 'none') {
                checkbox.checked = selectAllCheckbox.checked;
            }
        });
    });
}
// Add a bulk delete button to your HTML if it doesn't already exist
// <button id="bulk-delete-btn" class="btn btn-danger">Delete Selected</button>


// Bulk delete functionality
function setupBulkOperations() {
    const selectAllCheckbox = document.getElementById('select-all-laws');
    const bulkDeleteButton = document.getElementById('bulk-delete-btn');
    
    // Remove existing event listeners before adding new ones
    if (selectAllCheckbox) {
        const newSelectAllCheckbox = selectAllCheckbox.cloneNode(true);
        selectAllCheckbox.parentNode.replaceChild(newSelectAllCheckbox, selectAllCheckbox);
        
        newSelectAllCheckbox.addEventListener('change', function () {
            // Get all checkboxes that currently exist in the DOM
            const currentLawCheckboxes = document.querySelectorAll('.law-checkbox');
            
            currentLawCheckboxes.forEach(checkbox => {
                const row = checkbox.closest('tr');
                if (!row || row.style.display !== 'none') {
                    checkbox.checked = newSelectAllCheckbox.checked;
                }
            });
            
            // Update UI based on selection state
            updateBulkActionUI();
        });
    }
    
    if (bulkDeleteButton) {
        // Remove existing event listeners by cloning and replacing the button
        const newBulkDeleteButton = bulkDeleteButton.cloneNode(true);
        bulkDeleteButton.parentNode.replaceChild(newBulkDeleteButton, bulkDeleteButton);
        
        newBulkDeleteButton.addEventListener('click', async function() {
            const selectedCheckboxes = document.querySelectorAll('.law-checkbox:checked');
            
            if (selectedCheckboxes.length === 0) {
                alert('No laws selected');
                return;
            }
            
            // Show only one confirmation dialog with the correct count
            if (confirm(`Are you sure you want to delete ${selectedCheckboxes.length} selected laws?`)) {
                try {
                    // Get IDs of selected laws
                    const selectedIds = [];
                    selectedCheckboxes.forEach(checkbox => {
                        const lawId = checkbox.getAttribute('data-law-id') || 
                                    checkbox.closest('tr').getAttribute('data-id');
                        
                        if (lawId) {
                            selectedIds.push(lawId);
                        }
                    });
                    
                    // Delete selected laws from Firestore
                    const batch = db.batch();
                    
                    for (const id of selectedIds) {
                        const querySnapshot = await db.collection("laws").where("id", "==", id).get();
                        
                        if (!querySnapshot.empty) {
                            querySnapshot.forEach(doc => {
                                batch.delete(doc.ref);
                            });
                        }
                    }
                    
                    await batch.commit();
                    
                    // Reset select all checkbox
                    const currentSelectAllCheckbox = document.getElementById('select-all-laws');
                    if (currentSelectAllCheckbox) {
                        currentSelectAllCheckbox.checked = false;
                    }
                    
                    // Show only one success alert
                    alert('Selected laws deleted successfully');
                    
                    // Update local storage
                    const localLaws = loadLocalLaws();
                    const updatedLocalLaws = localLaws.filter(law => !selectedIds.includes(law.id));
                    saveLocalLaws(updatedLocalLaws);
                    
                    // Refresh the display
                    await displayLaws();
                } catch (error) {
                    console.error("Error deleting laws:", error);
                    alert('Error deleting laws. Please try again.');
                }
            }
        });
    }
    
    // Remove any existing global checkbox change listeners and add a new one
    document.removeEventListener('change', handleCheckboxChange);
    document.addEventListener('change', handleCheckboxChange);
}

// Separate function for the checkbox change handler to allow for removal
function handleCheckboxChange(e) {
    if (e.target && e.target.classList.contains('law-checkbox')) {
        updateBulkActionUI();
    }
}
// Update UI based on selection state
function updateBulkActionUI() {
    const selectedCheckboxes = document.querySelectorAll('.law-checkbox:checked');
    const bulkDeleteButton = document.getElementById('bulk-delete-btn');
    const selectAllCheckbox = document.getElementById('select-all-laws');
    
    if (bulkDeleteButton) {
        if (selectedCheckboxes.length > 0) {
            bulkDeleteButton.classList.add('active');
            bulkDeleteButton.textContent = `Delete Selected (${selectedCheckboxes.length})`;
        } else {
            bulkDeleteButton.classList.remove('active');
            bulkDeleteButton.textContent = 'Delete Selected';
        }
    }
    
    // Update "select all" checkbox state based on individual selections
    if (selectAllCheckbox) {
        const allCheckboxes = document.querySelectorAll('.law-checkbox');
        const visibleCheckboxes = Array.from(allCheckboxes).filter(checkbox => {
            const row = checkbox.closest('tr');
            return !row || row.style.display !== 'none';
        });
        
        if (visibleCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCheckboxes.length === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCheckboxes.length === visibleCheckboxes.length) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }
}

// Call this function in your document.addEventListener('DOMContentLoaded', ...) handler
// At the end, add: setupBulkOperations();

// // Pagination functionality
function setupPagination() {
    const paginationButtons = document.querySelectorAll('.pagination-btn:not([disabled])');
    const itemsPerPageSelect = document.getElementById('items-per-page');

    paginationButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (!this.classList.contains('active') && !this.disabled) {
                document.querySelector('.pagination-btn.active').classList.remove('active');
                this.classList.add('active');
                // In a real implementation, you would load the corresponding page data
            }
        });
    });

    itemsPerPageSelect.addEventListener('change', function () {
        // In a real implementation, you would adjust the number of rows shown
        alert(`Changed to ${this.value} items per page`);
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////
// Modal functionality
const addLawButton = document.getElementById('add-law-btn');
const addLawModal = document.getElementById('add-law-modal');
const closeModalButton = document.querySelector('.close-modal');
const cancelAddLawButton = document.getElementById('cancel-add-law');
const saveNewLawButton = document.getElementById('save-new-law');
if (saveNewLawButton) {
    saveNewLawButton.addEventListener('click', async function () {
        const form = document.getElementById('add-law-form');

        if (form && form.checkValidity()) {
            // Collect form data
            const lawData = {
                title: document.getElementById('law-title').value,
                category: document.getElementById('law-category').value,
                status: document.getElementById('law-status').value,
                description: document.getElementById('law-description').value,
                content: document.getElementById('law-content').value,
                tags: Array.from(document.querySelectorAll('.tags-container .tag')).map(tag => tag.textContent.trim())
            };

            // Check if we're editing or adding
            const editingId = saveNewLawButton.getAttribute('data-editing');

            if (editingId) {
                // Editing existing law
                const laws = await loadLaws();
                const lawIndex = laws.findIndex(law => law.id === editingId);

                if (lawIndex !== -1) {
                    // Preserve the original id, date, and views
                    const originalData = laws[lawIndex];
                    laws[lawIndex] = {
                        ...originalData,
                        title: lawData.title,
                        category: lawData.category,
                        status: lawData.status,
                        description: lawData.description,
                        content: lawData.content,
                        tags: lawData.tags
                    };

                    await saveLaws(laws);
                    saveNewLawButton.removeAttribute('data-editing');
                }
            } else {
                // Adding new law
                await addNewLaw(lawData);
            }

            // Display success message
            alert('Law saved successfully!');

            // Refresh the display
            await displayLaws();

            // Close the modal
            if (typeof closeAddLawModal === 'function') {
                closeAddLawModal();
            }
        } else if (form) {
            // Trigger browser's built-in validation UI
            form.reportValidity();
        }
    });
}

// Remove the second event listener completely
// DELETE THIS:
// saveNewLawButton.addEventListener('click', function () {
//     ...
// });
function openAddLawModal() {
    addLawModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddLawModal() {
    addLawModal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('add-law-form').reset();
    document.querySelector('.tags-container').innerHTML = '';
    document.querySelector('.uploaded-files').innerHTML = '';
    saveNewLawButton.removeAttribute('data-editing');
}

addLawButton.addEventListener('click', openAddLawModal);
closeModalButton.addEventListener('click', closeAddLawModal);
cancelAddLawButton.addEventListener('click', closeAddLawModal);

// Handle tags input
const tagInput = document.getElementById('tag-input');
const tagsContainer = document.querySelector('.tags-container');

tagInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && tagInput.value.trim() !== '') {
        e.preventDefault();

        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
            ${tagInput.value.trim()}
            <span class="tag-close"><i class="fas fa-times"></i></span>
        `;

        tag.querySelector('.tag-close').addEventListener('click', function () {
            tag.remove();
        });

        tagsContainer.appendChild(tag);
        tagInput.value = '';
    }
});

// Handle file uploads
const fileInput = document.getElementById('law-documents');
const uploadedFiles = document.querySelector('.uploaded-files');

fileInput.addEventListener('change', function () {
    uploadedFiles.innerHTML = '';

    Array.from(fileInput.files).forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.innerHTML = `
            <span class="file-icon"><i class="fas fa-file"></i></span>
            ${file.name}
            <span class="file-remove"><i class="fas fa-times"></i></span>
        `;

        fileElement.querySelector('.file-remove').addEventListener('click', function () {
            fileElement.remove();
            // Note: This doesn't actually remove the file from the input
            // In a real implementation, you would need to create a new FileList object
        });

        uploadedFiles.appendChild(fileElement);
    });
});



// function loadLocalLaws() {
//     const LAWS_STORAGE_KEY = 'legal_ai_laws';
//     const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
//     return storedLaws ? JSON.parse(storedLaws) : [];
// }



// Add this right after the loadLaws() function
async function initializeTestData() {
    const laws = await loadLaws();

    if (!laws || laws.length === 0) {
        // Create sample law data
        const sampleLaws = [
            {
                id: "L001",
                title: "Sample Law Title",
                category: "criminal",
                description: "This is a sample law description.",
                datePublished: new Date().toISOString().split('T')[0],
                views: 0,
                tags: ["tag1", "tag2"],
                status: "active",
                content: "Section 1: Sample content\nSection 2: More sample content"
            }
        ];
        saveLaws(sampleLaws);
    }
}

// async function saveLaws(laws) {
//     const LAWS_STORAGE_KEY = 'legal_ai_laws';
//     // First try to save to Firebase
//     try {
//         const lawsCollection = db.collection("laws");
        
//         for (const law of laws) {
//             // Create a valid date object inside the loop for each law
//             let dateObj;
//             try {
//                 // Try to parse the date string
//                 dateObj = new Date(law.datePublished);
//                 // Check if the date is valid
//                 if (isNaN(dateObj.getTime())) {
//                     // If not valid, use current date
//                     dateObj = new Date();
//                 }
//             } catch (e) {
//                 // If any error in date parsing, use current date
//                 dateObj = new Date();
//             }
            
//             await lawsCollection.add({
//                 id: law.id,
//                 title: law.title,
//                 category: law.category,
//                 description: law.description,
//                 content: law.content,
//                 datePublished: firebase.firestore.Timestamp.fromDate(dateObj), // Use the valid dateObj
//                 status: law.status,
//                 tags: law.tags || [],
//                 documents: law.documents || [],
//                 views: law.views || 0
//             });
//         }
        
//         console.log("Laws added successfully!"); 
//         // But also save to localStorage as backup
//         localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
//     } catch (error) {
//         console.error("Error adding laws to Firebase:", error);
//         // At least save to localStorage
//         localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
//     }
// }
async function saveLaws(laws) {
    const LAWS_STORAGE_KEY = 'legal_ai_laws';
    try {
        // First update localStorage to ensure we have a backup
        localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
        
        // Get all existing laws from Firestore
        const snapshot = await db.collection("laws").get();
        const existingLawDocs = {};
        
        // Create a map of existing law IDs to document references
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.id) {
                existingLawDocs[data.id] = doc.ref;
            }
        });
        
        // Batch write to prevent partial updates
        const batch = db.batch();
        const lawsToAdd = [];
        
        for (const law of laws) {
            // Process date
            let dateObj;
            try {
                dateObj = new Date(law.datePublished);
                if (isNaN(dateObj.getTime())) {
                    dateObj = new Date();
                }
            } catch (e) {
                dateObj = new Date();
            }
            
            const lawData = {
                id: law.id,
                title: law.title,
                category: law.category,
                description: law.description,
                content: law.content,
                datePublished: firebase.firestore.Timestamp.fromDate(dateObj),
                status: law.status,
                tags: law.tags || [],
                documents: law.documents || [],
                views: law.views || 0
            };
            
            if (existingLawDocs[law.id]) {
                // Update existing document
                batch.update(existingLawDocs[law.id], lawData);
            } else {
                // Mark for addition (can't add in batch yet as we don't have document references)
                lawsToAdd.push(lawData);
            }
        }
        
        // Execute the batch update
        await batch.commit();
        
        // Add new laws
        for (const lawData of lawsToAdd) {
            await db.collection("laws").add(lawData);
        }
        await displayLaws();

        console.log("Laws saved successfully!");
    } catch (error) {
        console.error("Error saving laws to Firebase:", error);
    }
}
async function loadLaws() {
    try {
        const querySnapshot = await db.collection("laws").get();
        let laws = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            
            // Convert Firestore timestamp to JavaScript Date
            if (data.datePublished && data.datePublished instanceof firebase.firestore.Timestamp) {
                data.datePublished = data.datePublished.toDate();
            }
            
            laws.push({ id: doc.id, ...data });
        });
        
        return laws;
    } catch (error) {
        console.error("Error fetching laws:", error);
        return loadLocalLaws();
    }
}
// Function to generate a unique ID for new laws
async function generateLawId() {
    const laws = await loadLaws();
    let maxId = 0;

    laws.forEach(law => {
        // Handle both formats - with or without the #LW prefix
        const idMatch = law.id.match(/(?:#LW-)?(\d+)/);
        if (idMatch && idMatch[1]) {
            const idNum = parseInt(idMatch[1]);
            if (idNum > maxId) maxId = idNum;
        }
    });

    const newId = maxId + 1;
    return `#LW-${String(newId).padStart(3, '0')}`;
}

// Function to add a new law
async function addNewLaw(lawData) {
    const laws = await loadLaws();
     // Create a proper date string in ISO format
    const today = new Date();
    const dateString = today.toISOString();
    const newLaw = {
        id: await generateLawId(),
        title: lawData.title,
        category: lawData.category,
        status: lawData.status,
        description: lawData.description,
        content: lawData.content,
        datePublished: dateString,
        views: 0,
        tags: lawData.tags || [],
        documents: lawData.documents || []
    };

    laws.push(newLaw);
    saveLaws(laws);
    return newLaw;
}

// Function to display laws in the table
// async function displayLaws() {
//     const laws = await loadLaws();
//     const tableBody = document.querySelector('.laws-table tbody');

//     // Clear the current table
//     tableBody.innerHTML = '';

//     // If no laws are available, display a message
//     if (!laws || laws.length === 0) {
//         const row = document.createElement('tr');
//         row.innerHTML = `<td colspan="8" class="text-center">No laws available. Add a new law to get started.</td>`;
//         tableBody.appendChild(row);
//         return;
//     }

//     // Add each law to the table
//     laws.forEach(law => {
//         const row = document.createElement('tr');

//         row.innerHTML = `
//             <td><input type="checkbox" class="law-checkbox"></td>
//             <td>${law.id}</td>
//             <td>${law.title}</td>
//             <td><span class="category-badge ${law.category}">${capitalizeFirstLetter(law.category)}</span></td>
//             <td>${formatDate(law.datePublished)}</td>
//             <td><span class="status-badge ${law.status}">${capitalizeFirstLetter(law.status)}</span></td>
//             <td>${(law.views || 0).toLocaleString()}</td>
//             <td class="action-buttons">
//                 <button class="btn-icon view-law" data-id="${law.id}"><i class="fas fa-eye"></i></button>
//                 <button class="btn-icon edit-law" data-id="${law.id}"><i class="fas fa-edit"></i></button>
//                 <button class="btn-icon delete-law" data-id="${law.id}"><i class="fas fa-trash"></i></button>
//             </td>
//         `;

//         tableBody.appendChild(row);
//     });

//     // Re-attach event listeners for the new buttons
//     attachActionListeners();

//     // Update pagination info
//     updatePaginationInfo();
// }
// async function displayLaws() {
//     try {
//         const querySnapshot = await db.collection("laws").get();
//         const tableBody = document.querySelector('.laws-table tbody');
        
//         // Clear the current table
//         tableBody.innerHTML = '';
        
//         // If no laws are available, display a message
//         if (querySnapshot.empty) {
//             const row = document.createElement('tr');
//             row.innerHTML = `<td colspan="8" class="text-center">No laws available. Add a new law to get started.</td>`;
//             tableBody.appendChild(row);
//             return;
//         }
        
//         // Add each law to the table
//         querySnapshot.forEach(doc => {
//             const law = doc.data();
//             const row = document.createElement('tr');
            
//             row.innerHTML = `
//                 <td><input type="checkbox" class="law-checkbox"></td>
//                 <td>${law.id || ''}</td>
//                 <td>${law.title || ''}</td>
//                 <td><span class="category-badge ${law.category || ''}">${capitalizeFirstLetter(law.category || '')}</span></td>
//                 <td>${formatDate(law.datePublished ? law.datePublished.toDate() : new Date())}</td>
//                 <td><span class="status-badge ${law.status || ''}">${capitalizeFirstLetter(law.status || '')}</span></td>
//                 <td>${(law.views || 0).toLocaleString()}</td>
//                 <td class="action-buttons">
//                     <button class="btn-icon view-law" data-id="${law.id}"><i class="fas fa-eye"></i></button>
//                     <button class="btn-icon edit-law" data-id="${law.id}"><i class="fas fa-edit"></i></button>
//                     <button class="btn-icon delete-law" data-id="${law.id}"><i class="fas fa-trash"></i></button>
//                 </td>
//             `;
            
//             tableBody.appendChild(row);
//         });
        
//         // Re-attach event listeners for the new buttons
//         attachActionListeners();
        
//         // Update pagination info
//         updatePaginationInfo();
//     } catch (error) {
//         console.error("Error displaying laws:", error);
        
//         // Fallback to localStorage if Firestore fails
//         // laws = loadLocalLaws();
//         // tableBody = document.querySelector('.laws-table tbody');
//         // tableBody.innerHTML = '';
//         // row = document.createElement('tr');
//         // row.innerHTML = `<td colspan="8" class="text-center">No laws available. Add a new law to get started.</td>`;
//         // tableBody.appendChild(row);
//         // law = doc.data();
//         // row = document.createElement('tr');
            
//         //     row.innerHTML = `
//         //         <td><input type="checkbox" class="law-checkbox"></td>
//         //         <td>${law.id || ''}</td>
//         //         <td>${law.title || ''}</td>
//         //         <td><span class="category-badge ${law.category || ''}">${capitalizeFirstLetter(law.category || '')}</span></td>
//         //         <td>${formatDate(law.datePublished ? law.datePublished.toDate() : new Date())}</td>
//         //         <td><span class="status-badge ${law.status || ''}">${capitalizeFirstLetter(law.status || '')}</span></td>
//         //         <td>${(law.views || 0).toLocaleString()}</td>
//         //         <td class="action-buttons">
//         //             <button class="btn-icon view-law" data-id="${law.id}"><i class="fas fa-eye"></i></button>
//         //             <button class="btn-icon edit-law" data-id="${law.id}"><i class="fas fa-edit"></i></button>
//         //             <button class="btn-icon delete-law" data-id="${law.id}"><i class="fas fa-trash"></i></button>
//         //         </td>
//         //     `;
            
//         //     tableBody.appendChild(row);
//         //  return;
//         // Same display logic as above...
//         // (Abbreviated for clarity - implement similar to above)
//     }
// }
async function displayLaws() {
    try {
        // Get laws from Firestore
        const querySnapshot = await db.collection("laws").get();
        const tableBody = document.querySelector('.laws-table tbody');
        
        // Clear the current table
        tableBody.innerHTML = '';
        
        // Track if we have any laws
        let lawsCount = 0;
        
        // Add each law to the table
        querySnapshot.forEach(doc => {
            lawsCount++;
            const law = doc.data();
            addLawToTable(law, tableBody);
        });
        
        // If no laws are available, display a message
        if (lawsCount === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="8" class="text-center">No laws available. Add a new law to get started.</td>`;
            tableBody.appendChild(row);
        }
        
        // Re-attach event listeners for the new buttons
        attachActionListeners();
        
        // Update pagination info
        updatePaginationInfo();
        
        // Re-setup bulk operations
        setupBulkOperations();
        
    } catch (error) {
        console.error("Error displaying laws from Firestore:", error);
        
        // Fallback to localStorage if Firestore fails
        fallbackToLocalStorage();
    }
}

// Function to add a single law to the table
function addLawToTable(law, tableBody) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', law.id); // Add data-id attribute to the row
    
    row.innerHTML = `
        <td><input type="checkbox" class="law-checkbox" data-law-id="${law.id}"></td>
        <td>${law.id || ''}</td>
        <td>${law.title || ''}</td>
        <td><span class="category-badge ${law.category || ''}">${capitalizeFirstLetter(law.category || '')}</span></td>
        <td>${formatDate(law.datePublished ? law.datePublished.toDate() : new Date())}</td>
        <td><span class="status-badge ${law.status || ''}">${capitalizeFirstLetter(law.status || '')}</span></td>
        <td>${(law.views || 0).toLocaleString()}</td>
        <td class="action-buttons">
            <button class="btn-icon view-law" data-id="${law.id}"><i class="fas fa-eye"></i></button>
            <button class="btn-icon edit-law" data-id="${law.id}"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete-law" data-id="${law.id}"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    tableBody.appendChild(row);
}

// Fallback to localStorage if Firestore fails
function fallbackToLocalStorage() {
    const laws = loadLocalLaws();
    const tableBody = document.querySelector('.laws-table tbody');
    
    // Clear the current table
    tableBody.innerHTML = '';
    
    if (laws.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="8" class="text-center">No laws available. Add a new law to get started.</td>`;
        tableBody.appendChild(row);
        return;
    }
    
    // Add each law to the table
    laws.forEach(law => {
        addLawToTable(law, tableBody);
    });
    
    // Re-attach event listeners for the new buttons
    attachActionListeners();
    
    // Update pagination info
    updatePaginationInfo();
    
    // Re-setup bulk operations
    setupBulkOperations();
}

// Load laws from localStorage
function loadLocalLaws() {
    const LAWS_STORAGE_KEY = 'legal_ai_laws';
    const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
    return storedLaws ? JSON.parse(storedLaws) : [];
}

// Function to save laws to localStorage
function saveLocalLaws(laws) {
    const LAWS_STORAGE_KEY = 'legal_ai_laws';
    localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));
}
// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format date
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
//update paging info
function updatePaginationInfo() {
    const visibleRows = document.querySelectorAll('.laws-table tbody tr:not([style*="display: none"])');
    const paginationInfo = document.querySelector('.pagination-info');

    if (paginationInfo) {
        const totalLaws = document.querySelectorAll('.laws-table tbody tr').length;
        const visibleCount = visibleRows.length;

        if (visibleCount < totalLaws) {
            paginationInfo.innerHTML = `Showing <span>${visibleCount}</span> of <span>${totalLaws}</span> laws (filtered)`;
        } else {
            paginationInfo.innerHTML = `Showing <span>1-${visibleCount}</span> of <span>${totalLaws}</span> laws`;
        }
    }
}

// Function to attach event listeners to action buttons
// function attachActionListeners() {
//     // View law
//     document.querySelectorAll('.view-law').forEach(button => {
//         button.addEventListener('click', function () {
//             const lawId = this.getAttribute('data-id');
//             viewLaw(lawId);
//         });
//     });

//     // Edit law
//     document.querySelectorAll('.edit-law').forEach(button => {
//         button.addEventListener('click', function () {
//             const lawId = this.getAttribute('data-id');
//             editLaw(lawId);
//         });
//     });

//     // Delete law
//     document.querySelectorAll('.delete-law').forEach(button => {
//         button.addEventListener('click', function () {
//             const lawId = this.getAttribute('data-id');
//             deleteLaw(lawId);
//         });
//     });
// }
// function attachActionListeners() {
//     // View law
//     document.querySelectorAll('.view-law').forEach(button => {
//         button.addEventListener('click', function () {
//             const lawId = this.getAttribute('data-id');
//             viewLaw(lawId).catch(error => console.error('Error viewing law:', error));
//         });
//     });

//     // Edit law
//     document.querySelectorAll('.edit-law').forEach(button => {
//         button.addEventListener('click', function () {
//             const lawId = this.getAttribute('data-id');
//             editLaw(lawId).catch(error => console.error('Error editing law:', error));
//         });
//     });

//     // Delete law
//     document.querySelectorAll('.delete-law').forEach(button => {
//         button.addEventListener('click', function () {
//             const lawId = this.getAttribute('data-id');
//             deleteLaw(lawId).catch(error => console.error('Error deleting law:', error));
//         });
//     });
// }
function attachActionListeners() {
    // Remove all existing event listeners by cloning and replacing elements
    document.querySelectorAll('.view-law, .edit-law, .delete-law').forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // View law
    document.querySelectorAll('.view-law').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent multiple triggers
            const lawId = this.getAttribute('data-id');
            viewLaw(lawId).catch(error => console.error('Error viewing law:', error));
        });
    });

    // Edit law
    document.querySelectorAll('.edit-law').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent multiple triggers
            const lawId = this.getAttribute('data-id');
            editLaw(lawId).catch(error => console.error('Error editing law:', error));
        });
    });

    // Delete law
    document.querySelectorAll('.delete-law').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent multiple triggers
            const lawId = this.getAttribute('data-id');
            deleteLaw(lawId).catch(error => console.error('Error deleting law:', error));
        });
    });
}
// // Function to view a law
// function viewLaw(lawId) {
//     const laws = loadLaws();
//     const law = laws.find(law => law.id === lawId);

//     if (law) {
//         // Increment the view count
//         law.views += 1;
//         saveLaws(laws);

//         // In a real app, you'd open a detailed view
//         alert(`Viewing law: ${law.title}`);

//         // After viewing, refresh the display to update view count
//         displayLaws();
//     }
// }

// // Function to edit a law
// function editLaw(lawId) {
//     const laws = loadLaws();
//     const law = laws.find(law => law.id === lawId);

//     if (law) {
//         // Populate the modal with the law data
//         document.getElementById('law-title').value = law.title;
//         document.getElementById('law-category').value = law.category;
//         document.getElementById('law-status').value = law.status;
//         document.getElementById('law-description').value = law.description;
//         document.getElementById('law-content').value = law.content;

//         // Populate tags
//         const tagsContainer = document.querySelector('.tags-container');
//         tagsContainer.innerHTML = '';

//         law.tags.forEach(tagText => {
//             const tag = document.createElement('div');
//             tag.className = 'tag';
//             tag.innerHTML = `
//                 ${tagText}
//                 <span class="tag-close"><i class="fas fa-times"></i></span>
//             `;

//             tag.querySelector('.tag-close').addEventListener('click', function () {
//                 tag.remove();
//             });

//             tagsContainer.appendChild(tag);
//         });

//         // Store the law ID for the save function
//         saveNewLawButton.setAttribute('data-editing', lawId);

//         // Open the modal
//         openAddLawModal();
//     }
// }

// // Function to delete a law
// function deleteLaw(lawId) {
//     if (confirm('Are you sure you want to delete this law?')) {
//         const laws = loadLaws();
//         const updatedLaws = laws.filter(law => law.id !== lawId);

//         saveLaws(updatedLaws);
//         displayLaws();
//     }
// }
// Function to view a law
// async function viewLaw(lawId) {
//     const laws = await loadLaws();
//     const law = laws.find(law => law.id === lawId);

//     if (law) {
//         // Increment the view count
//         law.views += 1;
//         await saveLaws(laws);

//         // In a real app, you'd open a detailed view
//         alert(`Viewing law: ${law.title}`);

//         // After viewing, refresh the display to update view count
//         await displayLaws();
//     }
// }
// Function to view a law
async function viewLaw(lawId) {
    try {
        // Get the specific law document
        const querySnapshot = await db.collection("laws").where("id", "==", lawId).get();
        
        if (querySnapshot.empty) {
            console.error("Law not found:", lawId);
            return;
        }
        
        const docRef = querySnapshot.docs[0].ref;
        const law = querySnapshot.docs[0].data();
        
        // Increment view count directly on the document
        await docRef.update({
            views: firebase.firestore.FieldValue.increment(1)
        });
        
        // In a real app, you'd open a detailed view
        alert(`Viewing law: ${law.title}`);
        
        // After viewing, refresh the display to update view count
        await displayLaws();
    } catch (error) {
        console.error("Error viewing law:", error);
    }
}

// Function to edit a law
async function editLaw(lawId) {
    try {
        const querySnapshot = await db.collection("laws").where("id", "==", lawId).get();
        
        if (querySnapshot.empty) {
            console.error("Law not found:", lawId);
            return;
        }
        
        const law = querySnapshot.docs[0].data();
        
        // Populate the modal with the law data
        document.getElementById('law-title').value = law.title || '';
        document.getElementById('law-category').value = law.category || '';
        document.getElementById('law-status').value = law.status || '';
        document.getElementById('law-description').value = law.description || '';
        document.getElementById('law-content').value = law.content || '';
        
        // Populate tags
        const tagsContainer = document.querySelector('.tags-container');
        tagsContainer.innerHTML = '';
        
        if (law.tags && Array.isArray(law.tags)) {
            law.tags.forEach(tagText => {
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.innerHTML = `
                    ${tagText}
                    <span class="tag-close"><i class="fas fa-times"></i></span>
                `;
                
                tag.querySelector('.tag-close').addEventListener('click', function() {
                    tag.remove();
                });
                
                tagsContainer.appendChild(tag);
            });
        }
        
        // Store the law ID for the save function
        saveNewLawButton.setAttribute('data-editing', lawId);
        
        // Open the modal
        openAddLawModal();
    } catch (error) {
        console.error("Error editing law:", error);
    }
}

// Function to delete a law
async function deleteLaw(lawId) {
    try {
        if (!confirm('Are you sure you want to delete this law?')) {
            return;
        }
        
        const querySnapshot = await db.collection("laws").where("id", "==", lawId).get();
        
        if (querySnapshot.empty) {
            console.error("Law not found:", lawId);
            return;
        }
        
        // Delete the document directly
        await querySnapshot.docs[0].ref.delete();
        
        alert('Law deleted successfully');
        await displayLaws();
    } catch (error) {
        console.error("Error deleting law:", error);
    }
}

// Function to edit a law
// async function editLaw(lawId) {
//     const laws = await loadLaws();
//     const law = laws.find(law => law.id === lawId);

//     if (law) {
//         // Populate the modal with the law data
//         document.getElementById('law-title').value = law.title;
//         document.getElementById('law-category').value = law.category;
//         document.getElementById('law-status').value = law.status;
//         document.getElementById('law-description').value = law.description;
//         document.getElementById('law-content').value = law.content;

//         // Populate tags
//         const tagsContainer = document.querySelector('.tags-container');
//         tagsContainer.innerHTML = '';

//         law.tags.forEach(tagText => {
//             const tag = document.createElement('div');
//             tag.className = 'tag';
//             tag.innerHTML = `
//                 ${tagText}
//                 <span class="tag-close"><i class="fas fa-times"></i></span>
//             `;

//             tag.querySelector('.tag-close').addEventListener('click', function () {
//                 tag.remove();
//             });

//             tagsContainer.appendChild(tag);
//         });

//         // Store the law ID for the save function
//         saveNewLawButton.setAttribute('data-editing', lawId);

//         // Open the modal
//         openAddLawModal();
//     }
// }

// // Function to delete a law
// async function deleteLaw(lawId) {
//     if (confirm('Are you sure you want to delete this law?')) {
//         const laws = await loadLaws();
//         const updatedLaws = laws.filter(law => law.id !== lawId);

//         await saveLaws(updatedLaws);
//         await displayLaws();
//     }
// }
// Update the save law functionality
// saveNewLawButton.addEventListener('click', function () {
//     const form = document.getElementById('add-law-form');

//     if (form.checkValidity()) {
//         // Collect form data
//         const lawData = {
//             title: document.getElementById('law-title').value,
//             category: document.getElementById('law-category').value,
//             status: document.getElementById('law-status').value,
//             description: document.getElementById('law-description').value,
//             content: document.getElementById('law-content').value,
//             tags: Array.from(document.querySelectorAll('.tags-container .tag')).map(tag => tag.textContent.trim())
//         };

//         // Check if we're editing or adding
//         const editingId = saveNewLawButton.getAttribute('data-editing');

//         if (editingId) {
//             // Editing existing law
//             const laws = loadLaws();
//             const lawIndex = laws.findIndex(law => law.id === editingId);

//             if (lawIndex !== -1) {
//                 // Preserve the original id, date, and views
//                 const originalData = laws[lawIndex];
//                 laws[lawIndex] = {
//                     ...originalData,
//                     title: lawData.title,
//                     category: lawData.category,
//                     status: lawData.status,
//                     description: lawData.description,
//                     content: lawData.content,
//                     tags: lawData.tags
//                 };

//                 saveLaws(laws);
//                 saveNewLawButton.removeAttribute('data-editing');
//             }
//         } else {
//             // Adding new law
//             addNewLaw(lawData);
//         }

//         // Display success message
//         alert('Law saved successfully!');

//         // Refresh the display
//         displayLaws();

//         // Close the modal
//         closeAddLawModal();
//     } else {
//         // Trigger browser's built-in validation UI
//         form.reportValidity();
//     }
// });

// Initialize the page
document.addEventListener('DOMContentLoaded', async function () {
    // Make the section visible when JS is loaded
    document.getElementById('laws-management').style.display = 'block';

    // // Create the setupNavigation function if it doesn't exist
    // if (typeof setupNavigation !== 'function') {
    //     window.setupNavigation = function() {
    //         console.log("Navigation setup complete");
    //         // Your navigation setup code here
    //     }
    // }

    // Initialize Chart if it's being used
    if (typeof Chart === 'undefined' && document.getElementById('analytics-chart')) {
        console.warn("Chart.js is not loaded. Analytics charts will not be displayed.");
        // You might want to add a placeholder or error message in the chart container
    }

    // Load and display laws
    await displayLaws();

    // Set up pagination if the function exists
    if (typeof setupPagination === 'function') {
        setupPagination();
    }

    // Set up filters if the elements exist
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const searchInput = document.getElementById('searchInput');

    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    
    // Initialize test data if needed
    initializeTestData();
    
    console.log("Dashboard initialization complete");
});




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add explanation modal
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

// Add this before the openLawModal function
// function getRelatedExplanations(lawId) {
//     const storedExplanations = localStorage.getItem('legal_system_explanations');
//     const explanations = storedExplanations ? JSON.parse(storedExplanations) : [];
//     return explanations.filter(exp => exp.relatedLawId === lawId);
// }
// function openAddExplanationModal() {
//     addExplanationModal.classList.add('active');
//     document.body.style.overflow = 'hidden';
//     populateRelatedLawsDropdown();
// }
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

// function closeAddExplanationModal() {
//     addExplanationModal.classList.remove('active');
//     document.body.style.overflow = '';
//     document.getElementById('add-explanation-form').reset();
//     document.querySelector('.explanation-tags-container').innerHTML = '';
//     document.querySelector('.explanation-uploaded-files').innerHTML = '';
//     saveNewExplanationButton.removeAttribute('data-editing');
// }
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
// async function populateRelatedLawsDropdown() {
//     const relatedLawSelect = document.getElementById('related-law');
    
//     // Clear existing options except the first one (which is likely "Select a law" or similar)
//     while (relatedLawSelect.options.length > 1) {
//         relatedLawSelect.remove(1);
//     }
    
//     try {
//         // Load laws from Firebase
//         const laws = await loadLaws();
        
//         if (!laws || laws.length === 0) {
//             // Add a placeholder option if no laws are found
//             const option = document.createElement('option');
//             option.value = "";
//             option.textContent = "No laws available";
//             option.disabled = true;
//             relatedLawSelect.appendChild(option);
//             return;
//         }
        
//         // Add laws to dropdown
//         laws.forEach(law => {
//             const option = document.createElement('option');
//             option.value = law.id;
//             option.textContent = `${law.id} - ${law.title}`;
//             relatedLawSelect.appendChild(option);
//         });
        
//         console.log(`Populated dropdown with ${laws.length} laws`);
//     } catch (error) {
//         console.error("Error populating related laws dropdown:", error);
        
//         // Add an error option
//         const option = document.createElement('option');
//         option.value = "";
//         option.textContent = "Error loading laws";
//         option.disabled = true;
//         relatedLawSelect.appendChild(option);
//     }
// }
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
    
    const formData = {
        title: document.getElementById('explanation-title').value,
        relatedLaw: document.getElementById('related-law').value,
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
    if (editId) {
        formData.id = editId;
    }
    
    // Save the explanation
    const savedExplanation = await saveExplanation(formData);
    
    if (savedExplanation) {
        // Close modal and refresh display
        closeAddExplanationModal();
        displayExplanations();
        
        // Show success notification
        showNotification('Explanation saved successfully!', 'success');
    } else {
        // Show error notification
        showNotification('Error saving explanation. Please try again.', 'error');
    }
}
// // Handle tags input for explanations
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

explanationFileInput.addEventListener('change', function () {
    explanationUploadedFiles.innerHTML = '';

    Array.from(explanationFileInput.files).forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.innerHTML = `
            <span class="file-icon"><i class="fas fa-file"></i></span>
            ${file.name}
            <span class="file-remove"><i class="fas fa-times"></i></span>
        `;

        fileElement.querySelector('.file-remove').addEventListener('click', function () {
            fileElement.remove();
            // Note: This doesn't actually remove the file from the input
            // In a real implementation, you would need to create a new FileList object
        });

        explanationUploadedFiles.appendChild(fileElement);
    });
});
const EXPLANATIONS_STORAGE_KEY = 'legal_ai_explanations';

// Function to save law explanations
// async function saveLawExplanations(explanations) {
//     // First try to save to Firebase
//     try {
//         const explanationsCollection = db.collection("lawExplanations");
        
//         for (const explanation of explanations) {
//             // Create a valid date object for each explanation
//             let dateObj;
//             try {
//                 // Try to parse the date string
//                 dateObj = new Date(explanation.datePublished);
//                 // Check if the date is valid
//                 if (isNaN(dateObj.getTime())) {
//                     // If not valid, use current date
//                     dateObj = new Date();
//                 }
//             } catch (e) {
//                 // If any error in date parsing, use current date
//                 dateObj = new Date();
//             }
            
//             await explanationsCollection.add({
//                 id: explanation.id,
//                 title: explanation.title,
//                 relatedLawId: explanation.relatedLawId,
//                 category: explanation.category,
//                 status: explanation.status,
//                 summary: explanation.summary,
//                 content: explanation.content,
//                 datePublished: firebase.firestore.Timestamp.fromDate(dateObj),
//                 lastUpdated: firebase.firestore.Timestamp.fromDate(new Date()),
//                 views: explanation.views || 0,
//                 tags: explanation.tags || [],
//                 documents: explanation.documents || []
//             });
//         }
        
//         console.log("Law explanations added successfully!"); 
//         // But also save to localStorage as backup
//         localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
//     } catch (error) {
//         console.error("Error adding explanations to Firebase:", error);
//         // At least save to localStorage
//         localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanations));
//     }
// }
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

// Function to update an existing explanation
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
        
        // Update the document
        await docRef.update({
            title: updatedData.title,
            relatedLawId: updatedData.relatedLawId,
            category: updatedData.category,
            status: updatedData.status,
            summary: updatedData.summary,
            content: updatedData.content,
            lastUpdated: firebase.firestore.Timestamp.fromDate(new Date()),
            tags: updatedData.tags || []
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
// async function deleteExplanation(explanationId) {
//     try {
//         // Delete from Firebase
//         const querySnapshot = await db.collection("lawExplanations")
//             .where("id", "==", explanationId)
//             .get();
            
//         querySnapshot.forEach((doc) => {
//             doc.ref.delete();
//         });
        
//         // Update localStorage as well
//         const explanations = await loadExplanations();
//         const updatedExplanations = explanations.filter(exp => exp.id !== explanationId);
//         localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(updatedExplanations));
        
//         console.log("Explanation deleted successfully");
//         return true;
//     } catch (error) {
//         console.error("Error deleting explanation:", error);
//         return false;
//     }
// }
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
// function addPaginationNumber(number, container) {
//     const button = document.createElement('button');
//     button.className = `pagination-btn${number === currentExplanationsPage ? ' active' : ''}`;
//     button.textContent = number;
//     button.addEventListener('click', () => {
//         currentExplanationsPage = number;
//         displayExplanations();
//     });
//     container.appendChild(button);
// }

// function updateExplanationsPagination() {
//     const totalPages = Math.ceil(explanations.length / explanationsPerPage);
//     document.getElementById('explanations-showing').textContent = 
//         explanations.length > 0 ? 
//         `${(currentExplanationsPage - 1) * explanationsPerPage + 1}-${Math.min(currentExplanationsPage * explanationsPerPage, explanations.length)}` : 
//         '0-0';
//     document.getElementById('explanations-total').textContent = explanations.length;
    
//     // Generate pagination numbers
//     const paginationNumbers = document.getElementById('explanations-pagination-numbers');
//     paginationNumbers.innerHTML = '';
    
//     if (totalPages <= 7) {
//         // Show all pages if 7 or fewer
//         for (let i = 1; i <= totalPages; i++) {
//             addPaginationNumber(i, paginationNumbers);
//         }
//     } else {
//         // Complex pagination with ellipses
//         if (currentExplanationsPage <= 4) {
//             // Near start
//             for (let i = 1; i <= 5; i++) {
//                 addPaginationNumber(i, paginationNumbers);
//             }
//             addEllipsis(paginationNumbers);
//             addPaginationNumber(totalPages, paginationNumbers);
//         } else if (currentExplanationsPage >= totalPages - 3) {
//             // Near end
//             addPaginationNumber(1, paginationNumbers);
//             addEllipsis(paginationNumbers);
//             for (let i = totalPages - 4; i <= totalPages; i++) {
//                 addPaginationNumber(i, paginationNumbers);
//             }
//         } else {
//             // Middle
//             addPaginationNumber(1, paginationNumbers);
//             addEllipsis(paginationNumbers);
//             for (let i = currentExplanationsPage - 1; i <= currentExplanationsPage + 1; i++) {
//                 addPaginationNumber(i, paginationNumbers);
//             }
//             addEllipsis(paginationNumbers);
//             addPaginationNumber(totalPages, paginationNumbers);
//         }
//     }
    
//     // Enable/disable prev/next buttons
//     document.getElementById('explanations-prev-page').disabled = currentExplanationsPage === 1;
//     document.getElementById('explanations-next-page').disabled = currentExplanationsPage === totalPages || totalPages === 0;
// }
// function attachExplanationEventListeners() {
//     // View explanation buttons
//     document.querySelectorAll('.view-explanation').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const id = e.currentTarget.getAttribute('data-id');
//             viewExplanation(id);
//         });
//     });
    
//     // Edit explanation buttons
//     document.querySelectorAll('.edit-explanation').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const id = e.currentTarget.getAttribute('data-id');
//             editExplanation(id);
//         });
//     });
    
//     // Delete explanation buttons
//     document.querySelectorAll('.delete-explanation').forEach(btn => {
//         btn.addEventListener('click', (e) => {
//             const id = e.currentTarget.getAttribute('data-id');
//             deleteExplanation(id);
//         });
//     });
    
//     // Select all checkbox
//     document.getElementById('select-all-explanations')?.addEventListener('change', (e) => {
//         const isChecked = e.target.checked;
//         document.querySelectorAll('.explanation-checkbox').forEach(checkbox => {
//             checkbox.checked = isChecked;
//         });
//     });
// }
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
// async function viewExplanation(explanationId) {
//     const explanations = await loadExplanations();
//     const explanation = explanations.find(exp => exp.id === explanationId);

//     if (explanation) {
//         // Increment the view count
//         await incrementExplanationViews(explanationId);

//         // In a real app, you'd open a detailed view
//         alert(`Viewing explanation: ${explanation.title}`);

//         // After viewing, refresh the display to update view count
//         displayExplanations();
//     }
// }
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
// Function to edit an explanation
// async function editExplanation(explanationId) {
//     const explanations = await loadExplanations();
//     const explanation = explanations.find(exp => exp.id === explanationId);

//     if (explanation) {
//         // Populate the modal with the explanation data
//         document.getElementById('explanation-title').value = explanation.title;
//         document.getElementById('related-law').value = explanation.relatedLawId;
//         document.getElementById('explanation-category').value = explanation.category;
//         document.getElementById('explanation-status').value = explanation.status;
//         document.getElementById('explanation-summary').value = explanation.summary;
//         document.getElementById('explanation-content').value = explanation.content;

//         // Populate tags
//         const tagsContainer = document.querySelector('.explanation-tags-container');
//         tagsContainer.innerHTML = '';

//         explanation.tags.forEach(tagText => {
//             const tag = document.createElement('div');
//             tag.className = 'tag';
//             tag.innerHTML = `
//                 ${tagText}
//                 <span class="tag-close"><i class="fas fa-times"></i></span>
//             `;

//             tag.querySelector('.tag-close').addEventListener('click', function () {
//                 tag.remove();
//             });

//             tagsContainer.appendChild(tag);
//         });

//         // Store the explanation ID for the save function
//         saveNewExplanationButton.setAttribute('data-editing', explanationId);

//         // Open the modal
//         openAddExplanationModal();
//     }
// }
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
        document.getElementById('related-law').value = explanation.relatedLaw || '';
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


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// User Management JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Handle filters for user management
    const roleFilter = document.getElementById('role-filter');
    const userStatusFilter = document.getElementById('status-filter');
    const userSearchInput = document.getElementById('user-search');

    function applyUserFilters() {
        const roleValue = roleFilter ? roleFilter.value.toLowerCase() : '';
        const statusValue = userStatusFilter ? userStatusFilter.value.toLowerCase() : '';
        const searchValue = userSearchInput ? userSearchInput.value.toLowerCase() : '';
        const rows = document.querySelectorAll('.users-table tbody tr');

        rows.forEach(row => {
            const roleText = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            const statusText = row.querySelector('td:nth-child(7)').textContent.toLowerCase();
            const userName = row.querySelector('.user-name').textContent.toLowerCase();
            const userEmail = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const userId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

            const matchesRole = !roleValue || roleText.includes(roleValue);
            const matchesStatus = !statusValue || statusText.includes(statusValue);
            const matchesSearch = !searchValue ||
                userName.includes(searchValue) ||
                userEmail.includes(searchValue) ||
                userId.includes(searchValue);

            if (matchesRole && matchesStatus && matchesSearch) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });

        updateUserPaginationInfo();
    }

    function updateUserPaginationInfo() {
        const visibleRows = document.querySelectorAll('.users-table tbody tr:not([style*="display: none"])');
        const paginationInfo = document.querySelector('#user-management .pagination-info');

        if (paginationInfo) {
            const totalUsers = document.querySelectorAll('.users-table tbody tr').length;
            const visibleCount = visibleRows.length;

            if (visibleCount < totalUsers) {
                paginationInfo.innerHTML = `Showing <span>${visibleCount}</span> of <span>${totalUsers}</span> users (filtered)`;
            } else {
                paginationInfo.innerHTML = `Showing <span>1-${visibleCount}</span> of <span>${totalUsers}</span> users`;
            }
        }
    }

    // Add event listeners for filters if they exist
    if (roleFilter) roleFilter.addEventListener('change', applyUserFilters);
    if (userStatusFilter) userStatusFilter.addEventListener('change', applyUserFilters);
    if (userSearchInput) userSearchInput.addEventListener('input', applyUserFilters);

    // Select all checkbox functionality
    const selectAllUsersCheckbox = document.getElementById('select-all-users');
    const userCheckboxes = document.querySelectorAll('.user-checkbox');

    if (selectAllUsersCheckbox) {
        selectAllUsersCheckbox.addEventListener('change', function () {
            userCheckboxes.forEach(checkbox => {
                const row = checkbox.closest('tr');
                if (row.style.display !== 'none') {
                    checkbox.checked = selectAllUsersCheckbox.checked;
                }
            });
        });
    }

    // Modal functionality
    const addUserButton = document.querySelector('#user-management .section-header .btn-primary');
    const addUserModal = document.getElementById('add-user-modal');
    const closeModalButton = document.querySelector('#add-user-modal .close-modal');
    const cancelAddUserButton = document.getElementById('cancel-add-user');
    const saveNewUserButton = document.getElementById('save-new-user');

    function openAddUserModal() {
        if (addUserModal) {
            addUserModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeAddUserModal() {
        if (addUserModal) {
            addUserModal.classList.remove('active');
            document.body.style.overflow = '';

            // Reset form
            const form = document.getElementById('add-user-form');
            if (form) form.reset();

            // Clear preview
            const previewContainer = document.querySelector('.upload-preview');
            if (previewContainer) previewContainer.innerHTML = '';
        }
    }

    if (addUserButton) addUserButton.addEventListener('click', openAddUserModal);
    if (closeModalButton) closeModalButton.addEventListener('click', closeAddUserModal);
    if (cancelAddUserButton) cancelAddUserButton.addEventListener('click', closeAddUserModal);

    // Handle profile picture upload
    const profilePicInput = document.getElementById('user-profile-pic');
    const uploadPreview = document.querySelector('.upload-preview');

    if (profilePicInput && uploadPreview) {
        profilePicInput.addEventListener('change', function () {
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    uploadPreview.innerHTML = '';

                    const img = document.createElement('img');
                    img.classList.add('preview-image');
                    img.src = e.target.result;

                    uploadPreview.appendChild(img);
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Role-based permission presets
    const userRoleSelect = document.getElementById('user-role');

    if (userRoleSelect) {
        userRoleSelect.addEventListener('change', function () {
            const selectedRole = this.value;
            const permissionCheckboxes = document.querySelectorAll('.permission-item input[type="checkbox"]');

            // Reset all permissions
            permissionCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Set permissions based on role
            switch (selectedRole) {
                case 'admin':
                    // Admins get all permissions
                    permissionCheckboxes.forEach(checkbox => {
                        checkbox.checked = true;
                    });
                    break;

                case 'editor':
                    // Editors can view and edit content, but not manage users or settings
                    document.getElementById('perm-view-laws').checked = true;
                    document.getElementById('perm-edit-laws').checked = true;
                    document.getElementById('perm-publish-laws').checked = true;
                    document.getElementById('perm-view-users').checked = true;
                    document.getElementById('perm-view-settings').checked = true;
                    break;

                case 'contributor':
                    // Contributors can view and edit content only
                    document.getElementById('perm-view-laws').checked = true;
                    document.getElementById('perm-edit-laws').checked = true;
                    break;

                case 'viewer':
                    // Viewers can only view content
                    document.getElementById('perm-view-laws').checked = true;
                    break;
            }
        });
    }

    // Save new user functionality
    if (saveNewUserButton) {
        saveNewUserButton.addEventListener('click', function () {
            const form = document.getElementById('add-user-form');

            if (form && form.checkValidity()) {
                // Password validation
                const password = document.getElementById('user-password').value;
                const confirmPassword = document.getElementById('user-confirm-password').value;

                if (password !== confirmPassword) {
                    alert('Passwords do not match!');
                    return;
                }

                // Here you would collect form data and send to server
                alert('User saved successfully!');
                closeAddUserModal();
            } else if (form) {
                // Trigger browser's built-in validation
                form.reportValidity();
            }
        });
    }

    // Initialize pagination for user management
    const usersPaginationButtons = document.querySelectorAll('#user-management .pagination-btn:not([disabled])');
    const usersPerPageSelect = document.getElementById('users-per-page');

    usersPaginationButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (!this.classList.contains('active') && !this.disabled) {
                const activePaginationBtn = document.querySelector('#user-management .pagination-btn.active');
                if (activePaginationBtn) {
                    activePaginationBtn.classList.remove('active');
                }
                this.classList.add('active');
                // In a real implementation, you would load the corresponding page data
            }
        });
    });

    if (usersPerPageSelect) {
        usersPerPageSelect.addEventListener('change', function () {
            // In a real implementation, you would adjust the number of rows shown
            alert(`Changed to ${this.value} users per page`);
        });
    }

    // Action buttons functionality
    const actionButtons = document.querySelectorAll('#user-management .action-buttons .btn-icon');

    actionButtons.forEach(button => {
        button.addEventListener('click', function () {
            const row = this.closest('tr');
            const userId = row.querySelector('td:nth-child(2)').textContent;
            const userName = row.querySelector('.user-name').textContent;

            // Handle different actions based on the button (view, edit, delete)
            if (this.innerHTML.includes('fa-eye')) {
                alert(`Viewing user: ${userName} (${userId})`);
            } else if (this.innerHTML.includes('fa-edit')) {
                alert(`Editing user: ${userName} (${userId})`);
            } else if (this.innerHTML.includes('fa-trash')) {
                if (confirm(`Are you sure you want to delete user ${userName} (${userId})?`)) {
                    alert(`User ${userName} deleted!`);
                    // In a real implementation, you would remove the user from the database
                }
            }
        });
    });
});
// Settings Management JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // Save settings functionality
    const saveSettingsButton = document.querySelector('#settings .btn-primary');

    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function () {
            // Get all settings values
            const systemName = document.getElementById('system-name').value;
            const systemLanguage = document.getElementById('system-language').value;
            const maintenanceMode = document.getElementById('maintenance-mode').checked;

            const passwordExpiry = document.getElementById('password-expiry').value;
            const sessionTimeout = document.getElementById('session-timeout').value;
            const twoFactorAuth = document.getElementById('two-factor-auth').checked;
            const loginLimits = document.getElementById('login-limits').checked;

            const emailNotifications = document.getElementById('email-notifications').checked;
            const appNotifications = document.getElementById('app-notifications').checked;
            const lawUpdateNotifications = document.getElementById('law-update-notifications').checked;

            const autoBackups = document.getElementById('auto-backups').checked;
            const backupFrequency = document.getElementById('backup-frequency').value;
            const logRetention = document.getElementById('log-retention').value;

            // In a real implementation, you would send these settings to the server
            // For demo purposes, just show confirmation
            alert('Settings saved successfully!');

            // Log settings for demonstration (would be removed in production)
            console.log({
                systemName,
                systemLanguage,
                maintenanceMode,
                passwordExpiry,
                sessionTimeout,
                twoFactorAuth,
                loginLimits,
                emailNotifications,
                appNotifications,
                lawUpdateNotifications,
                autoBackups,
                backupFrequency,
                logRetention
            });
        });
    }

    // Automatic change detection (for unsaved changes warning)
    const settingsInputs = document.querySelectorAll('#settings input, #settings select');
    let hasUnsavedChanges = false;

    settingsInputs.forEach(input => {
        input.addEventListener('change', function () {
            hasUnsavedChanges = true;
        });
    });

    // Number input validation
    const numberInputs = document.querySelectorAll('#settings input[type="number"]');

    numberInputs.forEach(input => {
        input.addEventListener('input', function () {
            const value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);

            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    });

    // Manual backup button functionality
    const manualBackupButton = document.querySelector('.backup-actions button:first-child');

    if (manualBackupButton) {
        manualBackupButton.addEventListener('click', function () {
            alert('Manual backup initiated. This may take a few minutes.');
            // In a real implementation, you would trigger a backup process
        });
    }

    // View logs button functionality
    const viewLogsButton = document.querySelector('.backup-actions button:last-child');

    if (viewLogsButton) {
        viewLogsButton.addEventListener('click', function () {
            alert('Redirecting to system logs...');
            // In a real implementation, you would redirect to the logs view
        });
    }

    // Toggle maintenance mode warning
    const maintenanceModeToggle = document.getElementById('maintenance-mode');

    if (maintenanceModeToggle) {
        maintenanceModeToggle.addEventListener('change', function () {
            if (this.checked) {
                const confirm = window.confirm('Enabling maintenance mode will log out all non-administrator users. Are you sure you want to continue?');

                if (!confirm) {
                    this.checked = false;
                }
            }
        });
    }

    // Backup frequency dependent on auto backups
    const autoBackupsToggle = document.getElementById('auto-backups');
    const backupFrequencySelect = document.getElementById('backup-frequency');

    if (autoBackupsToggle && backupFrequencySelect) {
        autoBackupsToggle.addEventListener('change', function () {
            backupFrequencySelect.disabled = !this.checked;
        });

        // Initialize state
        backupFrequencySelect.disabled = !autoBackupsToggle.checked;
    }
});
