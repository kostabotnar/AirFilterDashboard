
// Load external description into the blocks
window.addEventListener('DOMContentLoaded', () => {
    // nation-view
    fetch('text/nation.txt')
        .then(response => response.text())
        .then(text => {
            const contentContainer = document.querySelector('.nation-description p');
            contentContainer.textContent = text;
        })
        .catch(error => {
            console.error("Failed to load dashboard description:", error);
        });

    // Position the highlight rectangles
    const positionHighlightRectangles = () => {
        const nationwideImage = document.getElementById('nationwide-image');
        const collectionDateFilterRect = document.getElementById('collection-date-filter-highlight');
        const sampleCountRect = document.getElementById('sample-count-highlight');
        const geoDistributionRect = document.getElementById('geo-distribution-highlight');
        const collectionDateRect = document.getElementById('collection-date-highlight');
        const seasonalDistributionRect = document.getElementById('seasonal-distribution-highlight');
        const locationDistributionRect = document.getElementById('location-distribution-highlight');
        const mapHoverTooltip = document.getElementById('map-hover-tooltip'); // Add this line

        // Wait for the image to load to get its dimensions
        if (nationwideImage.complete) {
            updateRectPositions();
        } else {
            nationwideImage.onload = updateRectPositions;
        }

        function updateRectPositions() {
            const imgWidth = nationwideImage.offsetWidth;
            const imgHeight = nationwideImage.offsetHeight;

            // Position the collection date filter rectangle
            collectionDateFilterRect.style.left = '0';
            collectionDateFilterRect.style.top = `${imgHeight * 0.08}px`;
            collectionDateFilterRect.style.width = `${imgWidth * 0.25}px`;
            collectionDateFilterRect.style.height = `${imgHeight * 0.2}px`;

            // Position the sample count rectangle
            sampleCountRect.style.left = '0';
            sampleCountRect.style.top = `${imgHeight * 0.3}px`;
            sampleCountRect.style.width = `${imgWidth * 0.25}px`;
            sampleCountRect.style.height = `${imgHeight * 0.15}px`; // 45% - 30% = 15%

            // Position the geographical distribution rectangle
            geoDistributionRect.style.left = `${imgWidth * 0.25}px`;
            geoDistributionRect.style.top = '0';
            geoDistributionRect.style.width = `${imgWidth * 0.75}px`;
            geoDistributionRect.style.height = `${imgHeight * 0.6}px`;

            // Position the map hover tooltip
            if (mapHoverTooltip) {
                // Position at 50% horizontally and 30% vertically
                const tooltipWidth = mapHoverTooltip.offsetWidth;
                const tooltipHeight = mapHoverTooltip.offsetHeight;

                // Center the tooltip at the 50%, 30% position
                mapHoverTooltip.style.left = `${imgWidth * 0.5 - tooltipWidth / 2}px`;
                mapHoverTooltip.style.top = `${imgHeight * 0.3 - tooltipHeight / 2}px`;
            }

            // Position the collection date rectangle
            collectionDateRect.style.left = '0';
            collectionDateRect.style.top = `${imgHeight * 0.6}px`;
            collectionDateRect.style.width = `${imgWidth * 0.45}px`;
            collectionDateRect.style.height = `${imgHeight * 0.4}px`;

            // Position the seasonal distribution rectangle
            seasonalDistributionRect.style.left = `${imgWidth * 0.45}px`;
            seasonalDistributionRect.style.top = `${imgHeight * 0.6}px`;
            seasonalDistributionRect.style.width = `${imgWidth * 0.25}px`;
            seasonalDistributionRect.style.height = `${imgHeight * 0.4}px`;

            // Position the location distribution rectangle
            locationDistributionRect.style.left = `${imgWidth * 0.7}px`;
            locationDistributionRect.style.top = `${imgHeight * 0.6}px`;
            locationDistributionRect.style.width = `${imgWidth * 0.3}px`;
            locationDistributionRect.style.height = `${imgHeight * 0.4}px`;
        }
    };

    // Call initially
    positionHighlightRectangles();

    // Also call on window resize
    window.addEventListener('resize', positionHighlightRectangles);

    // Filter list single-select functionality
    const filterItems = document.querySelectorAll('.filter-list li');
    const collectionDateFilterRect = document.getElementById('collection-date-filter-highlight');
    const sampleCountRect = document.getElementById('sample-count-highlight');
    const geoDistributionRect = document.getElementById('geo-distribution-highlight');
    const collectionDateRect = document.getElementById('collection-date-highlight');
    const seasonalDistributionRect = document.getElementById('seasonal-distribution-highlight');
    const locationDistributionRect = document.getElementById('location-distribution-highlight');
    const mapHoverTooltip = document.getElementById('map-hover-tooltip'); // Add this line

    // Hide the tooltip initially
    if (mapHoverTooltip) {
        mapHoverTooltip.style.display = 'none';
    }

    // Load the collection date filter description by default
    const selectedItem = document.querySelector('.filter-list li.selected');
    const selectedItemDescription = selectedItem.querySelector('.filter-item-description');

    fetch('text/collection-date-filter.txt')
        .then(response => response.text())
        .then(text => {
            selectedItemDescription.textContent = text;
        })
        .catch(error => {
            console.error("Failed to load collection date filter description:", error);
        });

    filterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selected class from all items
            filterItems.forEach(i => i.classList.remove('selected'));

            // Add selected class to clicked item
            this.classList.add('selected');

            // Hide all rectangles first
            collectionDateFilterRect.style.display = 'none';
            sampleCountRect.style.display = 'none';
            geoDistributionRect.style.display = 'none';
            collectionDateRect.style.display = 'none';
            seasonalDistributionRect.style.display = 'none';
            locationDistributionRect.style.display = 'none';

            // Hide the tooltip by default
            if (mapHoverTooltip) {
                mapHoverTooltip.style.display = 'none';
            }

            // Show the appropriate rectangle based on selection
            const option = this.dataset.option;
            const itemDescription = this.querySelector('.filter-item-description');

            if (option === 'collection-date-filter') {
                collectionDateFilterRect.style.display = 'block';
                // Load the collection date filter description
                fetch('text/collection-date-filter.txt')
                    .then(response => response.text())
                    .then(text => {
                        itemDescription.textContent = text;
                    })
                    .catch(error => {
                        console.error("Failed to load collection date filter description:", error);
                    });
            } else if (option === 'sample-count') {
                sampleCountRect.style.display = 'block';
                fetch('text/sample-count.txt')
                    .then(response => response.text())
                    .then(text => {
                        itemDescription.textContent = text;
                    })
                    .catch(error => {
                        console.error("Failed to load sample count description:", error);
                    });
            } else if (option === 'geo-distribution') {
                geoDistributionRect.style.display = 'block';
                // Show the map hover tooltip
                if (mapHoverTooltip) {
                    mapHoverTooltip.style.display = 'block';
                }
                fetch('text/geo-distribution.txt')
                    .then(response => response.text())
                    .then(text => {
                        itemDescription.textContent = text;
                    })
                    .catch(error => {
                        console.error("Failed to load geo distribution description:", error);
                    });
            } else if (option === 'collection-date') {
                collectionDateRect.style.display = 'block';
                fetch('text/collection-date.txt')
                    .then(response => response.text())
                    .then(text => {
                        itemDescription.textContent = text;
                    })
                    .catch(error => {
                        console.error("Failed to load collection date map description:", error);
                    });
            } else if (option === 'seasonal-distribution') {
                seasonalDistributionRect.style.display = 'block';
                fetch('text/seasonal-distribution.txt')
                    .then(response => response.text())
                    .then(text => {
                        itemDescription.textContent = text;
                    })
                    .catch(error => {
                        console.error("Failed to load seasonal distribution description:", error);
                    });
            } else if (option === 'location-distribution') {
                locationDistributionRect.style.display = 'block';
                fetch('text/location-distribution.txt')
                    .then(response => response.text())
                    .then(text => {
                        itemDescription.textContent = text;
                    })
                    .catch(error => {
                        console.error("Failed to load location distribution description:", error);
                    });
            }
        });
    });

    // region
    fetch('text/region.txt')
        .then(response => response.text())
        .then(text => {
            const contentContainer = document.querySelector('.region-description p');
            contentContainer.textContent = text;
        })
        .catch(error => {
            console.error("Failed to load dashboard description:", error);
        });
    // species
    fetch('text/sample.txt')
        .then(response => response.text())
        .then(text => {
            const contentContainer = document.querySelector('.sample-description p');
            contentContainer.textContent = text;
        })
        .catch(error => {
            console.error("Failed to load dashboard description:", error);
        });
    // taxo tree
    fetch('text/taxo_tree.txt')
        .then(response => response.text())
        .then(text => {
            const contentContainer = document.querySelector('.taxo-description p');
            contentContainer.textContent = text;
        })
        .catch(error => {
            console.error("Failed to load dashboard description:", error);
        });
    // species
    fetch('text/species.txt')
        .then(response => response.text())
        .then(text => {
            const contentContainer = document.querySelector('.species-description p');
            contentContainer.textContent = text;
        })
        .catch(error => {
            console.error("Failed to load dashboard description:", error);
        });

    // Initialize highlight rectangle
    updateHighlight('collection-date-filter');
});

