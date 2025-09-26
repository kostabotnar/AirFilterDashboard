/**
 * Cache busting script for AirFilterDashboard
 * Automatically clears cache when a new version is deployed
 */

(function() {
    // Change this version number whenever you deploy a new version
    const APP_VERSION = '2.4.4';

    // Make APP_VERSION globally accessible
    window.APP_VERSION = APP_VERSION;

    // Check if stored version is different from current version
    const storedVersion = localStorage.getItem('appVersion');

    // If version has changed or doesn't exist, clear cache and update stored version
    if (storedVersion !== APP_VERSION) {
        console.log(`Version changed from ${storedVersion || 'none'} to ${APP_VERSION}. Clearing cache...`);

        // Clear localStorage except for login status
        const loginStatus = localStorage.getItem('loggedIn');
        const disclaimerStatus = localStorage.getItem('disclaimerAcknowledged');

        localStorage.clear();

        // Restore login status if it existed
        if (loginStatus) {
            localStorage.setItem('loggedIn', loginStatus);
        }

        // Restore disclaimer acknowledgment if it existed
        if (disclaimerStatus) {
            localStorage.setItem('disclaimerAcknowledged', disclaimerStatus);
        }

        // Store new version
        localStorage.setItem('appVersion', APP_VERSION);

        // Clear browser cache for this site
        if ('caches' in window) {
            caches.keys().then(function(names) {
                for (let name of names) {
                    caches.delete(name);
                }
            });
        }

        // Force reload the page to get fresh content
        // Use setTimeout to ensure localStorage changes are saved before reload
        setTimeout(() => {
            window.location.reload(true);
        }, 100);
    }

    // Update the sidebar subtitle with the current app version
    document.addEventListener('DOMContentLoaded', function() {
        const sidebarSubtitle = document.querySelector('.sidebar-subtitle');
        if (sidebarSubtitle) {
            sidebarSubtitle.textContent += ` v.${APP_VERSION}`;
        }
    });
})();
