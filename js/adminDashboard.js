// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Get the current date
    const currentDate = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = currentDate.toLocaleDateString('en-US', dateOptions);



    // Setup navigation
    setupNavigation();

    // Setup Charts
    setupCharts();
});

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
const lawCheckboxes = document.querySelectorAll('.law-checkbox');

selectAllCheckbox.addEventListener('change', function () {
    lawCheckboxes.forEach(checkbox => {
        const row = checkbox.closest('tr');
        if (row.style.display !== 'none') {
            checkbox.checked = selectAllCheckbox.checked;
        }
    });
});



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

// Configuration for data storage
const STORAGE_KEY = 'legal_system_laws';

// Function to save laws to persistent storage
function saveLaws(lawsData) {
    // For a production environment, this would be an API call to your backend
    // For this example, we'll use localStorage as a simple demonstration
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lawsData));

    // Optional: Trigger an event that other parts of your application can listen for
    const updateEvent = new CustomEvent('laws-updated', { detail: { laws: lawsData } });
    document.dispatchEvent(updateEvent);
}

// Function to load laws from persistent storage
function loadLaws() {
    // For a production environment, this would fetch from your API
    const storedLaws = localStorage.getItem(STORAGE_KEY);
    return storedLaws ? JSON.parse(storedLaws) : [];
}
// Add this right after the loadLaws() function
function initializeTestData() {
    // Check if data already exists
    const laws = loadLaws();

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
}
// Function to generate a unique ID for new laws
function generateLawId() {
    const laws = loadLaws();
    let maxId = 0;

    laws.forEach(law => {
        const idNum = parseInt(law.id.replace('#LW-', ''));
        if (idNum > maxId) maxId = idNum;
    });

    const newId = maxId + 1;
    return `#LW-${String(newId).padStart(3, '0')}`;
}

// Function to add a new law
function addNewLaw(lawData) {
    const laws = loadLaws();
    const newLaw = {
        id: generateLawId(),
        title: lawData.title,
        category: lawData.category,
        status: lawData.status,
        description: lawData.description,
        content: lawData.content,
        datePublished: new Date().toISOString().split('T')[0],
        views: 0,
        tags: lawData.tags || [],
        documents: lawData.documents || []
    };

    laws.push(newLaw);
    saveLaws(laws);
    return newLaw;
}

