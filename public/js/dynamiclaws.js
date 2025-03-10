// Storage key constants
const LAWS_STORAGE_KEY = 'legal_system_laws';
const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';

// Load laws from local storage
function loadLaws() {
    const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
    return storedLaws ? JSON.parse(storedLaws) : [];
}

// Initialize test data if none exists
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

// Format date helper function
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Capitalize first letter helper function
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Get related explanations for a law
function getRelatedExplanations(lawId) {
    const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
    const explanations = storedExplanations ? JSON.parse(storedExplanations) : [];
    return explanations.filter(exp => exp.relatedLawId === lawId);
}

// Generate law cards from local storage data
function generateLawCards() {
    const laws = loadLaws();
    const lawsContainer = document.querySelector('.laws-container');

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
                    <span><i class="fas fa-bookmark"></i> ${law.tags.length}</span>
                </div>
            </div>
        `;

        lawsContainer.appendChild(lawCard);
    });

    // Add event listeners to view details buttons
    attachViewDetailsListeners();
}

// Function to handle category filtering
function filterLawsByCategory(category) {
    const lawCards = document.querySelectorAll('.law-card');

    lawCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Function to handle search
function searchLaws(searchTerm) {
    const lawCards = document.querySelectorAll('.law-card');
    searchTerm = searchTerm.toLowerCase().trim();

    lawCards.forEach(card => {
        const title = card.querySelector('.law-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.law-excerpt').textContent.toLowerCase();

        if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Attach event listeners to "View Details" buttons
function attachViewDetailsListeners() {
    const viewButtons = document.querySelectorAll('.law-footer .btn-outline');

    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            const lawId = this.getAttribute('data-id');
            openLawModal(lawId);
        });
    });
}

// Open law modal with details
// function openLawModal(lawId) {
//     const laws = loadLaws();
//     const law = laws.find(law => law.id === lawId);

//     if (!law) return;

//     // Update view count
//     law.views += 1;
//     localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));

//     // Update modal content
//     const lawModal = document.getElementById('lawModal');
//     lawModal.querySelector('.law-category-tag').textContent = capitalizeFirstLetter(law.category);
//     lawModal.querySelector('.law-full-title').textContent = law.title;
//     lawModal.querySelector('.law-number').textContent = law.id;
//     document.getElementById('modalLawDate').textContent = formatDate(law.datePublished);

//     // Fill in metadata
//     const metadataSection = lawModal.querySelector('.law-metadata');
//     metadataSection.innerHTML = `
//         <div class="metadata-item">
//             <span class="metadata-label">Effective since:</span>
//             <span class="metadata-value">${formatDate(law.datePublished)}</span>
//         </div>
//         <div class="metadata-item">
//             <span class="metadata-label">Status:</span>
//             <span class="metadata-value">${capitalizeFirstLetter(law.status)}</span>
//         </div>
//         <div class="metadata-item">
//             <span class="metadata-label">Tags:</span>
//             <span class="metadata-value">${law.tags.length}</span>
//         </div>
//         <div class="metadata-item">
//             <span class="metadata-label">Views:</span>
//             <span class="metadata-value">${law.views}</span>
//         </div>
//     `;

//     // Fill in description and content
//     lawModal.querySelector('.law-description').textContent = law.description;

//     // Generate sections from content if available
//     const sectionsContainer = lawModal.querySelector('.law-sections');
//     if (law.content) {
//         // Simple example - in a real app you might parse the content more intelligently
//         sectionsContainer.innerHTML = `
//             <h4>Key Sections</h4>
//             <div class="law-content-text">${law.content}</div>
//         `;
//     } else {
//         sectionsContainer.innerHTML = '<p>No detailed content available for this law.</p>';
//     }

//     // Show tags if available
//     if (law.tags && law.tags.length > 0) {
//         const tagsHtml = law.tags.map(tag => `<span class="law-tag">${tag}</span>`).join('');
//         sectionsContainer.innerHTML += `
//             <div class="law-tags-section">
//                 <h4>Tags</h4>
//                 <div class="law-tags">${tagsHtml}</div>
//             </div>
//         `;
//     }

//     // Add related explanations
//     const relatedExplanations = getRelatedExplanations(lawId);
//     const explanationsSection = document.createElement('div');
//     explanationsSection.className = 'related-explanations';
//     explanationsSection.innerHTML = '<h4>Related Explanations</h4>';

//     if (relatedExplanations.length > 0) {
//         const explList = document.createElement('ul');
//         relatedExplanations.forEach(expl => {
//             const item = document.createElement('li');
//             item.innerHTML = `<a href="dynamicExplanation.html?id=${expl.id}">${expl.title}</a>`;
//             explList.appendChild(item);
//         });
//         explanationsSection.appendChild(explList);
//     } else {
//         explanationsSection.innerHTML += '<p>No explanations available for this law.</p>';
//     }

//     sectionsContainer.appendChild(explanationsSection);

//     // Show modal
//     lawModal.classList.add('active');
//     document.body.style.overflow = 'hidden'; // Prevent background scrolling
// }
// Open law modal with details
// function openLawModal(lawId) {
//     const laws = loadLaws();
//     const law = laws.find(law => law.id === lawId);

//     if (!law) return;

//     // Update view count
//     law.views += 1;
//     localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));

//     // Get related explanations
//     const relatedExplanations = getRelatedExplanations(lawId);

//     // Update modal content
//     const lawModal = document.getElementById('lawModal');
//     lawModal.querySelector('.law-category-tag').textContent = capitalizeFirstLetter(law.category);
//     lawModal.querySelector('.law-full-title').textContent = law.title;
//     lawModal.querySelector('.law-number').textContent = law.id;
//     document.getElementById('modalLawDate').textContent = formatDate(law.datePublished);

//     // ... (rest of your existing code)

//     // Update the AI Analysis button link
//     const aiAnalysisBtn = lawModal.querySelector('.law-modal-footer .btn-primary');
//     if (relatedExplanations.length > 0) {
//         // Set href with the first explanation ID
//         aiAnalysisBtn.href = `dynamicExplanation.html?id=${relatedExplanations[0].id.replace("#", "")}`;
//         aiAnalysisBtn.classList.remove('disabled');
//     } else {
//         aiAnalysisBtn.href = '#';
//         aiAnalysisBtn.classList.add('disabled');
//     }

//     // Show modal
//     lawModal.classList.add('active');
//     document.body.style.overflow = 'hidden'; // Prevent background scrolling
// }
// Open law modal with details
function openLawModal(lawId) {
    const laws = loadLaws();
    const law = laws.find(law => law.id === lawId);

    if (!law) return;

    // Update view count
    law.views += 1;
    localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(laws));

    // Get related explanations
    // const relatedExplanations = getRelatedExplanations(lawId);

    // Update modal content
    const lawModal = document.getElementById('lawModal');
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
            <span class="metadata-value">${law.tags.length}</span>
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
    const relatedExplanations = getRelatedExplanations(lawId);
    // const explanationsSection = document.createElement('div');
    // explanationsSection.className = 'related-explanations';
    // explanationsSection.innerHTML = '<h4>Related Explanations</h4>';

    // if (relatedExplanations.length > 0) {
    //     const explList = document.createElement('ul');
    //     relatedExplanations.forEach(expl => {
    //         const item = document.createElement('li');
    //         item.innerHTML = `<a href="dynamicExplanation.html?id=${expl.id}">${expl.title}</a>`;
    //         explList.appendChild(item);
    //     });
    //     explanationsSection.appendChild(explList);
    // } else {
    //     explanationsSection.innerHTML += '<p>No explanations available for this law.</p>';
    // }

    // sectionsContainer.appendChild(explanationsSection);

    // Update the AI Analysis button link
    const aiAnalysisBtn = lawModal.querySelector('.law-modal-footer .btn-primary');
    if (relatedExplanations.length > 0) {
        // Set href with the first explanation ID
        aiAnalysisBtn.href = `dynamicExplanation.html?id=${relatedExplanations[0].id.replace("#", "")}`;
        aiAnalysisBtn.classList.remove('disabled');
    } else {
        aiAnalysisBtn.href = '#';
        aiAnalysisBtn.classList.add('disabled');
    }

    // Show modal
    lawModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}
// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Initialize test data
    initializeTestData();

    // Generate law cards
    generateLawCards();

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
    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    // Modal close functionality
    const lawModal = document.getElementById('lawModal');
    const closeModalBtn = document.querySelector('.close-modal');

    closeModalBtn.addEventListener('click', function () {
        lawModal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling

        // Refresh the law cards to update view counts
        generateLawCards();
    });

    // Close modal if clicked outside content
    lawModal.addEventListener('click', function (event) {
        if (event.target === lawModal) {
            lawModal.classList.remove('active');
            document.body.style.overflow = '';

            // Refresh the law cards to update view counts
            generateLawCards();
        }
    });

    // Pagination functionality
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (!this.classList.contains('active') && !this.classList.contains('next')) {
                paginationButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // In a real implementation, this would change the page of laws
                console.log('Switching to page:', this.textContent);
            }
        });
    });
});
