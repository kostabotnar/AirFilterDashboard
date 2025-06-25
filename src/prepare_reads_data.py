import json
import os
import re
from io import StringIO
from pathlib import Path

import pandas as pd

from src.ConcurrentUtil import ConcurrentUtil


def main():
    """
    Reads the fastq_stats.tsv file, extracts sample IDs, and formats the data for easier downstream analysis.
    """
    print("Reading fastq_stats.tsv...")
    df = pd.read_csv("../data/metagenomic/fastq_stats.tsv", sep="\t")
    print("Extracting sample IDs...")
    df["Sample"] = df["Sample"].apply(lambda x: x.split(".")[0])
    df.columns = ["Sample ID", "Number of Reads", "Mean Read Length"]
    df['Sample ID'] = df['Sample ID'].str.upper()
    print("Saving to Sample Read Stats.csv...")
    df.dropna().to_csv("build/Sample Read Stats.csv", index=False)
    print("Sample Read Stats.csv saved successfully.")


def extract_report_json(report_file):
    """
    Extract and parse the JSON data from a wf-metagenomics-report.html file.
    
    Args:
        report_file (Path): Path to the HTML report file
        
    Returns:
        dict: The parsed JSON data, or None if extraction failed
    """
    try:
        with open(report_file, 'r', encoding='utf-8') as f:
            content = f.readlines()

        # Find the line with "Bokeh.safely(function() {"
        bokeh_line_index = None
        for i, line in enumerate(content):
            if "Bokeh.safely(function() {" in line:
                bokeh_line_index = i
                break

        if bokeh_line_index is None:
            print(f"Could not find Bokeh initialization in {report_file}")
            return None

        # Skip two lines and read the JSON line
        json_line_index = bokeh_line_index + 3
        if json_line_index >= len(content):
            print(f"File {report_file} is too short, couldn't find JSON data")
            return None

        json_line = content[json_line_index]

        # Extract the JSON string
        match = re.match(r'\s*const docs_json = \'(.*)\';', json_line)
        if not match:
            print(f"Could not extract JSON data from line: {json_line}")
            return None

        json_str = match.group(1)

        # Parse the JSON
        json_data = json.loads(json_str)
        return json_data

    except Exception as e:
        print(f"Error extracting JSON from {report_file}: {str(e)}")
        return None


def extract_read_stats(report_file, sample_id: str) -> pd.DataFrame:
    df_length = extract_read_length_stats(report_file, sample_id)
    df_reads = extract_read_count_stats(report_file)
    df_indexes = extract_index_stats(report_file)

    # Merge the three dataframes into a single result dataframe
    df_res = None
    for df in [df_length, df_reads, df_indexes]:
        if df is None:
            continue
        if df_res is None:
            df_res = df
            continue
        df_res = df_res.merge(df, on="Sample ID")
    return df_res


