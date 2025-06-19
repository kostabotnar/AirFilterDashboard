let descriptions = {};
let highlightIds = [];
window.addEventListener('DOMContentLoaded', () => {
  loadDescriptions()
    .then(() => {
      insertStaticDescriptions();
      initializeSelectedItemDescriptions();
      setupFilterInteractivity();
      setupSmoothScrolling();
      setupHighlightRectangles();
      window.addEventListener('resize', setupHighlightRectangles);
      initializeWithNoSelection();
    });
});

async function loadDescriptions() {
  try {
    const response = await fetch('text/descriptions.json');
    descriptions = await response.json();
  } catch (err) {
    console.error("Failed to load descriptions:", err);
  }
}

function insertStaticDescriptions() {
  const map = {
    'nationwide': '.nation-description p',
    'region': '.region-description p',
    'sample': '.sample-description p',
    'taxonomic': '.taxo-description p',
    'species': '.species-description p'
  };
  Object.entries(map).forEach(([key, selector]) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = descriptions[key] || 'Not found';
  });
}

function initializeSelectedItemDescriptions() {
  const selectedRegionItem = document.querySelector('#region .filter-list li.selected');
  if (selectedRegionItem) {
    const descEl = selectedRegionItem.querySelector('.filter-item-description');
    if (descEl) descEl.textContent = descriptions['collection-date-filter'] || 'Not found';
  }
}

function initializeWithNoSelection() {
  document.querySelectorAll('.filter-list li').forEach(item => item.classList.remove('selected'));

   highlightIds = [
    // Nationwide
    'collection-date-filter-highlight',
    'sample-count-highlight',
    'geo-distribution-highlight',
    'collection-date-highlight',
    'seasonal-distribution-highlight',
    'location-distribution-highlight',
    'map-hover-tooltip',
    // Region
    'region-collection-date-filter-highlight',
    'region-sample-count-highlight',
    'region-name-highlight',
    'region-species-pathogen-highlight',
    'region-metadata-distribution-highlight',
    'region-top-species-highlight',
    'region-samples-table-highlight',
    'region-species-table-highlight',
    // Sample
    'sample-id-highlight',
    'sample-metadata-highlight',
    'sample-species-pathogen-highlight',
    'sample-reads-info-highlight',
    'sample-top-species-highlight',
    'sample-species-table-highlight'
  ];

  highlightIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function setupFilterInteractivity() {
  setupSingleSelect('.filter-list li', 'nationwide');
  setupSingleSelect('#region .filter-list li', 'region');
  setupSingleSelect('#sample .filter-list li', 'sample');
}

function setupSingleSelect(selector, context) {
  const items = document.querySelectorAll(selector);
  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      const option = item.dataset.option;
      const descriptionEl = item.querySelector('.filter-item-description');
      if (descriptionEl) descriptionEl.textContent = descriptions[option] || 'Not found';
      updateHighlight(option);
    });
  });
}

function setupSmoothScrolling() {
  document.querySelectorAll('.toc-list a').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  });
}

function setupHighlightRectangles() {
  const nationwideImage = document.getElementById('nationwide-image');
  const regionImage = document.getElementById('region-image');

  if (nationwideImage) {
    if (nationwideImage.complete) updateNationwideRects(nationwideImage);
    else nationwideImage.onload = () => updateNationwideRects(nationwideImage);
  }

  if (regionImage) {
    if (regionImage.complete) updateRegionRects(regionImage);
    else regionImage.onload = () => updateRegionRects(regionImage);
  }
}

function updateNationwideRects(img) {
  const rects = {
    'collection-date-filter-highlight': [0, 0.08, 0.25, 0.2],
    'sample-count-highlight': [0, 0.3, 0.25, 0.15],
    'geo-distribution-highlight': [0.25, 0, 0.75, 0.6],
    'collection-date-highlight': [0, 0.6, 0.45, 0.4],
    'seasonal-distribution-highlight': [0.45, 0.6, 0.25, 0.4],
    'location-distribution-highlight': [0.7, 0.6, 0.3, 0.4]
  };
  applyRectPositions(img, rects);

  const tooltip = document.getElementById('map-hover-tooltip');
  if (tooltip) {
    tooltip.style.left = `${img.offsetWidth * 0.5 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${img.offsetHeight * 0.3 - tooltip.offsetHeight / 2}px`;
  }
}

function updateRegionRects(img) {
  const keys = [
    'region-collection-date-filter-highlight',
    'region-sample-count-highlight',
    'region-name-highlight',
    'region-species-pathogen-highlight',
    'region-metadata-distribution-highlight',
    'region-top-species-highlight',
    'region-samples-table-highlight',
    'region-species-table-highlight'
  ];
  const values = [
    [0, 0.05, 0.3, 0.2],
    [0, 0.31, 0.3, 0.16],
    [0, 0.25, 0.3, 0.08],
    [0, 0.47, 0.3, 0.15],
    [0.3, 0.06, 0.23, 0.55],
    [0.55, 0.06, 0.25, 0.55],
    [0.8, 0.06, 0.2, 0.56],
    [0, 0.62, 1, 0.48]
  ];

  const rects = Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  applyRectPositions(img, rects);
}

function applyRectPositions(image, rects) {
  const width = image.offsetWidth;
  const height = image.offsetHeight;

  Object.entries(rects).forEach(([id, [left, top, w, h]]) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.left = `${width * left}px`;
      el.style.top = `${height * top}px`;
      el.style.width = `${width * w}px`;
      el.style.height = `${height * h}px`;
    }
  });
}

function updateHighlight(option) {
  // Hide all highlight rectangles first
  highlightIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Then show only the selected rectangle
  const el = document.getElementById(`${option}-highlight`);
  if (el) el.style.display = 'block';
}
