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