// / Initialize test data if none exists


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