from pathlib import Path

import pandas as pd


def clean_metadata(input_dir=None, output_dir=None):
    # Default paths for backward compatibility
    input_dir = input_dir or Path("data")
    output_dir = output_dir or Path("build")

    print("Read Metadata file")
    df = pd.read_csv(input_dir / 'metadata/Sample Metadata.csv', parse_dates=['Collection Date'])
    df = df.dropna(subset=['Sample ID', 'Collection Date', 'Location (on dish)'])

    print("Read Regions file")
    df_loc = pd.read_csv(input_dir / 'metadata/Location.csv')
    df_reg = pd.read_csv(input_dir / 'metadata/Regions.csv', usecols=['State', 'FEMA Region'])
    df_reg = df_reg.merge(df_loc, on='State').drop(columns=['State'])
    df['Location (on dish)'] = df['Location (on dish)'].str.upper()  # Convert location names to uppercase

    print("Merge Regions with Metadata")
    df = (df.merge(df_reg, left_on='Location (on dish)', right_on='Location').
          drop(columns=['Location', 'Location (on dish)']))
    df = df.fillna("Unknown")
    df['Sample ID'] = df['Sample ID'].str.upper()  # Remove leading/trailing whitespace from sample IDs
    df = df.rename(columns={'FEMA Region': 'Region'})

    print('Clean collection location')
    df = df[~df['Location (Indoor/Outdoor/Transit/Special Event)'].isin(['Unknown', 'NF', 'Selected'])]

    print("Write Sample Metadata to CSV")
    df.to_csv(output_dir / 'Sample Metadata.csv', index=False)
    print("Sample Metadata merged successfully.")


if __name__ == "__main__":
    clean_metadata()