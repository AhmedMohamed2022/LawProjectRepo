// // * Legal System Dashboard
// //  * A comprehensive dashboard for managing laws and explanations
// //  */

// // Constants for storage keys
// const LAWS_STORAGE_KEY = 'legal_system_laws';
// const EXPLANATIONS_STORAGE_KEY = 'legal_system_explanations';

// // Initialize application when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize UI components
//     initializeUI();
    
//     // Initialize data
//     initializeData();
    
//     // Set up event listeners
//     setupEventListeners();
// });

// /**
//  * UI Initialization Functions
//  */
// function initializeUI() {
//     // Set current date
//     setCurrentDate();
    
//     // Setup mobile sidebar
//     setupMobileSidebar();
    
//     // Setup navigation
//     setupNavigation();
    
//     // Initialize charts
//     setupCharts();
    
//     // Make the laws management section visible
//     document.getElementById('laws-management').style.display = 'block';
    
//     // Display laws in the table
//     displayLaws();
    
//     // Also display explanations if on that tab
//     if (document.querySelector('.explanations-table')) {
//         displayExplanations();
//     }
//     // Setup pagination
//     setupPagination();
// }
// function saveLawHandler() {
//     console.log("Save law handler called");
//     // Rest of function...
// }

// function saveExplanationHandler() {
//     console.log("Save explanation handler called");
//     // Rest of function...
// }
// function setCurrentDate() {
//     const currentDateElement = document.getElementById('current-date');
//     if (currentDateElement) {
//         const today = new Date();
//         const options = { year: 'numeric', month: 'long', day: 'numeric' };
//         currentDateElement.textContent = today.toLocaleDateString('en-US', options);
//     }
// }

// function setupMobileSidebar() {
//     // Create the sidebar toggle button if it doesn't exist
//     if (!document.querySelector('.sidebar-toggle')) {
//         const toggleButton = document.createElement('button');
//         toggleButton.className = 'sidebar-toggle';
//         toggleButton.innerHTML = '<i class="fas fa-bars"></i>';
//         const header = document.querySelector('.dashboard-header');
//         if (header) {
//             header.prepend(toggleButton);
//         }
//     }

//     // Add click event to toggle sidebar
//     const toggleBtn = document.querySelector('.sidebar-toggle');
//     if (toggleBtn) {
//         toggleBtn.addEventListener('click', function() {
//             document.querySelector('.sidebar').classList.toggle('active');
//         });
//     }

//     // Close sidebar when clicking outside on mobile
//     document.addEventListener('click', function(e) {
//         const sidebar = document.querySelector('.sidebar');
//         const toggleBtn = document.querySelector('.sidebar-toggle');
        
//         if (sidebar && toggleBtn && 
//             sidebar.classList.contains('active') &&
//             !sidebar.contains(e.target) &&
//             !toggleBtn.contains(e.target)) {
//             sidebar.classList.remove('active');
//         }
//     });
// }

// function setupNavigation() {
//     const navLinks = document.querySelectorAll('.sidebar-nav ul li a');

//     navLinks.forEach(link => {
//         link.addEventListener('click', function(e) {
//             // Remove active class from all links
//             navLinks.forEach(link => {
//                 link.parentElement.classList.remove('active');
//             });

//             // Add active class to clicked link
//             this.parentElement.classList.add('active');

//             // Show corresponding section
//             const targetId = this.getAttribute('href').substring(1);
//             const sections = document.querySelectorAll('.dashboard-section');

//             sections.forEach(section => {
//                 section.style.display = 'none';
//             });

//             document.getElementById(targetId).style.display = 'block';
//         });
//     });
// }

// /**
//  * Chart Setup
//  */
// function setupCharts() {
//     setupUserActivityChart();
//     setupLawCategoriesChart();
//     setupChartPeriodSelectors();
// }

// function setupUserActivityChart() {
//     const userActivityCtx = document.getElementById('userActivityChart');
    
//     if (userActivityCtx) {
//         const ctx = userActivityCtx.getContext('2d');
//         const userActivityChart = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//                 datasets: [
//                     {
//                         label: 'This Week',
//                         data: [65, 59, 80, 81, 56, 55, 40],
//                         borderColor: '#056d6c',
//                         backgroundColor: 'rgba(5, 109, 108, 0.1)',
//                         tension: 0.4,
//                         fill: true
//                     },
//                     {
//                         label: 'Last Week',
//                         data: [28, 48, 40, 19, 86, 27, 90],
//                         borderColor: '#cccccc',
//                         borderDash: [5, 5],
//                         tension: 0.4,
//                         fill: false
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     }
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });
        
//         // Store chart reference for later use
//         window.userActivityChart = userActivityChart;
//     }
// }

// function setupLawCategoriesChart() {
//     const lawCategoriesCtx = document.getElementById('lawCategoriesChart');
    
