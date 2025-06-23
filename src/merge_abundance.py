from pathlib import Path

import pandas as pd
import argparse


def process_sample_abundance(input_dir=None, output_dir=None):
    # Default paths for backward compatibility
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    
    if not input_path.is_dir():
        raise ValueError(f"Input path '{input_path}' is not a directory")
    if not output_path.exists():
        output_path.mkdir(parents=True, exist_ok=True)
    output_file = output_path / "Samples Abundance.csv"

    # go through all folders in the input directory
    for folder in input_path.iterdir():
        if folder.is_dir():
            # separate sample name from the folder name
            sample_id = folder.name.split("_")[0]
            print(f"Processing {sample_id}")
            # read the TSV file into a dataframe
            abundance_file = folder / f"abundance_table_species.tsv"
            if not abundance_file.exists():
                print(f"Skipping {sample_id} because abundance table file not found")
                continue
            df = pd.read_csv(abundance_file, sep="\t", usecols=['tax', 'total'])
            df = df.rename(columns={'total': "Abundance", 'tax': "Taxonomy"  })
            df = df.fillna(0)
            df['Sample ID'] = sample_id

            # Spread the 'Taxonomy' column into separate columns
            df['Taxonomy'] = df['Taxonomy'].str.split(";")
            taxa_df = df['Taxonomy'].apply(pd.Series)
            taxa_df.columns = ['Domain', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species']
            for c in taxa_df.columns:
                taxa_df[c] = taxa_df[c].str.strip().replace("", "Unclassified")  # Remove leading and trailing spaces
                taxa_df[c] = taxa_df[c].str.replace("Unknown", "Unclassified")  # Remove leading and trailing spaces
                taxa_df[c] = taxa_df[c].str.replace(r'(.+?)(_none)+(?=($|_))', r'\1_unclassified', regex=True)  # Replace "_none" with "_unknown"
            taxa_df = taxa_df.fillna("Unclassified")


            # Concatenate the expanded taxonomy columns back to the original dataframe
            df = pd.concat([df.drop(columns=['Taxonomy']), taxa_df], axis=1)

            # Append the dataframe to the output CSV file
            print(f"Writing to {output_file}")
            if not output_file.exists():
                df.to_csv(output_file, index=False)
            else:  # append if the output file already exists
                df.to_csv(output_file, mode="a", header=False)

    print(f"Abundance data merged successfully into {output_file}")

if __name__ == "__main__":
    process_sample_abundance("../data/metagenomic/completed_reports", "../build/test")
