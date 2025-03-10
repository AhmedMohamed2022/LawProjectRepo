// // Modal functionality
// const addLawButton = document.querySelector('.section-header .btn-primary');
// const addLawModal = document.getElementById('add-law-modal');
// const closeModalButton = document.querySelector('.close-modal');
// const cancelAddLawButton = document.getElementById('cancel-add-law');
// const saveNewLawButton = document.getElementById('save-new-law');

// function openAddLawModal() {
//     addLawModal.classList.add('active');
//     document.body.style.overflow = 'hidden';
// }

// function closeAddLawModal() {
//     addLawModal.classList.remove('active');
//     document.body.style.overflow = '';
//     document.getElementById('add-law-form').reset();
//     document.querySelector('.tags-container').innerHTML = '';
//     document.querySelector('.uploaded-files').innerHTML = '';
// }

// addLawButton.addEventListener('click', openAddLawModal);
// closeModalButton.addEventListener('click', closeAddLawModal);
// cancelAddLawButton.addEventListener('click', closeAddLawModal);

// // Handle tags input
// const tagInput = document.getElementById('tag-input');
// const tagsContainer = document.querySelector('.tags-container');

// tagInput.addEventListener('keydown', function (e) {
//     if (e.key === 'Enter' && tagInput.value.trim() !== '') {
//         e.preventDefault();

//         const tag = document.createElement('div');
//         tag.className = 'tag';
//         tag.innerHTML = `
//             ${tagInput.value.trim()}
//             <span class="tag-close"><i class="fas fa-times"></i></span>
//         `;

//         tag.querySelector('.tag-close').addEventListener('click', function () {
//             tag.remove();
//         });

//         tagsContainer.appendChild(tag);
//         tagInput.value = '';
//     }
// });

// // Handle file uploads
// const fileInput = document.getElementById('law-documents');
// const uploadedFiles = document.querySelector('.uploaded-files');

// fileInput.addEventListener('change', function () {
//     uploadedFiles.innerHTML = '';

//     Array.from(fileInput.files).forEach(file => {
//         const fileElement = document.createElement('div');
//         fileElement.className = 'uploaded-file';
//         fileElement.innerHTML = `
//             <span class="file-icon"><i class="fas fa-file"></i></span>
//             ${file.name}
//             <span class="file-remove"><i class="fas fa-times"></i></span>
//         `;

//         fileElement.querySelector('.file-remove').addEventListener('click', function () {
//             fileElement.remove();
//             // Note: This doesn't actually remove the file from the input
//             // In a real implementation, you would need to create a new FileList object
//         });

//         uploadedFiles.appendChild(fileElement);
//     });
// });

// // Save new law functionality
// saveNewLawButton.addEventListener('click', function () {
//     const form = document.getElementById('add-law-form');

//     if (form.checkValidity()) {
//         // Here you would typically collect all form data and send to server
//         // For demonstration, we'll just close the modal
//         alert('Law saved successfully!');
//         closeAddLawModal();
//     } else {
//         // Trigger browser's built-in validation UI
//         form.reportValidity();
//     }
// });

// // Initialize the page
// document.addEventListener('DOMContentLoaded', function () {
//     // Make the section visible when JS is loaded
//     document.getElementById('laws-management').style.display = 'block';

//     // Apply initial filters
//     applyFilters();

//     // Set up pagination
//     setupPagination();
// });