//     if (lawCategoriesCtx) {
//         const ctx = lawCategoriesCtx.getContext('2d');
//         const lawCategoriesChart = new Chart(ctx, {
//             type: 'doughnut',
//             data: {
//                 labels: ['Constitutional', 'Civil', 'Criminal', 'Administrative', 'Corporate', 'Tax'],
//                 datasets: [{
//                     data: [18, 25, 30, 15, 22, 20],
//                     backgroundColor: [
//                         '#056d6c',
//                         '#35a29f',
//                         '#97dece',
//                         '#071952',
//                         '#0b666a',
//                         '#35a29f'
//                     ],
//                     borderWidth: 0
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 maintainAspectRatio: false,
//                 plugins: {
//                     legend: {
//                         position: 'right'
//                     }
//                 },
//                 cutout: '70%'
//             }
//         });
//     }
// }

// function setupChartPeriodSelectors() {
//     const chartPeriodButtons = document.querySelectorAll('.chart-actions .btn-outline');

//     chartPeriodButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             chartPeriodButtons.forEach(btn => btn.classList.remove('active'));
//             this.classList.add('active');

//             // Update chart data based on selected period
//             if (window.userActivityChart) {
//                 const newData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
//                 window.userActivityChart.data.datasets[0].data = newData;
//                 window.userActivityChart.update();
//             }
//         });
//     });
// }

// /**
//  * Pagination Setup
//  */
// function setupPagination() {
//     const paginationButtons = document.querySelectorAll('.pagination-btn:not([disabled])');
//     const itemsPerPageSelect = document.getElementById('items-per-page');

//     if (paginationButtons) {
//         paginationButtons.forEach(button => {
//             button.addEventListener('click', function() {
//                 if (!this.classList.contains('active') && !this.disabled) {
//                     const activeBtn = document.querySelector('.pagination-btn.active');
//                     if (activeBtn) {
//                         activeBtn.classList.remove('active');
//                     }
//                     this.classList.add('active');
//                     // In a real implementation, you would load the corresponding page data
//                 }
//             });
//         });
//     }

//     if (itemsPerPageSelect) {
//         itemsPerPageSelect.addEventListener('change', function() {
//             // In a real implementation, you would adjust the number of rows shown
//             alert(`Changed to ${this.value} items per page`);
//         });
//     }
    
//     updatePaginationInfo();
// }

// function updatePaginationInfo() {
//     const visibleRows = document.querySelectorAll('.laws-table tbody tr:not([style*="display: none"])');
//     const paginationInfo = document.querySelector('.pagination-info');

//     if (paginationInfo) {
//         const totalLaws = document.querySelectorAll('.laws-table tbody tr').length;
//         const visibleCount = visibleRows.length;

//         if (visibleCount < totalLaws) {
//             paginationInfo.innerHTML = `Showing <span>${visibleCount}</span> of <span>${totalLaws}</span> laws (filtered)`;
//         } else {
//             paginationInfo.innerHTML = `Showing <span>1-${visibleCount}</span> of <span>${totalLaws}</span> laws`;
//         }
//     }
// }

// /**
//  * Data Initialization and Management
//  */
// function initializeData() {
//     // Initialize test data if needed
//     initializeTestData();
// }

// function initializeTestData() {
//     // Check if data already exists
//     const laws = loadLaws();

//     if (laws.length === 0) {
//         // Create sample law data
//         const sampleLaws = [
//             {
//                 id: "#LW-001",
//                 title: "Sample Law Title",
//                 category: "criminal",
//                 description: "This is a sample law description.",
//                 datePublished: new Date().toISOString(),
//                 views: 0,
//                 tags: ["tag1", "tag2"],
//                 status: "active",
//                 content: "Section 1: Sample content\nSection 2: More sample content"
//             }
//         ];
//         saveLaws(sampleLaws);
//     }
// }

// /**
//  * Law Management Functions
//  */
// function loadLaws() {
//     const storedLaws = localStorage.getItem(LAWS_STORAGE_KEY);
//     return storedLaws ? JSON.parse(storedLaws) : [];
// }

// function saveLaws(lawsData) {
//     localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(lawsData));

//     // Trigger an event that other parts of your application can listen for
//     const updateEvent = new CustomEvent('laws-updated', { detail: { laws: lawsData } });
//     document.dispatchEvent(updateEvent);
// }

// function generateLawId() {
//     const laws = loadLaws();
//     let maxId = 0;

//     laws.forEach(law => {
//         const idNum = parseInt(law.id.replace('#LW-', ''));
//         if (idNum > maxId) maxId = idNum;
//     });

//     const newId = maxId + 1;
//     return `#LW-${String(newId).padStart(3, '0')}`;
// }

// function addNewLaw(lawData) {
//     const laws = loadLaws();
//     const newLaw = {
//         id: generateLawId(),
//         title: lawData.title,
//         category: lawData.category,
//         status: lawData.status,
//         description: lawData.description,
//         content: lawData.content,
//         datePublished: new Date().toISOString().split('T')[0],
//         views: 0,
//         tags: lawData.tags || [],
//         documents: lawData.documents || []
//     };

