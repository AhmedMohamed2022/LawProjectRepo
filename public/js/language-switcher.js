// // Language switcher functionality
// document.addEventListener('DOMContentLoaded', function () {
//     // Get language selector element
//     const languageSelector = document.querySelector('.language-selector');

//     // Check if there's a saved language preference in localStorage
//     const savedLanguage = localStorage.getItem('preferredLanguage');
//     if (savedLanguage) {
//         languageSelector.value = savedLanguage;
//         redirectToCorrectLanguage(savedLanguage);
//     }

//     // Add event listener for language change
//     languageSelector.addEventListener('change', function () {
//         const selectedLanguage = languageSelector.value;

//         // Save preference to localStorage
//         localStorage.setItem('preferredLanguage', selectedLanguage);

//         // Redirect to the appropriate version
//         redirectToCorrectLanguage(selectedLanguage);
//     });

//     // Function to redirect based on language selection
//     function redirectToCorrectLanguage(language) {
//         // Get current path
//         const currentPath = window.location.pathname;
//         const currentPage = currentPath.split('/').pop();

//         // Check if we're already on the correct language version
//         const isArabicPage = currentPage.includes('-ar.');
//         const isEnglishPage = !isArabicPage;

//         if (language === 'ar' && isEnglishPage) {
//             // Switch English to Arabic
//             const arabicPage = currentPage.replace('.html', '-ar.html');
//             window.location.href = arabicPage;
//         } else if (language === 'en' && isArabicPage) {
//             // Switch Arabic to English
//             const englishPage = currentPage.replace('-ar.html', '.html');
//             window.location.href = englishPage;
//         }
//     }
// });
// Language switcher functionality with improved bidirectional support
document.addEventListener('DOMContentLoaded', function () {
    // Get language selector element
    const languageSelector = document.querySelector('.language-selector');

    if (!languageSelector) {
        console.error('Language selector not found');
        return;
    }

    // Add event listener for language change
    languageSelector.addEventListener('change', function () {
        const selectedLanguage = languageSelector.value;

        // Save preference to localStorage
        localStorage.setItem('preferredLanguage', selectedLanguage);

        // Get current path
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop();

        console.log('Current file name:', fileName);

        // Check if we're on an Arabic page (contains -ar.html)
        const isArabic = fileName.includes('-ar.html');

        if (selectedLanguage === 'ar' && !isArabic) {
            // Switch from English to Arabic
            // Get the path without .html and add -ar.html
            const arabicPage = fileName.replace('.html', '-ar.html');
            window.location.href = arabicPage;
            console.log('Switching to Arabic:', arabicPage);
        }
        else if (selectedLanguage === 'en' && isArabic) {
            // Switch from Arabic to English
            // Remove the -ar part from the filename
            const englishPage = fileName.replace('-ar.html', '.html');
            window.location.href = englishPage;
            console.log('Switching to English:', englishPage);
        }
    });

    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        languageSelector.value = savedLanguage;
    }
    // Add at the top of your language change event handler
    console.log('Language changed to:', selectedLanguage);
    console.log('Current page:', window.location.pathname);
});