// Store user role preference
let currentRole = localStorage.getItem('userRole') || 'teacher';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set up mobile menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Set up dropdown menus - simplified and fixed
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('button');
        const content = dropdown.querySelector('.dropdown-content');

        // For desktop - pure CSS hover will handle it
        // For mobile/tablet - handle clicks
        button.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) { // Mobile breakpoint
                e.stopPropagation();
                e.preventDefault();

                // Close all other dropdowns
                document.querySelectorAll('.dropdown-content').forEach(otherContent => {
                    if (otherContent !== content) {
                        otherContent.style.display = 'none';
                    }
                });

                // Toggle this dropdown
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'block';
                }
            }
        });
    });

    // Close dropdowns when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.display = '';
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        const dropdownContents = document.querySelectorAll('.dropdown-content');
        dropdownContents.forEach(content => {
            content.classList.add('hidden');
        });
    });

    // Initialize role tabs if they exist on the page
    initializeRoleTabs();

    // Set up copy buttons for prompt templates
    initializeCopyButtons();

    // Load saved role
    if (currentRole) {
        setActiveRole(currentRole);
    }
});

// Function to set role and navigate
function setRoleAndNavigate(role) {
    localStorage.setItem('userRole', role);
    currentRole = role;
    window.location.href = 'by-role.html';
}

// Function to set active role
function setActiveRole(role) {
    currentRole = role;
    localStorage.setItem('userRole', role);

    // Update role tabs if they exist
    const roleTabs = document.querySelectorAll('.role-tab');
    const roleContents = document.querySelectorAll('.role-content');

    roleTabs.forEach(tab => {
        if (tab.getAttribute('data-role') === role) {
            tab.classList.add('active', 'bg-blue-600', 'text-white');
            tab.classList.remove('bg-gray-200', 'text-gray-700');
        } else {
            tab.classList.remove('active', 'bg-blue-600', 'text-white');
            tab.classList.add('bg-gray-200', 'text-gray-700');
        }
    });

    roleContents.forEach(content => {
        if (content.getAttribute('data-role') === role) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
}

// Initialize role tabs
function initializeRoleTabs() {
    const roleTabs = document.querySelectorAll('.role-tab');

    roleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            setActiveRole(role);
        });
    });

    // Set initial active role
    if (currentRole && roleTabs.length > 0) {
        setActiveRole(currentRole);
    }
}

// Copy to clipboard functionality
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent || element.innerText;

    navigator.clipboard.writeText(text).then(function() {
        // Show success message
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('bg-green-600');

        setTimeout(function() {
            button.textContent = originalText;
            button.classList.remove('bg-green-600');
        }, 2000);
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
    });
}

// Initialize copy buttons
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-button');

    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            copyToClipboard(targetId);
        });
    });
}

// Expandable sections functionality
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const icon = document.getElementById(sectionId + '-icon');

    if (section) {
        section.classList.toggle('hidden');
        if (icon) {
            icon.classList.toggle('rotate-90');
        }
    }
}

// Search functionality
function searchContent() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const searchableElements = document.querySelectorAll('.searchable');

    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            element.style.display = 'block';
            element.classList.add('highlight');
        } else {
            element.style.display = 'none';
            element.classList.remove('highlight');
        }
    });

    if (searchTerm === '') {
        searchableElements.forEach(element => {
            element.style.display = 'block';
            element.classList.remove('highlight');
        });
    }
}

// Platform comparison tool
function comparePlatforms() {
    const checkboxes = document.querySelectorAll('.platform-checkbox:checked');
    const selectedPlatforms = Array.from(checkboxes).map(cb => cb.value);

    // Show/hide platform columns based on selection
    const platformColumns = document.querySelectorAll('.platform-column');
    platformColumns.forEach(column => {
        const platform = column.getAttribute('data-platform');
        if (selectedPlatforms.includes(platform)) {
            column.classList.remove('hidden');
        } else {
            column.classList.add('hidden');
        }
    });
}

// Prompt template builder
function buildPrompt() {
    const role = document.getElementById('prompt-role').value;
    const task = document.getElementById('prompt-task').value;
    const context = document.getElementById('prompt-context').value;
    const constraints = document.getElementById('prompt-constraints').value;

    let prompt = `I am a ${role} and need help with ${task}.`;

    if (context) {
        prompt += ` Context: ${context}.`;
    }

    if (constraints) {
        prompt += ` Constraints: ${constraints}.`;
    }

    const output = document.getElementById('prompt-output');
    output.textContent = prompt;
}

// Print specific section
function printSection(sectionId) {
    const section = document.getElementById(sectionId);
    const printWindow = window.open('', '_blank');

    printWindow.document.write('<html lang="en"><head><title>Print</title>');
    printWindow.document.write('<link rel="stylesheet" href="styles.css">');
    printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(section.innerHTML);
    printWindow.document.write('</body></html>');

    printWindow.document.close();

    setTimeout(function() {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Filter content by district size
function filterByDistrictSize(size) {
    const allContent = document.querySelectorAll('.district-content');

    allContent.forEach(content => {
        const contentSize = content.getAttribute('data-district-size');
        if (contentSize === size || contentSize === 'all') {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });

    // Update active button
    const buttons = document.querySelectorAll('.district-size-button');
    buttons.forEach(button => {
        if (button.getAttribute('data-size') === size) {
            button.classList.add('bg-blue-600', 'text-white');
            button.classList.remove('bg-gray-200', 'text-gray-700');
        } else {
            button.classList.remove('bg-blue-600', 'text-white');
            button.classList.add('bg-gray-200', 'text-gray-700');
        }
    });
}

// Save user preferences
function savePreferences() {
    const preferences = {
        role: currentRole,
        districtSize: document.getElementById('district-size')?.value,
        primaryPlatform: document.getElementById('primary-platform')?.value
    };

    localStorage.setItem('userPreferences', JSON.stringify(preferences));

    // Show success message
    const message = document.getElementById('save-success');
    if (message) {
        message.classList.remove('hidden');
        setTimeout(() => {
            message.classList.add('hidden');
        }, 3000);
    }
}

// Load user preferences
function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('userPreferences') || '{}');

    if (preferences.role) {
        setActiveRole(preferences.role);
    }

    if (preferences.districtSize && document.getElementById('district-size')) {
        document.getElementById('district-size').value = preferences.districtSize;
    }

    if (preferences.primaryPlatform && document.getElementById('primary-platform')) {
        document.getElementById('primary-platform').value = preferences.primaryPlatform;
    }
}