//     laws.push(newLaw);
//     saveLaws(laws);
//     return newLaw;
// }

// function displayLaws() {
//     const laws = loadLaws();
//     const tableBody = document.querySelector('.laws-table tbody');

//     if (tableBody) {
//         // Clear the current table
//         tableBody.innerHTML = '';

//         // Add each law to the table
//         laws.forEach(law => {
//             const row = document.createElement('tr');

//             row.innerHTML = `
//                 <td><input type="checkbox" class="law-checkbox"></td>
//                 <td>${law.id}</td>
//                 <td>${law.title}</td>
//                 <td><span class="category-badge ${law.category}">${capitalizeFirstLetter(law.category)}</span></td>
//                 <td>${formatDate(law.datePublished)}</td>
//                 <td><span class="status-badge ${law.status}">${capitalizeFirstLetter(law.status)}</span></td>
//                 <td>${law.views.toLocaleString()}</td>
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
//     }
// }

// function attachActionListeners() {
//     // View law
//     document.querySelectorAll('.view-law').forEach(button => {
//         button.addEventListener('click', function() {
//             const lawId = this.getAttribute('data-id');
//             viewLaw(lawId);
//         });
//     });

//     // Edit law
//     document.querySelectorAll('.edit-law').forEach(button => {
//         button.addEventListener('click', function() {
//             const lawId = this.getAttribute('data-id');
//             editLaw(lawId);
//         });
//     });

//     // Delete law
//     document.querySelectorAll('.delete-law').forEach(button => {
//         button.addEventListener('click', function() {
//             const lawId = this.getAttribute('data-id');
//             deleteLaw(lawId);
//         });
//     });
// }

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

//             tag.querySelector('.tag-close').addEventListener('click', function() {
//                 tag.remove();
//             });

//             tagsContainer.appendChild(tag);
//         });

//         // Store the law ID for the save function
//         const saveNewLawButton = document.getElementById('save-new-law');
//         if (saveNewLawButton) {
//             saveNewLawButton.setAttribute('data-editing', lawId);
//         }

//         // Open the modal
//         openAddLawModal();
//     }
// }

// function deleteLaw(lawId) {
//     if (confirm('Are you sure you want to delete this law?')) {
//         const laws = loadLaws();
//         const updatedLaws = laws.filter(law => law.id !== lawId);

//         saveLaws(updatedLaws);
//         displayLaws();
//     }
// }

// /**
//  * Explanation Management Functions
//  */
// function loadExplanations() {
//     const storedExplanations = localStorage.getItem(EXPLANATIONS_STORAGE_KEY);
//     return storedExplanations ? JSON.parse(storedExplanations) : [];
// }

// function saveExplanations(explanationsData) {
//     localStorage.setItem(EXPLANATIONS_STORAGE_KEY, JSON.stringify(explanationsData));

//     const updateEvent = new CustomEvent('explanations-updated', { detail: { explanations: explanationsData } });
//     document.dispatchEvent(updateEvent);
// }

// function generateExplanationId() {
//     const explanations = loadExplanations();
//     let maxId = 0;

//     explanations.forEach(explanation => {
//         const idNum = parseInt(explanation.id.replace('#EXP-', ''));
//         if (idNum > maxId) maxId = idNum;
//     });

//     const newId = maxId + 1;
//     return `#EXP-${String(newId).padStart(3, '0')}`;
// }

// function addNewExplanation(explanationData) {
//     const explanations = loadExplanations();
//     const newExplanation = {
//         id: generateExplanationId(),
//         title: explanationData.title,
//         relatedLawId: explanationData.relatedLawId,
//         category: explanationData.category,
//         status: explanationData.status,
//         summary: explanationData.summary,
//         content: explanationData.content,
//         datePublished: new Date().toISOString().split('T')[0],
//         views: 0,
//         tags: explanationData.tags || [],
//         documents: explanationData.documents || []
//     };

//     explanations.push(newExplanation);
//     saveExplanations(explanations);
//     return newExplanation;
// }

// function getRelatedExplanations(lawId) {
//     const explanations = loadExplanations();
//     return explanations.filter(exp => exp.relatedLawId === lawId);
// }

// function populateRelatedLawsDropdown() {
//     const relatedLawSelect = document.getElementById('related-law');
//     if (relatedLawSelect) {
//         const laws = loadLaws();

//         // Clear existing options except the first one
//         while (relatedLawSelect.options.length > 1) {
//             relatedLawSelect.remove(1);
//         }

//         // Add laws to dropdown
//         laws.forEach(law => {
//             const option = document.createElement('option');
//             option.value = law.id;
//             option.textContent = `${law.id} - ${law.title}`;
//             relatedLawSelect.appendChild(option);
//         });
//     }
// }

// /**
//  * Modal Management Functions
//  */
// function openAddLawModal() {
//     const addLawModal = document.getElementById('add-law-modal');
//     if (addLawModal) {
//         addLawModal.classList.add('active');
//         document.body.style.overflow = 'hidden';
//     }
// }

