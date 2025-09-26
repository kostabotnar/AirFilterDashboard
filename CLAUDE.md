# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AirFilterDashboard is a Python data processing pipeline that combines environmental sample data (metadata, abundance, and read statistics) for dashboard visualization. The project processes metagenomic data from air filter samples across different FEMA regions.

## Running Commands

### Main Pipeline Execution
```bash
python __main__.py run --output build/ --meta-path data/metadata --abund-path data/metagenomic/completed_reports --read-path data/metagenomic
```

### Individual Processing Steps
```bash
# Run specific pipeline components
python __main__.py run --no-abundance --no-reads --output build/ --meta-path data/metadata
python __main__.py run --no-meta --no-reads --output build/ --abund-path data/metagenomic/completed_reports
python __main__.py run --no-meta --no-abundance --output build/ --read-path data/metagenomic
```

### Running Individual Modules
```bash
# Process from src/ directory
python -m src.clean_sample_metadata
python -m src.merge_abundance
python -m src.prepare_reads_data
python -m src.adjust_sample_data
python -m src.adjust_geojson
```

## Code Architecture

### Data Processing Pipeline
The pipeline follows a 4-stage process orchestrated by `__main__.py`:

1. **Metadata Cleaning** (`src/clean_sample_metadata.py`): Processes sample metadata, merges with FEMA region data, and duplicates samples for RNA metagenomics
2. **Abundance Processing** (`src/merge_abundance.py`): Processes abundance tables from metagenomic reports, parses taxonomy data, and creates partitioned parquet files
3. **Read Stats Processing** (`src/prepare_reads_data.py`): Extracts read statistics from HTML reports using regex parsing and concurrent processing
4. **Post-processing** (`src/adjust_sample_data.py`): Identifies common samples across all datasets and creates filtered outputs

### Key Components

- **ConcurrentUtil** (`src/ConcurrentUtil.py`): Utility class providing thread and process pool execution for parallel processing
- **HTML Report Parsing**: Complex JSON and HTML table extraction from `wf-metagenomics-report.html` files
- **Taxonomy Processing**: Splits semicolon-separated taxonomy strings into hierarchical columns (Domain → Species)
- **GeoJSON Processing** (`src/adjust_geojson.py`): Filters and adjusts FEMA region polygons for visualization

### Data Flow
```
Raw Data Sources:
├── data/metadata/ (Sample Metadata.csv, Regions.csv)
├── data/metagenomic/completed_reports/ (abundance_table_species.tsv)
└── data/metagenomic/ (fastq_stats.tsv, HTML reports)

Processing Pipeline:
├── Metadata cleaning & region mapping
├── Abundance data with taxonomy parsing (→ parquet)
├── Read statistics extraction from HTML
└── Common sample filtering

Output:
└── build/ or specified output directory
    ├── Sample Metadata.csv
    ├── Sample Abundances.csv (filtered)
    ├── Sample Read Stats.csv
    └── Common Samples/ (final filtered datasets)
```

### Parallel Processing Strategy
- **Abundance processing**: Uses ProcessPoolExecutor with up to 32 workers for sample-level parallelization
- **Read stats extraction**: Uses ProcessPoolExecutor with up to 64 workers for HTML report parsing
- **Custom utilities**: ConcurrentUtil class provides reusable parallel execution patterns

## Web Dashboard

The `web/` directory contains a complete frontend application for visualizing the processed metagenomic data through an embedded Microsoft Power BI dashboard.

### Dashboard Structure

The web application consists of multiple views organized hierarchically:

1. **Landing Page** (`index.html`): Entry point with disclaimer acknowledgment system
2. **Dashboard Views**: Five main analytical views accessible via embedded Power BI
   - **Nationwide View**: Overview of all samples across FEMA regions with geographic distribution
   - **Region View**: Detailed analysis of samples within a specific FEMA region
   - **Sample View**: Individual sample details with species abundance and read statistics
   - **Taxonomic Tree**: Interactive hierarchical tree visualization of sample diversity
   - **Species View**: Aggregated analysis of a specific species across all samples

### Key Features

- **Disclaimer System**: Mandatory acknowledgment stored in localStorage before dashboard access
- **Navigation**: Sidebar-based navigation with iframe content loading
- **Power BI Integration**: Embedded dashboard URL: `https://app.powerbi.com/view?r=eyJrIjoiZDRkMzBlMDktZjc1Ny00YWIxLTk3YTMtNjQxYmJhYzk0YTZhIiwidCI6IjdiZWYyNTZkLTg1ZGItNDUyNi1hNzJkLTMxYWVhMjU0Njg1MiIsImMiOjN9`
- **Cache Management**: Automatic cache busting with version control (currently v2.4.3)
- **Drill-through Navigation**: Right-click context menus for moving between analytical levels

### Content Management

- **Dynamic Text Loading**: Content loaded from `text/` directory (about.txt, disclaimer.txt, descriptions.json)
- **Interactive Guide**: Comprehensive tutorial with highlighted dashboard elements and hover descriptions
- **Image Assets**: Screenshots and guide images stored in `image/` directory

### Running the Web Application

```bash
# Serve the web directory with any static file server
# For example, with Python:
cd web
python -m http.server 8000

# Or with Node.js http-server:
npx http-server web -p 8000
```

### Web Architecture Notes

- **State Management**: Uses localStorage for login state and disclaimer acknowledgment
- **Version Control**: Automatic cache clearing when APP_VERSION changes in cache-buster.js
- **Responsive Design**: CSS Grid/Flexbox layouts with collapsible sidebar
- **Content Security**: No inline scripts, external content loaded via fetch()

## Important Notes

- All sample IDs are normalized to uppercase
- Homo sapiens species are filtered out in the final abundance data
- The pipeline creates both individual and "Common Samples" filtered outputs
- HTML report parsing relies on specific markup patterns in wf-metagenomics reports
- Taxonomy data uses "Unclassified" as the standard label for missing classifications
- Web dashboard requires disclaimer acknowledgment before access to Power BI visualization