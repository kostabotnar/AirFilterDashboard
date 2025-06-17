
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
        const mapHoverTooltip = document.getElementById('map-hover-tooltip');

        // Region elements
        const regionImage = document.getElementById('region-image');
        const regionCollectionDateFilterRect = document.getElementById('region-collection-date-filter-highlight');
        const regionSampleCountRect = document.getElementById('region-sample-count-highlight');
        const regionNameRect = document.getElementById('region-name-highlight');
        const regionSpeciesPathogenRect = document.getElementById('region-species-pathogen-highlight');
        const regionMetadataDistributionRect = document.getElementById('region-metadata-distribution-highlight');
        const regionTopSpeciesRect = document.getElementById('region-top-species-highlight');
        const regionSamplesTableRect = document.getElementById('region-samples-table-highlight');
        const regionSpeciesTableRect = document.getElementById('region-species-table-highlight');

        // Wait for the nationwide image to load to get its dimensions
        if (nationwideImage.complete) {
            updateNationwideRectPositions();
        } else {
            nationwideImage.onload = updateNationwideRectPositions;
        }

        // Wait for the region image to load to get its dimensions
        if (regionImage.complete) {
            updateRegionRectPositions();
        } else {
            regionImage.onload = updateRegionRectPositions;
        }

        function updateNationwideRectPositions() {
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

        function updateRegionRectPositions() {
            const imgWidth = regionImage.offsetWidth;
            const imgHeight = regionImage.offsetHeight;

            // Position the region collection date filter rectangle
            regionCollectionDateFilterRect.style.left = '0';
            regionCollectionDateFilterRect.style.top = `${imgHeight * 0.08}px`;
            regionCollectionDateFilterRect.style.width = `${imgWidth * 0.25}px`;
            regionCollectionDateFilterRect.style.height = `${imgHeight * 0.2}px`;

            // Position the region sample count rectangle
            regionSampleCountRect.style.left = '0';
            regionSampleCountRect.style.top = `${imgHeight * 0.3}px`;
            regionSampleCountRect.style.width = `${imgWidth * 0.25}px`;
            regionSampleCountRect.style.height = `${imgHeight * 0.15}px`;

            // Position the region name rectangle
            regionNameRect.style.left = `${imgWidth * 0.2}px`;
            regionNameRect.style.top = `${imgHeight * 0.2}px`;
            regionNameRect.style.width = `${imgWidth * 0.2}px`;
            regionNameRect.style.height = `${imgHeight * 0.2}px`;

            // Position the region species pathogen rectangle
            regionSpeciesPathogenRect.style.left = `${imgWidth * 0.2}px`;
            regionSpeciesPathogenRect.style.top = `${imgHeight * 0.2}px`;
            regionSpeciesPathogenRect.style.width = `${imgWidth * 0.2}px`;
            regionSpeciesPathogenRect.style.height = `${imgHeight * 0.2}px`;

            // Position the region metadata distribution rectangle
            regionMetadataDistributionRect.style.left = `${imgWidth * 0.2}px`;
            regionMetadataDistributionRect.style.top = `${imgHeight * 0.2}px`;
            regionMetadataDistributionRect.style.width = `${imgWidth * 0.2}px`;
            regionMetadataDistributionRect.style.height = `${imgHeight * 0.2}px`;

            // Position the region top species rectangle
            regionTopSpeciesRect.style.left = `${imgWidth * 0.2}px`;
            regionTopSpeciesRect.style.top = `${imgHeight * 0.2}px`;
            regionTopSpeciesRect.style.width = `${imgWidth * 0.2}px`;
            regionTopSpeciesRect.style.height = `${imgHeight * 0.2}px`;

            // Position the region samples table rectangle
            regionSamplesTableRect.style.left = `${imgWidth * 0.2}px`;
            regionSamplesTableRect.style.top = `${imgHeight * 0.2}px`;
            regionSamplesTableRect.style.width = `${imgWidth * 0.2}px`;
            regionSamplesTableRect.style.height = `${imgHeight * 0.2}px`;

            // Position the region species table rectangle
            regionSpeciesTableRect.style.left = `${imgWidth * 0.2}px`;
            regionSpeciesTableRect.style.top = `${imgHeight * 0.2}px`;
            regionSpeciesTableRect.style.width = `${imgWidth * 0.2}px`;
            regionSpeciesTableRect.style.height = `${imgHeight * 0.2}px`;
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
    const mapHoverTooltip = document.getElementById('map-hover-tooltip');

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

            // Update the highlight rectangle
            updateHighlight(option);
        });
    });

    // Add region filter list functionality
    const regionFilterItems = document.querySelectorAll('#region .filter-list li');
    const regionCollectionDateFilterRect = document.getElementById('region-collection-date-filter-highlight');
    const regionSampleCountRect = document.getElementById('region-sample-count-highlight');
    const regionNameRect = document.getElementById('region-name-highlight');
    const regionSpeciesPathogenRect = document.getElementById('region-species-pathogen-highlight');
    const regionMetadataDistributionRect = document.getElementById('region-metadata-distribution-highlight');
    const regionTopSpeciesRect = document.getElementById('region-top-species-highlight');
    const regionSamplesTableRect = document.getElementById('region-samples-table-highlight');
    const regionSpeciesTableRect = document.getElementById('region-species-table-highlight');

    // Hide all region rectangles initially
    if (regionCollectionDateFilterRect) regionCollectionDateFilterRect.style.display = 'none';
    if (regionSampleCountRect) regionSampleCountRect.style.display = 'none';
    if (regionNameRect) regionNameRect.style.display = 'none';
    if (regionSpeciesPathogenRect) regionSpeciesPathogenRect.style.display = 'none';
    if (regionMetadataDistributionRect) regionMetadataDistributionRect.style.display = 'none';
    if (regionTopSpeciesRect) regionTopSpeciesRect.style.display = 'none';
    if (regionSamplesTableRect) regionSamplesTableRect.style.display = 'none';
    if (regionSpeciesTableRect) regionSpeciesTableRect.style.display = 'none';

    // Load the region collection date filter description by default for the selected item
    const selectedRegionItem = document.querySelector('#region .filter-list li.selected');
    if (selectedRegionItem) {
        const selectedRegionItemDescription = selectedRegionItem.querySelector('.filter-item-description');

        fetch('text/collection-date-filter.txt')
            .then(response => response.text())
            .then(text => {
                if (selectedRegionItemDescription) {
                    selectedRegionItemDescription.textContent = text;
                }
            })
            .catch(error => {
                console.error("Failed to load region collection date filter description:", error);
            });
    }

    regionFilterItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selected class from all region items
            regionFilterItems.forEach(i => i.classList.remove('selected'));

            // Add selected class to clicked item
            this.classList.add('selected');

            // Hide all region rectangles first
            if (regionCollectionDateFilterRect) regionCollectionDateFilterRect.style.display = 'none';
            if (regionSampleCountRect) regionSampleCountRect.style.display = 'none';
            if (regionNameRect) regionNameRect.style.display = 'none';
            if (regionSpeciesPathogenRect) regionSpeciesPathogenRect.style.display = 'none';
            if (regionMetadataDistributionRect) regionMetadataDistributionRect.style.display = 'none';
            if (regionTopSpeciesRect) regionTopSpeciesRect.style.display = 'none';
            if (regionSamplesTableRect) regionSamplesTableRect.style.display = 'none';
            if (regionSpeciesTableRect) regionSpeciesTableRect.style.display = 'none';

            // Show the appropriate rectangle based on selection
            const option = this.dataset.option;
            const itemDescription = this.querySelector('.filter-item-description');

            switch(option) {
                case 'region-collection-date-filter':
                    if (regionCollectionDateFilterRect) regionCollectionDateFilterRect.style.display = 'block';
                    // Load the region collection date filter description
                    fetch('text/region-collection-date-filter.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region collection date filter description:", error);
                        });
                    break;
                case 'region-sample-count':
                    if (regionSampleCountRect) regionSampleCountRect.style.display = 'block';
                    fetch('text/region-sample-count.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region sample count description:", error);
                        });
                    break;
                case 'region-name':
                    if (regionNameRect) regionNameRect.style.display = 'block';
                    fetch('text/region-name.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region name description:", error);
                        });
                    break;
                case 'region-species-pathogen':
                    if (regionSpeciesPathogenRect) regionSpeciesPathogenRect.style.display = 'block';
                    fetch('text/region-species-pathogen.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region species pathogen description:", error);
                        });
                    break;
                case 'region-metadata-distribution':
                    if (regionMetadataDistributionRect) regionMetadataDistributionRect.style.display = 'block';
                    fetch('text/region-metadata-distribution.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region metadata distribution description:", error);
                        });
                    break;
                case 'region-top-species':
                    if (regionTopSpeciesRect) regionTopSpeciesRect.style.display = 'block';
                    fetch('text/region-top-species.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region top species description:", error);
                        });
                    break;
                case 'region-samples-table':
                    if (regionSamplesTableRect) regionSamplesTableRect.style.display = 'block';
                    fetch('text/region-samples-table.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region samples table description:", error);
                        });
                    break;
                case 'region-species-table':
                    if (regionSpeciesTableRect) regionSpeciesTableRect.style.display = 'block';
                    fetch('text/region-species-table.txt')
                        .then(response => response.text())
                        .then(text => {
                            if (itemDescription) itemDescription.textContent = text;
                        })
                        .catch(error => {
                            console.error("Failed to load region species table description:", error);
                        });
                    break;
            }

            // Update the highlight rectangle
            updateHighlight(option);
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
    const mapHoverTooltip = document.getElementById('map-hover-tooltip');

    // Region elements
    const regionImage = document.getElementById('region-image');
    const regionCollectionDateFilterRect = document.getElementById('region-collection-date-filter-highlight');
    const regionSampleCountRect = document.getElementById('region-sample-count-highlight');
    const regionNameRect = document.getElementById('region-name-highlight');
    const regionSpeciesPathogenRect = document.getElementById('region-species-pathogen-highlight');
    const regionMetadataDistributionRect = document.getElementById('region-metadata-distribution-highlight');
    const regionTopSpeciesRect = document.getElementById('region-top-species-highlight');
    const regionSamplesTableRect = document.getElementById('region-samples-table-highlight');
    const regionSpeciesTableRect = document.getElementById('region-species-table-highlight');

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

    // Hide region rectangles
    if (regionCollectionDateFilterRect) regionCollectionDateFilterRect.style.display = 'none';
    if (regionSampleCountRect) regionSampleCountRect.style.display = 'none';
    if (regionNameRect) regionNameRect.style.display = 'none';
    if (regionSpeciesPathogenRect) regionSpeciesPathogenRect.style.display = 'none';
    if (regionMetadataDistributionRect) regionMetadataDistributionRect.style.display = 'none';
    if (regionTopSpeciesRect) regionTopSpeciesRect.style.display = 'none';
    if (regionSamplesTableRect) regionSamplesTableRect.style.display = 'none';
    if (regionSpeciesTableRect) regionSpeciesTableRect.style.display = 'none';

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
        // Region options
        case 'region-collection-date-filter':
            if (regionCollectionDateFilterRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionCollectionDateFilterRect.style.left = `${regionWidth * 0}px`;
                regionCollectionDateFilterRect.style.top = `${regionHeight * 0.05}px`;
                regionCollectionDateFilterRect.style.width = `${regionWidth * 0.3}px`;
                regionCollectionDateFilterRect.style.height = `${regionHeight * 0.2}px`;
                regionCollectionDateFilterRect.style.display = 'block';
            }
            break;
        case 'region-sample-count':
            if (regionSampleCountRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionSampleCountRect.style.left = `${regionWidth * 0}px`;
                regionSampleCountRect.style.top = `${regionHeight * 0.31}px`;
                regionSampleCountRect.style.width = `${regionWidth * 0.3}px`;
                regionSampleCountRect.style.height = `${regionHeight * 0.16}px`;
                regionSampleCountRect.style.display = 'block';
            }
            break;
        case 'region-name':
            if (regionNameRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionNameRect.style.left = `${regionWidth * 0}px`;
                regionNameRect.style.top = `${regionHeight * 0.25}px`;
                regionNameRect.style.width = `${regionWidth * 0.3}px`;
                regionNameRect.style.height = `${regionHeight * 0.08}px`;
                regionNameRect.style.display = 'block';
            }
            break;
        case 'region-species-pathogen':
            if (regionSpeciesPathogenRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionSpeciesPathogenRect.style.left = `${regionWidth * 0}px`;
                regionSpeciesPathogenRect.style.top = `${regionHeight * 0.47}px`;
                regionSpeciesPathogenRect.style.width = `${regionWidth * 0.3}px`;
                regionSpeciesPathogenRect.style.height = `${regionHeight * 0.15}px`;
                regionSpeciesPathogenRect.style.display = 'block';
            }
            break;
        case 'region-metadata-distribution':
            if (regionMetadataDistributionRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionMetadataDistributionRect.style.left = `${regionWidth * 0.3}px`;
                regionMetadataDistributionRect.style.top = `${regionHeight * 0.06}px`;
                regionMetadataDistributionRect.style.width = `${regionWidth * 0.23}px`;
                regionMetadataDistributionRect.style.height = `${regionHeight * 0.55}px`;
                regionMetadataDistributionRect.style.display = 'block';
            }
            break;
        case 'region-top-species':
            if (regionTopSpeciesRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionTopSpeciesRect.style.left = `${regionWidth * 0.55}px`;
                regionTopSpeciesRect.style.top = `${regionHeight * 0.06}px`;
                regionTopSpeciesRect.style.width = `${regionWidth * 0.25}px`;
                regionTopSpeciesRect.style.height = `${regionHeight * 0.55}px`;
                regionTopSpeciesRect.style.display = 'block';
            }
            break;
        case 'region-samples-table':
            if (regionSamplesTableRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionSamplesTableRect.style.left = `${regionWidth * 0.8}px`;
                regionSamplesTableRect.style.top = `${regionHeight * 0.06}px`;
                regionSamplesTableRect.style.width = `${regionWidth * 0.2}px`;
                regionSamplesTableRect.style.height = `${regionHeight * 0.56}px`;
                regionSamplesTableRect.style.display = 'block';
            }
            break;
        case 'region-species-table':
            if (regionSpeciesTableRect && regionImage) {
                const regionRect = regionImage.getBoundingClientRect();
                const regionWidth = regionRect.width;
                const regionHeight = regionRect.height;

                regionSpeciesTableRect.style.left = `${regionWidth * 0}px`;
                regionSpeciesTableRect.style.top = `${regionHeight * 0.62}px`;
                regionSpeciesTableRect.style.width = `${regionWidth}px`;
                regionSpeciesTableRect.style.height = `${regionHeight * 0.48}px`;
                regionSpeciesTableRect.style.display = 'block';
            }
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