// function closeAddLawModal() {
//     const addLawModal = document.getElementById('add-law-modal');
//     if (addLawModal) {
//         addLawModal.classList.remove('active');
//         document.body.style.overflow = '';
        
//         const form = document.getElementById('add-law-form');
//         if (form) {
//             form.reset();
//         }
        
//         const tagsContainer = document.querySelector('.tags-container');
//         if (tagsContainer) {
//             tagsContainer.innerHTML = '';
//         }
        
//         const uploadedFiles = document.querySelector('.uploaded-files');
//         if (uploadedFiles) {
//             uploadedFiles.innerHTML = '';
//         }
        
//         const saveNewLawButton = document.getElementById('save-new-law');
//         if (saveNewLawButton) {
//             saveNewLawButton.removeAttribute('data-editing');
//         }
//     }
// }

// function openAddExplanationModal() {
//     const addExplanationModal = document.getElementById('add-explanation-modal');
//     if (addExplanationModal) {
//         addExplanationModal.classList.add('active');
//         document.body.style.overflow = 'hidden';
//         populateRelatedLawsDropdown();
//     }
// }

// function closeAddExplanationModal() {
//     const addExplanationModal = document.getElementById('add-explanation-modal');
//     if (addExplanationModal) {
//         addExplanationModal.classList.remove('active');
//         document.body.style.overflow = '';
        
//         const form = document.getElementById('add-explanation-form');
//         if (form) {
//             form.reset();
//         }
        
//         const tagsContainer = document.querySelector('.explanation-tags-container');
//         if (tagsContainer) {
//             tagsContainer.innerHTML = '';
//         }
        
//         const uploadedFiles = document.querySelector('.explanation-uploaded-files');
//         if (uploadedFiles) {
//             uploadedFiles.innerHTML = '';
//         }
        
//         const saveNewExplanationButton = document.getElementById('save-new-explanation');
//         if (saveNewExplanationButton) {
//             saveNewExplanationButton.removeAttribute('data-editing');
//         }
//     }
// }

// /**
//  * Filter Functions
//  */
// function applyFilters() {
//     const categoryFilter = document.getElementById('category-filter');
//     const statusFilter = document.getElementById('status-filter');
//     const searchInput = document.getElementById('law-search');
    
//     if (!categoryFilter || !statusFilter || !searchInput) return;
    
//     const categoryValue = categoryFilter.value.toLowerCase();
//     const statusValue = statusFilter.value.toLowerCase();
//     const searchValue = searchInput.value.toLowerCase();
//     const rows = document.querySelectorAll('.laws-table tbody tr');

//     rows.forEach(row => {
//         const categoryText = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
//         const statusText = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
//         const lawTitle = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
//         const lawId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

//         const matchesCategory = categoryValue === '' || categoryText.includes(categoryValue);
//         const matchesStatus = statusValue === '' || statusText.includes(statusValue);
//         const matchesSearch = searchValue === '' ||
//             lawTitle.includes(searchValue) ||
//             lawId.includes(searchValue);

//         if (matchesCategory && matchesStatus && matchesSearch) {
//             row.style.display = '';
//         } else {
//             row.style.display = 'none';
//         }
//     });

//     updatePaginationInfo();
// }

// /**
//  * Helper Functions
//  */
// function capitalizeFirstLetter(string) {
//     return string.charAt(0).toUpperCase() + string.slice(1);
// }

// function formatDate(dateString) {
//     const date = new Date(dateString);
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
// }

// /**
//  * Setup Event Listeners
//  */
// function setupEventListeners() {
//     // Law modal events
//     const addLawButton = document.getElementById('add-law-btn');
//     const closeModalButton = document.querySelector('.close-modal');
//     const cancelAddLawButton = document.getElementById('cancel-add-law');
//     const saveNewLawButton = document.getElementById('save-new-law');
    
//     if (addLawButton) {
//         addLawButton.addEventListener('click', openAddLawModal);
//     }
    
//     if (closeModalButton) {
//         closeModalButton.addEventListener('click', closeAddLawModal);
//     }
    
//     if (cancelAddLawButton) {
//         cancelAddLawButton.addEventListener('click', closeAddLawModal);
//     }
    
//     // Explanation modal events
//     const addExplanationButton = document.getElementById('add-explanation-btn');
//     const closeExplanationModalButton = document.querySelector('.close-explanation-modal');
//     const cancelAddExplanationButton = document.getElementById('cancel-add-explanation');
//     const saveNewExplanationButton = document.getElementById('save-new-explanation');
    
//     if (addExplanationButton) {
//         addExplanationButton.addEventListener('click', openAddExplanationModal);
//     }
    
//     if (closeExplanationModalButton) {
//         closeExplanationModalButton.addEventListener('click', closeAddExplanationModal);
//     }
    
//     if (cancelAddExplanationButton) {
//         cancelAddExplanationButton.addEventListener('click', closeAddExplanationModal);
//     }
    