// Function to display laws in the table
function displayLaws() {
    const laws = loadLaws();
    const tableBody = document.querySelector('.laws-table tbody');

    // Clear the current table
    tableBody.innerHTML = '';

    // Add each law to the table
    laws.forEach(law => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><input type="checkbox" class="law-checkbox"></td>
            <td>${law.id}</td>
            <td>${law.title}</td>
            <td><span class="category-badge ${law.category}">${capitalizeFirstLetter(law.category)}</span></td>
            <td>${formatDate(law.datePublished)}</td>
            <td><span class="status-badge ${law.status}">${capitalizeFirstLetter(law.status)}</span></td>
            <td>${law.views.toLocaleString()}</td>
            <td class="action-buttons">
                <button class="btn-icon view-law" data-id="${law.id}"><i class="fas fa-eye"></i></button>
                <button class="btn-icon edit-law" data-id="${law.id}"><i class="fas fa-edit"></i></button>
                <button class="btn-icon delete-law" data-id="${law.id}"><i class="fas fa-trash"></i></button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Re-attach event listeners for the new buttons
    attachActionListeners();

    // Update pagination info
    updatePaginationInfo();
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Helper function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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
function attachActionListeners() {
    // View law
    document.querySelectorAll('.view-law').forEach(button => {
        button.addEventListener('click', function () {
            const lawId = this.getAttribute('data-id');
            viewLaw(lawId);
        });
    });

    // Edit law
    document.querySelectorAll('.edit-law').forEach(button => {
        button.addEventListener('click', function () {
            const lawId = this.getAttribute('data-id');
            editLaw(lawId);
        });
    });

    // Delete law
    document.querySelectorAll('.delete-law').forEach(button => {
        button.addEventListener('click', function () {
            const lawId = this.getAttribute('data-id');
            deleteLaw(lawId);
        });
    });
}

// Function to view a law
function viewLaw(lawId) {
    const laws = loadLaws();
    const law = laws.find(law => law.id === lawId);

    if (law) {
        // Increment the view count
        law.views += 1;
        saveLaws(laws);

        // In a real app, you'd open a detailed view
        alert(`Viewing law: ${law.title}`);

        // After viewing, refresh the display to update view count
        displayLaws();
    }
}

// Function to edit a law
function editLaw(lawId) {
    const laws = loadLaws();
    const law = laws.find(law => law.id === lawId);

    if (law) {
        // Populate the modal with the law data
        document.getElementById('law-title').value = law.title;
        document.getElementById('law-category').value = law.category;
        document.getElementById('law-status').value = law.status;
        document.getElementById('law-description').value = law.description;
        document.getElementById('law-content').value = law.content;

        // Populate tags
        const tagsContainer = document.querySelector('.tags-container');
        tagsContainer.innerHTML = '';

        law.tags.forEach(tagText => {
            const tag = document.createElement('div');
            tag.className = 'tag';
            tag.innerHTML = `
                ${tagText}
                <span class="tag-close"><i class="fas fa-times"></i></span>
            `;

            tag.querySelector('.tag-close').addEventListener('click', function () {
                tag.remove();
            });

            tagsContainer.appendChild(tag);
        });

        // Store the law ID for the save function
        saveNewLawButton.setAttribute('data-editing', lawId);

        // Open the modal
        openAddLawModal();
    }
}

// Function to delete a law
function deleteLaw(lawId) {
    if (confirm('Are you sure you want to delete this law?')) {
        const laws = loadLaws();
        const updatedLaws = laws.filter(law => law.id !== lawId);

        saveLaws(updatedLaws);
        displayLaws();
    }
}

// Update the save law functionality
saveNewLawButton.addEventListener('click', function () {
    const form = document.getElementById('add-law-form');

    if (form.checkValidity()) {
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
            const laws = loadLaws();
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

                saveLaws(laws);
                saveNewLawButton.removeAttribute('data-editing');
            }
        } else {
            // Adding new law
            addNewLaw(lawData);
        }

        // Display success message
        alert('Law saved successfully!');

        // Refresh the display
        displayLaws();

        // Close the modal
        closeAddLawModal();
    } else {
        // Trigger browser's built-in validation UI
        form.reportValidity();
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Make the section visible when JS is loaded
    document.getElementById('laws-management').style.display = 'block';

    // Load and display laws
    displayLaws();

    // Set up pagination
    setupPagination();

    // Set up filters
    categoryFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add explanation modal
// Modal functionality for law explanations
const addExplanationButton = document.getElementById('add-explanation-btn');
const addExplanationModal = document.getElementById('add-explanation-modal');
const closeExplanationModalButton = document.querySelector('.close-explanation-modal');
const cancelAddExplanationButton = document.getElementById('cancel-add-explanation');
const saveNewExplanationButton = document.getElementById('save-new-explanation');

// Add this before the openLawModal function
function getRelatedExplanations(lawId) {
    const storedExplanations = localStorage.getItem('legal_system_explanations');
    const explanations = storedExplanations ? JSON.parse(storedExplanations) : [];
    return explanations.filter(exp => exp.relatedLawId === lawId);
}
function openAddExplanationModal() {
    addExplanationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    populateRelatedLawsDropdown();
}

function closeAddExplanationModal() {
    addExplanationModal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('add-explanation-form').reset();
    document.querySelector('.explanation-tags-container').innerHTML = '';
    document.querySelector('.explanation-uploaded-files').innerHTML = '';
    saveNewExplanationButton.removeAttribute('data-editing');
}

addExplanationButton.addEventListener('click', openAddExplanationModal);
closeExplanationModalButton.addEventListener('click', closeAddExplanationModal);
cancelAddExplanationButton.addEventListener('click', closeAddExplanationModal);

// Function to populate the "Related Law" dropdown with existing laws
function populateRelatedLawsDropdown() {
    const relatedLawSelect = document.getElementById('related-law');
    const laws = loadLaws();

    // Clear existing options except the first one
    while (relatedLawSelect.options.length > 1) {
        relatedLawSelect.remove(1);
    }

    // Add laws to dropdown
    laws.forEach(law => {
        const option = document.createElement('option');
        option.value = law.id;
        option.textContent = `${law.id} - ${law.title}`;
        relatedLawSelect.appendChild(option);
    });
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

// Handle file uploads for explanations
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

// Configuration for explanation storage
const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';

// Function to save explanations to persistent storage
function saveExplanations(explanationsData) {
    localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanationsData));

    const updateEvent = new CustomEvent('explanations-updated', { detail: { explanations: explanationsData } });
    document.dispatchEvent(updateEvent);
}

// Function to load explanations from persistent storage
function loadExplanations() {
    const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
    return storedExplanations ? JSON.parse(storedExplanations) : [];
}

// Function to generate a unique ID for new explanations
function generateExplanationId() {
    const explanations = loadExplanations();
    let maxId = 0;

    explanations.forEach(explanation => {
        const idNum = parseInt(explanation.id.replace('#EXP-', ''));
        if (idNum > maxId) maxId = idNum;
    });

    const newId = maxId + 1;
    return `#EXP-${String(newId).padStart(3, '0')}`;
}

// Function to add a new explanation
function addNewExplanation(explanationData) {
    const explanations = loadExplanations();
    const newExplanation = {
        id: generateExplanationId(),
        title: explanationData.title,
        relatedLawId: explanationData.relatedLawId,
        category: explanationData.category,
        status: explanationData.status,
        summary: explanationData.summary,
        content: explanationData.content,
        datePublished: new Date().toISOString().split('T')[0],
        views: 0,
        tags: explanationData.tags || [],
        documents: explanationData.documents || []
    };

    explanations.push(newExplanation);
    saveExplanations(explanations);
    return newExplanation;
}

// Update the save explanation functionality
saveNewExplanationButton.addEventListener('click', function () {
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
            const explanations = loadExplanations();
            const explanationIndex = explanations.findIndex(explanation => explanation.id === editingId);

            if (explanationIndex !== -1) {
                // Preserve the original id, date, and views
                const originalData = explanations[explanationIndex];
                explanations[explanationIndex] = {
                    ...originalData,
                    title: explanationData.title,
                    relatedLawId: explanationData.relatedLawId,
                    category: explanationData.category,
                    status: explanationData.status,
                    summary: explanationData.summary,
                    content: explanationData.content,
                    tags: explanationData.tags
                };

                saveExplanations(explanations);
                saveNewExplanationButton.removeAttribute('data-editing');
            }
        } else {
            // Adding new explanation
            addNewExplanation(explanationData);
        }

        // Display success message
        alert('Explanation saved successfully!');

        // Close the modal
        closeAddExplanationModal();

        // If you have a function to display explanations in a table, call it here
        // displayExplanations();
    } else {
        // Trigger browser's built-in validation UI
        form.reportValidity();
    }
});

// You may want to create additional functions to display explanations in a table
// Similar to how you display laws, but I'll include the function structure here
/*
function displayExplanations() {
    const explanations = loadExplanations();
    const explanationsTableBody = document.querySelector('.explanations-table tbody');
    // Implement similar to displayLaws() function
}
*/



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