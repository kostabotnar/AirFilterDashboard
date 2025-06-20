<!-- Load the about text from the file -->
window.addEventListener('DOMContentLoaded', () => {
    const aboutContent = document.getElementById('about-content');

    fetch('text/about.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            // Simply wrap the entire text in a paragraph tag
            aboutContent.innerHTML = `<p>${text}</p>`;
        })
        .catch(error => {
            console.error('Error loading about text:', error);
            aboutContent.innerHTML = '<p>Error loading about information. Please try again later.</p>';
        });
});