//     // Filter events
//     const categoryFilter = document.getElementById('category-filter');
//     const statusFilter = document.getElementById('status-filter');
//     const searchInput = document.getElementById('law-search');
    
//     if (categoryFilter) {
//         categoryFilter.addEventListener('change', applyFilters);
//     }
    
//     if (statusFilter) {
//         statusFilter.addEventListener('change', applyFilters);
//     }
    
//     if (searchInput) {
//         searchInput.addEventListener('input', applyFilters);
//     }
    
//     // Select all checkbox functionality
//     const selectAllCheckbox = document.getElementById('select-all-laws');
    
//     if (selectAllCheckbox) {
//         selectAllCheckbox.addEventListener('change', function() {
//             const lawCheckboxes = document.querySelectorAll('.law-checkbox');
//             lawCheckboxes.forEach(checkbox => {
//                 const row = checkbox.closest('tr');
//                 if (row.style.display !== 'none') {
//                     checkbox.checked = selectAllCheckbox.checked;
//                 }
//             });
//         });
//     }
    
//     // Activity item dropdown menus
//     setupActivityDropdowns();
    
//     // Tag input handling
//     setupTagInputs();
    
//     // File upload handling
//     setupFileUploads();
    
//     // Save law functionality
//     if (saveNewLawButton) {
//         saveNewLawButton.addEventListener('click', saveLawHandler);
//     }
    
//     // Save explanation functionality
//     if (saveNewExplanationButton) {
//         saveNewExplanationButton.addEventListener('click', saveExplanationHandler);
//     }
// }

// function setupActivityDropdowns() {
//     const activityDropdownButtons = document.querySelectorAll('.activity-item .btn-icon');

//     activityDropdownButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const dropdown = document.createElement('div');
//             dropdown.classList.add('activity-dropdown');
//             dropdown.innerHTML = `
//                 <ul>
//                     <li><a href="#"><i class="fas fa-eye"></i> View Details</a></li>
//                     <li><a href="#"><i class="fas fa-edit"></i> Edit</a></li>
//                     <li><a href="#" class="text-danger"><i class="fas fa-trash"></i> Delete</a></li>
//                 </ul>
//             `;

//             // Remove any existing dropdowns
//             document.querySelectorAll('.activity-dropdown').forEach(d => d.remove());

//             // Add new dropdown
//             this.appendChild(dropdown);

//             // Close dropdown when clicking outside
//             document.addEventListener('click', function closeDropdown(e) {
//                 if (!e.target.closest('.btn-icon')) {
//                     dropdown.remove();
//                     document.removeEventListener('click', closeDropdown);
//                 }
//             });

//             // Prevent event propagation
//             dropdown.addEventListener('click', function(e) {
//                 e.stopPropagation();
//             });
//         });
//     });
// }

// function setupTagInputs() {
//     // Law tags
//     const tagInput = document.getElementById('tag-input');
//     const tagsContainer = document.querySelector('.tags-container');
    
//     if (tagInput && tagsContainer) {
//         tagInput.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter' && tagInput.value.trim() !== '') {
//                 e.preventDefault();

//                 const tag = document.createElement('div');
//                 tag.className = 'tag';
//                 tag.innerHTML = `
//                     ${tagInput.value.trim()}
//                     <span class="tag-close"><i class="fas fa-times"></i></span>
//                 `;

//                 tag.querySelector('.tag-close').addEventListener('click', function() {
//                     tag.remove();
//                 });

//                 tagsContainer.appendChild(tag);
//                 tagInput.value = '';
//             }
//         });
//     }
    
//     // Explanation tags
//     const explanationTagInput = document.getElementById('explanation-tag-input');
//     const explanationTagsContainer = document.querySelector('.explanation-tags-container');
    
//     if (explanationTagInput && explanationTagsContainer) {
//         explanationTagInput.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter' && explanationTagInput.value.trim() !== '') {
//                 e.preventDefault();

//                 const tag = document.createElement('div');
//                 tag.className = 'tag';
//                 tag.innerHTML = `
//                     ${explanationTagInput.value.trim()}
//                     <span class="tag-close"><i class="fas fa-times"></i></span>
//                 `;

//                 tag.querySelector('.tag-close').addEventListener('click', function() {
//                     tag.remove();
//                 });

//                 explanationTagsContainer.appendChild(tag);
//                 explanationTagInput.value = '';
//             }
//         });
//     }
// }

// function setupFileUploads() {
//     // Law file uploads
//     const fileInput = document.getElementById('law-documents');
//     const uploadedFiles = document.querySelector('.uploaded-files');
    
//     if (fileInput && uploadedFiles) {
//         fileInput.addEventListener('change', function() {
//             uploadedFiles.innerHTML = '';

//             Array.from(fileInput.files).forEach(file => {
//                 const fileElement = document.createElement('div');
//                 fileElement.className = 'uploaded-file';
//                 fileElement.innerHTML = `
//                     <span class="file-icon"><i class="fas fa-file"></i></span>
//                     ${file.name}
//                     <span class="file-remove"><i class="fas fa-times"></i></span>
//                 `;

