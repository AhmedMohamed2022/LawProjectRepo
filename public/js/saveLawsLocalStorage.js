// Add these functions to your existing JavaScript

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