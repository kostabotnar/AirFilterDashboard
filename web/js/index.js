const powerBiUrl = "https://app.powerbi.com/view?r=eyJrIjoiZTA3YzM5NzMtMjVkOS00N2UxLTk5ZjctMmQ3N2E3MjQyMzYzIiwidCI6IjdiZWYyNTZkLTg1ZGItNDUyNi1hNzJkLTMxYWVhMjU0Njg1MiIsImMiOjN9";
const pswHash = "66f22348ba8c3cff0ccadfba7b2c7d6bf8f434cba1e28430d2df3f0c79d3941fc90459952dd5273be4a8d05a36966124c159599ace8a2faaaa301bbe9e071745";

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
        const contentContainer = document.querySelector('.right-panel-content p');
        fetch('text/login-description.txt')
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
                        iframe.src = 'disclaimer.html'; // Create this file with disclaimer information
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
    });

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        sidebar.classList.toggle('minimized');
        mainContent.classList.toggle('expanded');
    }