//                 fileElement.querySelector('.file-remove').addEventListener('click', function() {
//                     fileElement.remove();
//                     // Note: This doesn't actually remove the file from the input
//                 });

//                 uploadedFiles.appendChild(fileElement);
//             });
//         });
//     }
    
//     // Explanation file uploads
//     const explanationFileInput = document.getElementById('explanation-documents');
//     const explanationUploadedFiles = document.querySelector('.explanation-uploaded-files');
    
//     if (explanationFileInput && explanationUploadedFiles) {
//         explanationFileInput.addEventListener('change', function() {
//             explanationUploadedFiles.innerHTML = '';

//             Array.from(explanationFileInput.files).forEach(file => {
//                 const fileElement = document.createElement('div');
//                 fileElement.className = 'uploaded-file';
//                 fileElement.innerHTML = `
//                     <span class="file-icon"><i class="fas fa-file"></i></span>
//                     ${file.name}
//                     <span class="file-remove"><i class="fas fa-times"></i></span>
//                 `;

//                 fileElement.querySelector('.file-remove').addEventListener('click', function() {
//                     fileElement.remove();
//                     // Note: This doesn't actually remove the file from the input
//                 });

//                 explanationUploadedFiles.appendChild(fileElement);
//             });
//         });
//     }
// }

// function saveLawHandler() {
//     const form = document.getElementById('add-law-form');
//     const saveNewLawButton = document.getElementById('save-new-law'); // Add this line

//     if (form && form.checkValidity()) {
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

//         // Close the modal
//         closeAddLawModal();

//         // Refresh the laws table
//         displayLaws();
//     } else {
//         // Trigger browser's built-in validation UI
//         form.reportValidity();
//     }
// }

// function saveExplanationHandler() {
//     const form = document.getElementById('add-explanation-form');

//     if (form && form.checkValidity()) {
//         // Collect form data
//         const explanationData = {
//             title: document.getElementById('explanation-title').value,
//             relatedLawId: document.getElementById('related-law').value,
//             category: document.getElementById('explanation-category').value,
//             status: document.getElementById('explanation-status').value,
//             summary: document.getElementById('explanation-summary').value,
//             content: document.getElementById('explanation-content').value,
//             tags: Array.from(document.querySelectorAll('.explanation-tags-container .tag')).map(tag => tag.textContent.trim())
//         };

//         // Check if we're editing or adding
//         const editingId = document.getElementById('save-new-explanation').getAttribute('data-editing');

//         if (editingId) {
//             // Editing existing explanation
//             const explanations = loadExplanations();
//             const explanationIndex = explanations.findIndex(explanation => explanation.id === editingId);

//             if (explanationIndex !== -1) {
//                 // Preserve the original id, date, and views
//                 const originalData = explanations[explanationIndex];
//                 explanations[explanationIndex] = {
//                     ...originalData,
//                     title: explanationData.title,
//                     relatedLawId: explanationData.relatedLawId,
//                     category: explanationData.category,
//                     status: explanationData.status,
//                     summary: explanationData.summary,
//                     content: explanationData.content,
//                     tags: explanationData.tags
//                 };

//                 saveExplanations(explanations);
//                 document.getElementById('save-new-explanation').removeAttribute('data-editing');
//             }
//         } else {
//             // Adding new explanation
//             addNewExplanation(explanationData);
//         }

//         // Display success message
//         alert('Explanation saved successfully!');

//         // Close the modal
//         closeAddExplanationModal();

//         // Refresh the explanations table if available
//         if (typeof displayExplanations === 'function') {
//             displayExplanations();
//         }
//     } else {
//         // Trigger browser's built-in validation UI
//         form.reportValidity();
//     }
// }

// /**
//  * Explanation Display Functions
//  */
// // Add this function to handle explanation pagination
// function updateExplanationPaginationInfo() {
//     const visibleRows = document.querySelectorAll('.explanations-table tbody tr:not([style*="display: none"])');
//     const paginationInfo = document.querySelector('.explanation-pagination-info');

//     if (paginationInfo) {
//         const totalExplanations = document.querySelectorAll('.explanations-table tbody tr').length;
//         const visibleCount = visibleRows.length;

//         if (visibleCount < totalExplanations) {
//             paginationInfo.innerHTML = `Showing <span>${visibleCount}</span> of <span>${totalExplanations}</span> explanations (filtered)`;
//         } else {
//             paginationInfo.innerHTML = `Showing <span>1-${visibleCount}</span> of <span>${totalExplanations}</span> explanations`;
//         }
//     }
// }
// function displayExplanations() {
//     const explanations = loadExplanations();
//     const tableBody = document.querySelector('.explanations-table tbody');

//     if (tableBody) {
//         // Clear the current table
//         tableBody.innerHTML = '';

//         // Add each explanation to the table
//         explanations.forEach(explanation => {
//             const row = document.createElement('tr');

