from pathlib import Path

import pandas as pd
import argparse


def process_sample_abundance():
    argparser = argparse.ArgumentParser()
    argparser.add_argument("input_path", help="Path to input CSV files")
    argparser.add_argument("output_path", help="Path to save output CSV file with merged abundance data")
    args = argparser.parse_args()
    input_path = Path(args.input_path) # Path("../../data/Abundance Tables")
    output_path = Path(args.output_path) # "../../build"
    if not input_path.is_dir():
        raise ValueError(f"Input path '{input_path}' is not a directory")
    if not output_path.exists():
        output_path.mkdir(parents=True, exist_ok=True)
    output_file = output_path / "samples abundance.csv"

    try:
        files = input_path.glob("*.csv")
        for file in files:
            print(f"Reading {file}")
            filename = file.name.split(".")[0]
            df = pd.read_csv(file, usecols=['Taxonomy', 'Combined Abundance']).drop_duplicates()
            df = df.rename(columns={'Combined Abundance': "Abundance"})
            df = df.fillna(0)
            df['Sample ID'] = filename.split(" ")[0]

            # Spread the 'Taxonomy' column into separate columns
            df['Taxonomy'] = df['Taxonomy'].str.split(";")
            taxa_df = df['Taxonomy'].apply(pd.Series)
            taxa_df.columns = ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species']
            for c in taxa_df.columns:
                taxa_df[c] = taxa_df[c].str.strip().replace("", "Unknown")  # Remove leading and trailing spaces
            taxa_df = taxa_df.fillna("Unknown")

            # Concatenate the expanded taxonomy columns back to the original dataframe
            df = pd.concat([df.drop(columns=['Taxonomy']), taxa_df], axis=1)

            # Append the dataframe to the output CSV file
            print(f"Writing to {output_file}")
            if not output_file.exists():
                df.to_csv(output_file, index=False)
            else:  # append if the output file already exists
                df.to_csv(output_file, mode="a", header=False)
    except FileNotFoundError as e:
        print(f"Path not found: {input_path}")

    print(f"Abundance data merged successfully into {output_file}")

if __name__ == "__main__":
    process_sample_abundance()