// Function to update the highlight rectangle
function updateHighlight(option) {
    const image = document.getElementById('nationwide-image');
    const collectionDateFilterRect = document.getElementById('collection-date-filter-highlight');
    const sampleCountRect = document.getElementById('sample-count-highlight');
    const geoDistributionRect = document.getElementById('geo-distribution-highlight');
    const collectionDateRect = document.getElementById('collection-date-highlight');
    const seasonalDistributionRect = document.getElementById('seasonal-distribution-highlight');
    const locationDistributionRect = document.getElementById('location-distribution-highlight');
    const mapHoverTooltip = document.getElementById('map-hover-tooltip'); // Add this line

    if (!image || !collectionDateFilterRect || !sampleCountRect || !geoDistributionRect ||
        !collectionDateRect || !seasonalDistributionRect || !locationDistributionRect) return;

    const rect = image.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Hide all rectangles first
    collectionDateFilterRect.style.display = 'none';
    sampleCountRect.style.display = 'none';
    geoDistributionRect.style.display = 'none';
    collectionDateRect.style.display = 'none';
    seasonalDistributionRect.style.display = 'none';
    locationDistributionRect.style.display = 'none';

    // Hide the tooltip by default
    if (mapHoverTooltip) {
        mapHoverTooltip.style.display = 'none';
    }

    switch (option) {
        case 'collection-date-filter':
            collectionDateFilterRect.style.left = '0';
            collectionDateFilterRect.style.top = `${height * 0.08}px`;
            collectionDateFilterRect.style.width = `${width * 0.25}px`;
            collectionDateFilterRect.style.height = `${height * 0.2}px`;
            collectionDateFilterRect.style.display = 'block';
            break;
        case 'sample-count':
            sampleCountRect.style.left = '0';
            sampleCountRect.style.top = `${height * 0.3}px`;
            sampleCountRect.style.width = `${width * 0.25}px`;
            sampleCountRect.style.height = `${height * 0.15}px`;
            sampleCountRect.style.display = 'block';
            break;
        case 'geo-distribution':
            geoDistributionRect.style.left = `${width * 0.25}px`;
            geoDistributionRect.style.top = '0';
            geoDistributionRect.style.width = `${width * 0.75}px`;
            geoDistributionRect.style.height = `${height * 0.6}px`;
            geoDistributionRect.style.display = 'block';
            // Show the map hover tooltip
            if (mapHoverTooltip) {
                mapHoverTooltip.style.display = 'block';
            }
            break;
        case 'collection-date':
            collectionDateRect.style.left = '0';
            collectionDateRect.style.top = `${height * 0.6}px`;
            collectionDateRect.style.width = `${width * 0.45}px`;
            collectionDateRect.style.height = `${height * 0.4}px`;
            collectionDateRect.style.display = 'block';
            break;
        case 'seasonal-distribution':
            seasonalDistributionRect.style.left = `${width * 0.45}px`;
            seasonalDistributionRect.style.top = `${height * 0.6}px`;
            seasonalDistributionRect.style.width = `${width * 0.25}px`;
            seasonalDistributionRect.style.height = `${height * 0.4}px`;
            seasonalDistributionRect.style.display = 'block';
            break;
        case 'location-distribution':
            locationDistributionRect.style.left = `${width * 0.7}px`;
            locationDistributionRect.style.top = `${height * 0.6}px`;
            locationDistributionRect.style.width = `${width * 0.3}px`;
            locationDistributionRect.style.height = `${height * 0.4}px`;
            locationDistributionRect.style.display = 'block';
            break;
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('.toc-list a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        window.scrollTo({
            top: targetElement.offsetTop - 20, // Subtract some pixels to account for padding
            behavior: 'smooth'
        });
    });
});