//             row.innerHTML = `
//                 <td><input type="checkbox" class="explanation-checkbox"></td>
//                 <td>${explanation.id}</td>
//                 <td>${explanation.title}</td>
//                 <td>${explanation.relatedLawId}</td>
//                 <td><span class="category-badge ${explanation.category}">${capitalizeFirstLetter(explanation.category)}</span></td>
//                 <td>${formatDate(explanation.datePublished)}</td>
//                 <td><span class="status-badge ${explanation.status}">${capitalizeFirstLetter(explanation.status)}</span></td>
//                 <td>${explanation.views.toLocaleString()}</td>
//                 <td class="action-buttons">
//                     <button class="btn-icon view-explanation" data-id="${explanation.id}"><i class="fas fa-eye"></i></button>
//                     <button class="btn-icon edit-explanation" data-id="${explanation.id}"><i class="fas fa-edit"></i></button>
//                     <button class="btn-icon delete-explanation" data-id="${explanation.id}"><i class="fas fa-trash"></i></button>
//                 </td>
//             `;

//             tableBody.appendChild(row);
//         });

//         // Re-attach event listeners for the new buttons
//         attachExplanationActionListeners();

//         // Update pagination info if applicable
//         if (typeof updateExplanationPaginationInfo === 'function') {
//             updateExplanationPaginationInfo();
//         }
//     }
// }

// function attachExplanationActionListeners() {
//     // View explanation
//     document.querySelectorAll('.view-explanation').forEach(button => {
//         button.addEventListener('click', function() {
//             const explanationId = this.getAttribute('data-id');
//             viewExplanation(explanationId);
//         });
//     });

//     // Edit explanation
//     document.querySelectorAll('.edit-explanation').forEach(button => {
//         button.addEventListener('click', function() {
//             const explanationId = this.getAttribute('data-id');
//             editExplanation(explanationId);
//         });
//     });

//     // Delete explanation
//     document.querySelectorAll('.delete-explanation').forEach(button => {
//         button.addEventListener('click', function() {
//             const explanationId = this.getAttribute('data-id');
//             deleteExplanation(explanationId);
//         });
//     });
// }

// function viewExplanation(explanationId) {
//     const explanations = loadExplanations();
//     const explanation = explanations.find(explanation => explanation.id === explanationId);

//     if (explanation) {
//         // Increment the view count
//         explanation.views += 1;
//         saveExplanations(explanations);

//         // In a real app, you'd open a detailed view
//         alert(`Viewing explanation: ${explanation.title}`);

//         // After viewing, refresh the display to update view count
//         displayExplanations();
//     }
// }

// function editExplanation(explanationId) {
//     const explanations = loadExplanations();
//     const explanation = explanations.find(explanation => explanation.id === explanationId);

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

//             tag.querySelector('.tag-close').addEventListener('click', function() {
//                 tag.remove();
//             });

//             tagsContainer.appendChild(tag);
//         });

//         // Store the explanation ID for the save function
//         const saveNewExplanationButton = document.getElementById('save-new-explanation');
//         if (saveNewExplanationButton) {
//             saveNewExplanationButton.setAttribute('data-editing', explanationId);
//         }

//         // Open the modal
//         openAddExplanationModal();
//     }
// }

// function deleteExplanation(explanationId) {
//     if (confirm('Are you sure you want to delete this explanation?')) {
//         const explanations = loadExplanations();
//         const updatedExplanations = explanations.filter(explanation => explanation.id !== explanationId);

//         saveExplanations(updatedExplanations);
//         displayExplanations();
//     }
// }

// /**
//  * Explanation Filtering Functions
//  */
// function applyExplanationFilters() {
//     const categoryFilter = document.getElementById('explanation-category-filter');
//     const statusFilter = document.getElementById('explanation-status-filter');
//     const searchInput = document.getElementById('explanation-search');
    
//     if (!categoryFilter || !statusFilter || !searchInput) return;
    
//     const categoryValue = categoryFilter.value.toLowerCase();
//     const statusValue = statusFilter.value.toLowerCase();
//     const searchValue = searchInput.value.toLowerCase();
//     const rows = document.querySelectorAll('.explanations-table tbody tr');

//     rows.forEach(row => {
//         const categoryText = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
//         const statusText = row.querySelector('td:nth-child(7)').textContent.toLowerCase();
//         const explanationTitle = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
//         const explanationId = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
//         const relatedLawId = row.querySelector('td:nth-child(4)').textContent.toLowerCase();

//         const matchesCategory = categoryValue === '' || categoryText.includes(categoryValue);
//         const matchesStatus = statusValue === '' || statusText.includes(statusValue);
//         const matchesSearch = searchValue === '' ||
//             explanationTitle.includes(searchValue) ||
//             explanationId.includes(searchValue) ||
//             relatedLawId.includes(searchValue);

//         if (matchesCategory && matchesStatus && matchesSearch) {
//             row.style.display = '';
//         } else {
//             row.style.display = 'none';
//         }
//     });

//     if (typeof updateExplanationPaginationInfo === 'function') {
//         updateExplanationPaginationInfo();
//     }
// }