def extract_read_count_stats(report_file) -> pd.DataFrame or None:
    """
    Extract read count statistics from the report HTML.

    Args:
        report_file (Path): Path to the HTML report file

    Returns:
        dict: Dictionary containing read count statistics
    """
    try:
        with open(report_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the marker text and the table that follows
        marker = "unmapped reads before both filters are applied."
        if marker not in content:
            print(f"Could not find marker text in {report_file}")
            return None

        # Find the table after the marker
        table_start_pos = content.find("<table", content.find(marker))
        if table_start_pos == -1:
            print(f"Could not find table after marker in {report_file}")
            return None

        table_end_pos = content.find("</table>", table_start_pos) + 8
        table_html = content[table_start_pos:table_end_pos]

        # Parse the table using pandas
        tables = pd.read_html(StringIO(table_html))
        if not tables:
            print(f"Could not parse table in {report_file}")
            return None

        # First table contains the read count data
        result = tables[0]
        result.columns = ['Sample ID', 'Reads', 'Unmapped Reads', 'Unmapped Reads (%)']
        return result

    except Exception as e:
        print(f"Error extracting read count statistics: {str(e)}")
        return None


def extract_index_stats(report_file) -> pd.DataFrame or None:
    """
    Extract read indexes statistics from the report HTML.

    Args:
        report_file (Path): Path to the HTML report file

    Returns:
        df: data frame containing read count statistics
    """
    try:
        with open(report_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the marker text and the table that follows
        marker = "Sample diversity indices."
        if marker not in content:
            print(f"Could not find marker text in {report_file}")
            return None

        # Find the table after the marker
        table_start_pos = content.find("<table", content.find(marker))
        if table_start_pos == -1:
            print(f"Could not find table after marker in {report_file}")
            return None

        table_end_pos = content.find("</table>", table_start_pos) + 8
        table_html = content[table_start_pos:table_end_pos]

        # Parse the table using pandas
        tables = pd.read_html(StringIO(table_html))
        if not tables:
            print(f"Could not parse table in {report_file}")
            return None

        # First table contains the read count data
        result = tables[0]
        result = result.drop(columns='total')  # we have only one sample
        result = result.set_index('Indices').transpose().reset_index(names='Sample ID')
        return result

    except Exception as e:
        print(f"Error extracting read count statistics: {str(e)}")
        return None


def extract_read_length_stats(report_file, sample_id=None) -> pd.DataFrame or None:
    """
    Extract read length statistics from the report JSON.
    
    Args:
        report_file (Path): Path to the HTML report file
        
    Returns:
        dict: Dictionary containing mean, median, min, and max read lengths
    """
    json_data = extract_report_json(report_file)
    if not json_data:
        return None

    try:
        # Navigate through the JSON structure to find the text with read length stats
        for doc_id in json_data:
            doc = json_data[doc_id]
            if 'roots' in doc:
                root = doc['roots'][1]
                if 'attributes' in root and 'above' in root['attributes']:
                    above = root['attributes']['above']
                    text = above[0]['attributes']['text']
                    # Look for the read length statistics text
                    match = re.search(
                        r'Mean: ([\d,.]+)\. Median: ([\d,.]+)\. Min: ([\d,.]+)\. Max: ([\d,.]+)', text)
                    if match:
                        return pd.DataFrame({
                            'Sample ID': [sample_id],
                            'Mean Read Length': [float(match.group(1).replace(',', ''))],
                            'Median Read Length': [float(match.group(2).replace(',', ''))],
                            'Min Read Length': [float(match.group(3).replace(',', ''))],
                            'Max Read Length': [float(match.group(4).replace(',', ''))]
                        })
    except Exception as e:
        print(f"Error extracting read length statistics: {str(e)}")
        return None

    return None


def process_sample_stats(report_folder):
    print(f"Processing stats from {report_folder} in the process {os.getpid()}")
    sample_id = report_folder.name.split('_')[0]
    report_file = report_folder / "wf-metagenomics-report.html"

    if report_file.exists():
        stats = extract_read_stats(report_file, sample_id)
        return stats
    return None


def process_sample_read_stats(input_dir: str, output_dir: str):
    """
    Process all metagenomics reports in the input directory and save results to a CSV file.
    
    Args:
        input_dir (str): Directory containing sample report folders
        output_file (str): Path to save the output CSV file
    """
    input_path = Path(input_dir)
    if not Path(output_dir).exists():
        Path(output_dir).mkdir(parents=True)
    output_file = Path(output_dir) / "Sample Read Stats.csv"

    # Find all report files
    # Use max 64 processes or number of CPUs, whichever is smaller
    max_workers = min(64, os.cpu_count() or 1)
    report_folders = list(input_path.glob("*_reports"))
    params = [(report_folder,) for report_folder in report_folders]
    stats = ConcurrentUtil.run_in_separate_processes(process_sample_stats, params, max_workers)

    # Save results to CSV
    if stats:
        df = pd.concat(stats)
        df.to_csv(output_file, index=False)
        print(f"Saved read length data for {len(stats)} samples to {output_file}")
    else:
        print("No read length data found")


if __name__ == "__main__":
    process_sample_read_stats("../data/metagenomic/completed_reports", "../build/test")
