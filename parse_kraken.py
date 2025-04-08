from pathlib import Path

import numpy as np
import pandas as pd

rank_values = {
    "K": "Kingdom",
    "P": "Phylum",
    "C": "Class",
    "O": "Order",
    "F": "Family",
    "G": "Genus",
    "S": "Species"
}


def process_kraken_file(file_path: str):
    df = pd.read_csv(file_path, sep='\t', usecols=["Clades", 'Rank', 'Scientific Name'])
    df = df[df['Clades'] > 0]
    df['Scientific Name'] = df['Scientific Name'].str.strip()
    df = df[df['Rank'].str.match(r'^[A-Za-z]$')]
    df['Rank'] = df['Rank'].map(rank_values)
    df = df.dropna()
    df_stacked = df.rename(columns={'Rank': 'OTU', 'Scientific Name': 'Name', 'Clades': 'Abundance'})
    df_stacked['Sample ID'] = Path(file_path).stem.upper()

    # Define the order of ranks
    ranks = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species']

    # create a column for each rank
    for r in ranks:
        df.loc[df['Rank'] == r, r] = df.loc[df['Rank'] == r, 'Scientific Name']
    # fill na with previous rank if current rank is empty
    df = df.set_index(['Clades', 'Rank', 'Scientific Name'])
    # Mark rows with no species to delete later
    df['Species'] = df['Species'].fillna('Remove')
    df = df[df.columns.tolist()[::-1]].transpose()
    df = df.ffill()
    df = df.transpose()
    df = df[df.columns.tolist()[::-1]]
    for i, r in enumerate(ranks):
        if r == 'Species':
            continue
        df.loc[(df[r] != 'Remove')&(df[ranks[i]] == df[ranks[i+1]]), r] = np.nan

    # fill all ranks to the next rank if they are empty
    df = df.ffill()
    df = df[df['Species'] != 'Remove']
    df = df.reset_index()
    # drop the scientific name column
    df = df.drop(columns=['Scientific Name', 'Rank'])
    # Convert Clades to integers
    df['Clades'] = df['Clades'].astype(int)
    df = df.rename(columns={'Clades': 'Abundance'})
    # Add the sample ID (filename without extension)
    df['Sample ID'] = Path(file_path).stem.upper()
    return df, df_stacked


def main():
    # input_dir = Path("data/test")
    input_dir = Path("data/metagenomic/DHS_kraken_2025-04-03-1826")
    output_file = 'build/Sample Abundances.csv'
    stacked_output_file = 'build/Sample Abundances stacked.csv'

    all_data = []
    all_data_stacked = []

    for file in input_dir.glob('*.kraken'):
        print(f"Processing {file}")
        df, df_stacked = process_kraken_file(file)
        all_data.append(df)
        all_data_stacked.append(df_stacked)
    print(f"Merging all data into {output_file}")
    df_merged = pd.concat(all_data, ignore_index=True)
    df_merged.to_csv(output_file, index=False)
    df_merged = pd.concat(all_data_stacked, ignore_index=True)
    df_merged.to_csv(stacked_output_file, index=False)
    print(f"Sample abundances merged successfully into {output_file}")

if __name__ == "__main__":
    main()