// /**
//  * Dashboard Statistics and Reporting
//  */
// function updateDashboardStatistics() {
//     const laws = loadLaws();
//     const explanations = loadExplanations();
    
//     // Update law statistics
//     const totalLaws = laws.length;
//     const activeLaws = laws.filter(law => law.status === 'active').length;
//     const draftLaws = laws.filter(law => law.status === 'draft').length;
    
//     // Update explanation statistics
//     const totalExplanations = explanations.length;
//     const activeExplanations = explanations.filter(exp => exp.status === 'active').length;
//     const draftExplanations = explanations.filter(exp => exp.status === 'draft').length;
    
//     // Update DOM elements
//     const statsElements = {
//         'total-laws': totalLaws,
//         'active-laws': activeLaws,
//         'draft-laws': draftLaws,
//         'total-explanations': totalExplanations,
//         'active-explanations': activeExplanations,
//         'draft-explanations': draftExplanations
//     };
    
//     for (const [id, value] of Object.entries(statsElements)) {
//         const element = document.getElementById(id);
//         if (element) {
//             element.textContent = value;
//         }
//     }
// }

// /**
//  * Document Ready & Application Start
//  */
// // Initialize application when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize UI components
//     initializeUI();
    
//     // Initialize data
//     initializeData();
    
//     // Set up event listeners
//     setupEventListeners();
    
//     // Initial update of dashboard statistics
//     updateDashboardStatistics();
    
//     // Listen for data changes to update statistics
//     document.addEventListener('laws-updated', updateDashboardStatistics);
//     document.addEventListener('explanations-updated', updateDashboardStatistics);
// });
/**
 * Optimized Legal System Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    setCurrentDate();
    setupEventListeners();
    displayLaws();
    setupPagination();
    setupCharts();
}

/**
 * UI & Navigation
 */
function setCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        currentDateElement.textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}

function setupEventListeners() {
    document.getElementById('add-law-btn')?.addEventListener('click', openAddLawModal);
    document.querySelector('.close-modal')?.addEventListener('click', closeAddLawModal);
    document.getElementById('cancel-add-law')?.addEventListener('click', closeAddLawModal);
    document.getElementById('save-new-law')?.addEventListener('click', saveLawHandler);
    
    document.getElementById('category-filter')?.addEventListener('change', applyFilters);
    document.getElementById('status-filter')?.addEventListener('change', applyFilters);
    document.getElementById('law-search')?.addEventListener('input', applyFilters);
}

/**
 * Chart Setup
 */
function setupCharts() {
    const userActivityCtx = document.getElementById('userActivityChart');
    if (userActivityCtx) {
        new Chart(userActivityCtx.getContext('2d'), {
            type: 'line',
            data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [...] },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
}

/**
 * Law Management
 */
function loadLaws() {
    return JSON.parse(localStorage.getItem('legal_system_laws')) || [];
}

function saveLaws(laws) {
    localStorage.setItem('legal_system_laws', JSON.stringify(laws));
    displayLaws();
}

function displayLaws() {
    const laws = loadLaws();
    const tableBody = document.querySelector('.laws-table tbody');
    if (tableBody) {
        tableBody.innerHTML = laws.map(law => `
            <tr>
                <td><input type="checkbox" class="law-checkbox"></td>
                <td>${law.id}</td>
                <td>${law.title}</td>
                <td>${law.category}</td>
                <td>${law.datePublished}</td>
                <td>${law.status}</td>
                <td>${law.views}</td>
                <td>
                    <button class="view-law" data-id="${law.id}">View</button>
                    <button class="edit-law" data-id="${law.id}">Edit</button>
                    <button class="delete-law" data-id="${law.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }
}

function applyFilters() {
    const category = document.getElementById('category-filter').value.toLowerCase();
    const status = document.getElementById('status-filter').value.toLowerCase();
    const search = document.getElementById('law-search').value.toLowerCase();
    
    document.querySelectorAll('.laws-table tbody tr').forEach(row => {
        const categoryMatch = row.cells[3].textContent.toLowerCase().includes(category);
        const statusMatch = row.cells[5].textContent.toLowerCase().includes(status);
        const searchMatch = row.cells[2].textContent.toLowerCase().includes(search);
        row.style.display = (categoryMatch && statusMatch && searchMatch) ? '' : 'none';
    });
}

function saveLawHandler() {
    const newLaw = {
        id: `#LW-${Date.now()}`,
        title: document.getElementById('law-title').value,
        category: document.getElementById('law-category').value,
        status: document.getElementById('law-status').value,
        datePublished: new Date().toISOString().split('T')[0],
        views: 0
    };
    const laws = loadLaws();
    laws.push(newLaw);
    saveLaws(laws);
    closeAddLawModal();
}

function openAddLawModal() {
    document.getElementById('add-law-modal')?.classList.add('active');
}

function closeAddLawModal() {
    document.getElementById('add-law-modal')?.classList.remove('active');
}
