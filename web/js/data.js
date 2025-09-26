document.addEventListener('DOMContentLoaded', function() {
    // Load data collection content
    fetch('text/data-collection.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            const collectionContent = document.getElementById('collection-content');
            collectionContent.innerHTML = formatTextContent(text);
        })
        .catch(error => {
            console.error('Error loading data collection text:', error);
            document.getElementById('collection-content').innerHTML =
                '<p>Error loading data collection information. Please try again later.</p>';
        });

    // Load data pipeline content
    fetch('text/data-pipeline.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            const pipelineContent = document.getElementById('pipeline-content');
            pipelineContent.innerHTML = formatTextContent(text);
        })
        .catch(error => {
            console.error('Error loading data pipeline text:', error);
            document.getElementById('pipeline-content').innerHTML =
                '<p>Error loading data pipeline information. Please try again later.</p>';
        });

    // Load pathogens definition content
    fetch('text/data-pathogen.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            const pathogensContent = document.getElementById('pathogens-content');
            pathogensContent.innerHTML = formatTextContent(text);
        })
        .catch(error => {
            console.error('Error loading pathogens text:', error);
            document.getElementById('pathogens-content').innerHTML =
                '<p>Error loading pathogens definition. Please try again later.</p>';
        });
});

function formatTextContent(text) {
    // Normalize line endings
    const normalizedText = text.replace(/\r\n/g, '\n');

    // Split text into paragraphs
    const paragraphs = normalizedText.split(/\n{2,}/)
        .filter(para => para.trim() !== '')
        .map(para => para.trim());

    // Process each paragraph
    const formattedHtml = paragraphs.map(paragraph => {
        // Check if paragraph is a heading
        if (paragraph.startsWith('## ')) {
            return `<h3>${paragraph.substring(3)}</h3>`;
        } else if (paragraph.startsWith('### ')) {
            return `<h4>${paragraph.substring(4)}</h4>`;
        } else if (paragraph.startsWith('- ')) {
            // Handle bullet points
            const listItems = paragraph.split('\n')
                .filter(line => line.trim().startsWith('- '))
                .map(line => `<li>${line.substring(2).trim()}</li>`)
                .join('');
            return `<ul>${listItems}</ul>`;
        } else if (paragraph.includes('**Output**:') || paragraph.includes('**Performance**:')) {
            // Handle special formatting for pipeline steps
            const processedPara = paragraph.replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            return `<div class="pipeline-step">${processedPara}</div>`;
        } else if (paragraph.includes('Source: ') && paragraph.includes('http')) {
            // Handle source citations with URLs
            const processedPara = paragraph.replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
            return `<div class="pathogen-source">${processedPara}</div>`;
        } else {
            // Handle single line breaks within paragraphs
            const processedPara = paragraph.replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
            return `<p>${processedPara}</p>`;
        }
    }).join('');

    return formattedHtml;
}

