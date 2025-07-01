const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiZDRkMzBlMDktZjc1Ny00YWIxLTk3YTMtNjQxYmJhYzk0YTZhIiwidCI6IjdiZWYyNTZkLTg1ZGItNDUyNi1hNzJkLTMxYWVhMjU0Njg1MiIsImMiOjN9";
const pswHash = "66f22348ba8c3cff0ccadfba7b2c7d6bf8f434cba1e28430d2df3f0c79d3941fc90459952dd5273be4a8d05a36966124c159599ace8a2faaaa301bbe9e071745";

// Variable to track if disclaimer has been acknowledged
let disclaimerAcknowledged = false;

function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('toggleIcon');
        const isPassword = passwordInput.getAttribute('type') === 'password';
        passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
        toggleIcon.src = isPassword ? 'image/show_psw.jpg' : 'image/hide_psw.jpg';
}

    async function checkPassword() {
        const password = document.getElementById('password').value;
        const msgEl = document.getElementById('errorMsg');
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashHex !== pswHash) {
            msgEl.innerHTML = 'Incorrect password. Please try again.<br><a href="#" onclick="openContactPage(); return false;" style="display: block; text-align: center;">Contact support</a>';
        } else {
            localStorage.setItem("loggedIn", "true"); // Remember login
            showDashboard();
        }
    }

    function openContactPage() {
        // Store the reason in localStorage to be retrieved by contact.html
        localStorage.setItem("contactReason", "Forgot password");

        // Open contact page in a new window/tab
        window.open('contact.html', '_blank');
    }

    function showDashboard() {
        document.getElementById('mainContainer').style.display = 'none';
        const iframeContainer = document.getElementById('iframeContainer');
        iframeContainer.style.display = 'flex';
        iframeContainer.querySelector('iframe').src = powerBiUrl;

        // Show sidebar when user is logged in
        document.getElementById('sidebar').style.display = 'flex';

        // Ensure Dashboard menu item is active
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const menuText = item.querySelector('.nav-text').textContent;
            if (menuText === 'Dashboard') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // On page load, check if user is already logged in
    window.addEventListener('DOMContentLoaded', () => {
        // Check localStorage for saved acknowledgment
        const isAcknowledged = localStorage.getItem("disclaimerAcknowledged") === "true";

        // Enable or disable login button based on acknowledgment status
        document.getElementById('loginButton').disabled = !isAcknowledged;

        // If acknowledged, add the visual indicator class
        if (isAcknowledged) {
            document.querySelector('.help-button').classList.add('acknowledged');
        }

        // Rest of your existing DOMContentLoaded code...
        const contentContainer = document.querySelector('.right-panel-content p');
        fetch('text/about.txt')
            .then(response => response.text())
            .then(text => {
                contentContainer.textContent = text;
            })
            .catch(error => {
                console.error("Failed to load dashboard description:", error);
            });

        // Hide sidebar by default
        document.getElementById('sidebar').style.display = 'none';

        if (localStorage.getItem("loggedIn") === "true") {
            showDashboard();
        }

        // Setup sidebar toggle functionality
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const iframe = mainContent.querySelector('iframe');

        // Add double-click event to toggle sidebar
        sidebar.addEventListener('dblclick', function() {
            sidebar.classList.toggle('minimized');
            mainContent.classList.toggle('expanded');
        });

        // Setup navigation item click events
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const menuText = this.querySelector('.nav-text').textContent;

                // Handle different menu items
                switch(menuText) {
                    case 'Dashboard':
                        e.preventDefault();
                        iframe.src = powerBiUrl; // Load the Power BI dashboard
                        break;
                    case 'Tutorial':
                        e.preventDefault();
                        iframe.src = 'guide.html'; // Assuming guide.html contains tutorial content
                        break;
                    case 'About':
                        e.preventDefault();
                        iframe.src = 'about.html'; // Create this file with about information
                        break;
                    case 'Disclaimer':
                        e.preventDefault();
                        // Show disclaimer as a regular page when accessed from sidebar
                        showDisclaimer(false);
                        break;
                    case 'Contact':
                        e.preventDefault();
                        iframe.src = 'contact.html'; // Load the contact form page
                        break;
                    case 'Logout':
                        e.preventDefault();
                        localStorage.removeItem("loggedIn");
                        // Hide sidebar when user logs out
                        document.getElementById('sidebar').style.display = 'none';
                        window.location.reload();
                        return;
                    default:
                        e.preventDefault();
                        break;
                }

                // Remove active class from all items
                navItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                this.classList.add('active');
            });
        });

        // If we want to persist the acknowledgment across sessions, we could use localStorage
        // For now, the button will be disabled on each page load until disclaimer is acknowledged

        // Update the help button click handler to show disclaimer as modal
        document.querySelector('.help-button').addEventListener('click', function() {
            showDisclaimer(true); // Show as modal when clicked from help button
        });
    });

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.toggle('minimized');
        mainContent.classList.toggle('expanded');
    }

