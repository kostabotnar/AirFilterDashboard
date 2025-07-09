const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiZDRkMzBlMDktZjc1Ny00YWIxLTk3YTMtNjQxYmJhYzk0YTZhIiwidCI6IjdiZWYyNTZkLTg1ZGItNDUyNi1hNzJkLTMxYWVhMjU0Njg1MiIsImMiOjN9";

// Variable to track if disclaimer has been acknowledged
let disclaimerAcknowledged = false;

    function showDashboard() {
        localStorage.setItem("loggedIn", "true"); // Remember login
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

        // Add a visual indicator that disclaimer has been acknowledged
        if (isAcknowledged) {
            const acknowledgeButton = document.querySelector('.acknowledge-button');
            if (acknowledgeButton) {
                acknowledgeButton.classList.add('acknowledged');
                acknowledgeButton.disabled = true;
                acknowledgeButton.textContent = "Acknowledged";
                acknowledgeButton.style.backgroundColor = "#4CAF50"; // Green color
            }
        }

        const disclaimerText = document.querySelector('.left-panel-content p');
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
            })
            .catch(error => {
                console.error('Error loading disclaimer text:', error);
                disclaimerText.innerHTML = '<p>Error loading disclaimer information. Please try again later.</p>';
            });


        // Rest of your existing DOMContentLoaded code...
        const rightContentContainer = document.querySelector('.right-panel-content p');
        fetch('text/about.txt')
            .then(response => response.text())
            .then(text => {
                rightContentContainer.textContent = text;
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
                        iframe.src = 'disclaimer.html';
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

        // Update the help button click handler to show disclaimer as modal
        document.querySelector('.acknowledge-button').addEventListener('click', function() {
            acknowledgeDisclaimer(true); // Show as modal when clicked from help button
        });
    });

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.toggle('minimized');
        mainContent.classList.toggle('expanded');
    }

// Function to acknowledge disclaimer and enable login button
function acknowledgeDisclaimer() {
    // Store acknowledgment in localStorage
    localStorage.setItem("disclaimerAcknowledged", "true");

    // Enable the login button
    document.getElementById('loginButton').disabled = false;

    // Add a visual indicator that disclaimer has been acknowledged
    const acknowledgeButton = document.querySelector('.acknowledge-button');
    if (acknowledgeButton) {
        acknowledgeButton.classList.add('acknowledged');
        acknowledgeButton.disabled = true;
        acknowledgeButton.textContent = "Accepted";
        acknowledgeButton.style.backgroundColor = "#4CAF50"; // Green color
    }
}