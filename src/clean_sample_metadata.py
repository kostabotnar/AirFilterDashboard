from pathlib import Path

import pandas as pd


def clean_metadata(input_dir=None, output_dir=None):
    # Default paths for backward compatibility
    input_dir = Path(input_dir)
    output_dir = Path(output_dir)
    Path.mkdir(output_dir, parents=True, exist_ok=True)

    print("Read Metadata file")
    df = pd.read_csv(input_dir / 'Sample Metadata.csv', parse_dates=['Collection Date'],
                     usecols=['Sample ID', 'Collection Date', 'State', 'Stored at 4C? (Y/N)',
                              'PCR Inhibited? Y/N/Partial', 'Location (Indoor/ Outdoor/Transit/ Special Event)'])
    df = df.dropna(subset=['Sample ID', 'Collection Date', 'State'])

    print("Read Regions file")
    df_reg = pd.read_csv(input_dir / 'Regions.csv', usecols=['State', 'FEMA Region'])
    df = df.merge(df_reg, on='State')
    df = df.fillna("Unknown")
    df['Sample ID'] = df['Sample ID'].str.upper()  # Remove leading/trailing whitespace from sample IDs
    df = df.rename(columns={'FEMA Region': 'Region'})

    print("Duplicate samples for RNA metagenomics data")
    dfr = df.copy()
    dfr['Sample ID'] = dfr['Sample ID'] + 'R'
    df = pd.concat([df, dfr])

    print("Write Sample Metadata to CSV")
    df.to_csv(output_dir / 'Sample Metadata.csv', index=False)
    print("Sample Metadata merged successfully.")


if __name__ == "__main__":
    clean_metadata('../data/metadata', '../build')
