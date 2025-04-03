from pathlib import Path

import pandas as pd


def clean_metadata():
    print("Read Metadata file")
    df = pd.read_csv('data/Sample Metadata.csv', parse_dates=['Collection Date'])
    df = df.dropna(subset=['Sample ID', 'Collection Date', 'Location (on dish)'])

    print("Read Regions file")
    df_reg = pd.read_csv('data/Regions.csv', usecols=['Location', 'Region'])
    df['Location (on dish)'] = df['Location (on dish)'].str.upper()  # Convert location names to uppercase

    print("Merge Regions with Metadata")
    df = (df.merge(df_reg, left_on='Location (on dish)', right_on='Location').
          drop(columns=['Location', 'Location (on dish)']))
    df = df.fillna("Unknown")
    df['Sample ID'] = df['Sample ID'].str.upper()  # Remove leading/trailing whitespace from sample IDs

    if Path('build/Sample Abundances.csv').exists():
        print("Filter samples with metagenomic data")
        samples = pd.read_csv('build/Sample Abundances.csv', usecols=['Sample ID']).drop_duplicates()
        df = df.merge(samples, on='Sample ID')

    print("Write Sample Metadata to CSV")
    df.to_csv('build/Sample Metadata.csv', index=False)
    print("Sample Metadata merged successfully.")


if __name__ == "__main__":
    clean_metadata()