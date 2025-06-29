from pathlib import Path

import pandas as pd
import argparse


def process_sample_reads(input_dir=None, output_dir=None):
    # Default paths for backward compatibility
    input_dir = input_dir or Path("data")
    output_dir = output_dir or Path("build")

    input_path = Path(input_dir)  # Path("../../data/Trim Report")  #
    output_path = Path(output_dir)  # Path("../../build")  #
    if not input_path.is_dir():
        raise ValueError(f"Input path '{input_path}' is not a directory")
    if not output_path.exists():
        output_path.mkdir(parents=True, exist_ok=True)
    output_file = output_path / "samples reads.csv"

    try:
        files = input_path.glob("*.xls")
        for file in files:
            print(f"Reading {file}")
            df = pd.read_excel(file, sheet_name=file.name[:-4], skiprows=1, nrows=1)

            df = df.rename(columns={'Name': "Sample ID", "Number of reads": "Number of Reads", "Avg.length": "Mean Read Length"})
            df = df[['Sample ID', 'Number of Reads', 'Mean Read Length']].fillna(0)
            # Append the dataframe to the output CSV file
            print(f"Writing to {output_file}")
            if not output_file.exists():
                df.to_csv(output_file, index=False)
            else:  # append if the output file already exists
                df.to_csv(output_file, mode="a", header=False, index=False)
    except FileNotFoundError as e:
        print(f"Path not found: {input_path}")

    print(f"Abundance data merged successfully into {output_file}")


if __name__ == "__main__":
    process_sample_reads()
