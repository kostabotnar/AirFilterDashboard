
// Load the disclaimer text from the file
window.addEventListener('DOMContentLoaded', () => {
    const disclaimerContent = document.getElementById('disclaimer-content');
    // Add a visual indicator that disclaimer has been acknowledged
    const isAcknowledged = localStorage.getItem("disclaimerAcknowledged") === "true";
    const acknowledgeButton = document.querySelector('.acknowledge-button');
    if (acknowledgeButton) {
        if (isAcknowledged) {
            if (acknowledgeButton) {
                acknowledgeButton.classList.add('acknowledged');
                acknowledgeButton.disabled = true;
                acknowledgeButton.textContent = "Acknowledged";
                acknowledgeButton.style.backgroundColor = "#4CAF50"; // Green color
            }
        }
        else {
            acknowledgeButton.addEventListener('click', () => {
                localStorage.setItem("disclaimerAcknowledged", "true");
                acknowledgeButton.classList.add('acknowledged');
                acknowledgeButton.disabled = true;
                acknowledgeButton.textContent = "Acknowledged";
                acknowledgeButton.style.backgroundColor = "#4CAF50"; // Green color
            });
        }
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

            // Split text into paragraphs - handle different paragraph separators
            // This will split on empty lines (one or more newlines)
            const paragraphs = normalizedText.split(/\n{2,}/)
                .filter(para => para.trim() !== '') // Remove empty paragraphs
                .map(para => para.trim());

            // Process each paragraph
            const formattedHtml = paragraphs.map(paragraph => {
                // Check if paragraph is a heading (starts with # or ##)
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

            disclaimerContent.innerHTML = formattedHtml;
        })
        .catch(error => {
            console.error('Error loading disclaimer text:', error);
            disclaimerContent.innerHTML = '<p>Error loading disclaimer information. Please try again later.</p>';
        });
});