// Function to show the disclaimer modal or page based on source
function showDisclaimer(asModal = true) {
    if (asModal) {
        // Show as modal
        const modal = document.getElementById('disclaimerModal');
        modal.style.display = 'block';

        // Load the disclaimer content
        const disclaimerText = document.getElementById('disclaimerText');

        // Check if disclaimer has been acknowledged
        const isAcknowledged = localStorage.getItem("disclaimerAcknowledged") === "true";

        // Find the acknowledge button - use a more specific selector if needed
        const acknowledgeButton = document.querySelector('#disclaimerModal button[onclick*="acknowledgeDisclaimer"]');

        // Update the acknowledge button if already acknowledged and if found
        if (isAcknowledged && acknowledgeButton) {
            acknowledgeButton.disabled = true;
            acknowledgeButton.textContent = "Accepted";
            acknowledgeButton.style.backgroundColor = "#4CAF50"; // Green color
        }

        fetch('text/disclaimer.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                // Normalize line endings
                const normalizedText = text.replace(/\r\n/g, '\n');

                // Split text into paragraphs
                const paragraphs = normalizedText.split(/\n{2,}/)
                    .filter(para => para.trim() !== '')
                    .map(para => para.trim());

                // Process each paragraph
                const formattedHtml = paragraphs.map(paragraph => {
                    // Check if paragraph is a heading
                    if (paragraph.startsWith('# ')) {
                        return `<h2>${paragraph.substring(2)}</h2>`;
                    } else if (paragraph.startsWith('## ')) {
                        return `<h3>${paragraph.substring(3)}</h3>`;
                    } else {
                        // Handle single line breaks within paragraphs
                        const processedPara = paragraph.replace(/\n/g, '<br>');
                        return `<p>${processedPara}</p>`;
                    }
                }).join('');

                disclaimerText.innerHTML = formattedHtml;

                // Try again after content is loaded, in case the button wasn't available earlier
                setTimeout(() => {
                    const acknowledgeButton = document.querySelector('#disclaimerModal button[onclick*="acknowledgeDisclaimer"]');
                    if (isAcknowledged && acknowledgeButton) {
                        acknowledgeButton.disabled = true;
                        acknowledgeButton.textContent = "Acknowledged";
                        acknowledgeButton.style.backgroundColor = "#4CAF50"; // Green color
                    }
                }, 100);
            })
            .catch(error => {
                console.error('Error loading disclaimer text:', error);
                disclaimerText.innerHTML = '<p>Error loading disclaimer information. Please try again later.</p>';
            });
    } else {
        // Show as regular page in iframe
        const iframe = document.querySelector('#mainContent iframe');
        if (iframe) {
            iframe.src = 'disclaimer.html';
        }
    }
}

// Function to acknowledge disclaimer and enable login button
function acknowledgeDisclaimer() {
    // Store acknowledgment in localStorage
    localStorage.setItem("disclaimerAcknowledged", "true");

    // Find the acknowledge button - use a more specific selector if needed
    const acknowledgeButton = document.querySelector('#disclaimerModal button[onclick*="acknowledgeDisclaimer"]');

    // Update the acknowledge button if found
    if (acknowledgeButton) {
        acknowledgeButton.disabled = true;
        acknowledgeButton.textContent = "Accepted";
        acknowledgeButton.style.backgroundColor = "#4CAF50"; // Green color
    }

    // Enable the login button
    document.getElementById('loginButton').disabled = false;

    // Optional: Add a visual indicator that disclaimer has been acknowledged
    const helpButton = document.querySelector('.help-button');
    if (helpButton) {
        helpButton.classList.add('acknowledged');
    }

    // Don't close the modal immediately so user can see the button change
    setTimeout(closeDisclaimer, 1000);
}

// Function to close the disclaimer modal
function closeDisclaimer() {
    const modal = document.getElementById('disclaimerModal');
    modal.style.display = 'none';
}

// Close the modal if the user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('disclaimerModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}