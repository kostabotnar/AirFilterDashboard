import concurrent.futures
import os
from pathlib import Path

import pandas as pd


def process_single_sample(folder, output_path):
    try:
        # separate sample name from the folder name
        sample_id = folder.name.split("_")[0]
        if len(sample_id) == 0:
            print(f"Invalid sample ID: {folder.name}")
            return None
        print(f"Processing {sample_id} in process {os.getpid()}")
        # read the TSV file into a dataframe
        abundance_file = folder / f"abundance_table_species.tsv"
        if not abundance_file.exists():
            print(f"Skipping {sample_id} because abundance table file not found")
            return None
            
        df = pd.read_csv(abundance_file, sep="\t", usecols=['tax', 'total'])
        df = df.rename(columns={'total': "Abundance", 'tax': "Taxonomy"})
        df = df.fillna(0)

        # Spread the 'Taxonomy' column into separate columns
        df['Taxonomy'] = df['Taxonomy'].str.split(";")
        taxa_df = df['Taxonomy'].apply(pd.Series)
        taxa_df.columns = ['Domain', 'Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species']
        for c in taxa_df.columns:
            taxa_df[c] = taxa_df[c].str.strip().replace("", "Unclassified")
            taxa_df[c] = taxa_df[c].str.replace("Unknown", "Unclassified")
            taxa_df[c] = taxa_df[c].str.replace(r'(.+?)(_none)+(?=($|_))', r'\1_unclassified', regex=True)
        taxa_df = taxa_df.fillna("Unclassified")

        # Concatenate the expanded taxonomy columns back to the original dataframe
        df = pd.concat([df.drop(columns=['Taxonomy']), taxa_df], axis=1)
        
        # Write to parquet with partitioning
        parquet_path = output_path / "Sample Abundances Partitioned.parquet" / f"Sample ID={sample_id}"
        parquet_path.mkdir(parents=True, exist_ok=True)
        df.to_parquet(
            parquet_path / "Sample Abundances Partitioned.parquet",
            engine='pyarrow'
        )

        return sample_id
    except Exception as e:
        print(f"Error processing {folder.name}: {str(e)}")
        return None

def process_sample_abundance(input_dir=None, output_dir=None, max_workers=32):
    # Default paths for backward compatibility
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    print(f"Processing sample abundance data from {input_path} to {output_path}")
    
    if not input_path.is_dir():
        raise ValueError(f"Input path '{input_path}' is not a directory")
    if not output_path.exists():
        output_path.mkdir(parents=True, exist_ok=True)
    
    # Get all folders in the input directory
    folders = [f for f in input_path.iterdir() if f.is_dir()]
    
    # Process each folder in parallel
    processed_samples = []
    max_workers = min(max_workers, os.cpu_count() or 1)

    with concurrent.futures.ProcessPoolExecutor(max_workers=max_workers) as executor:
        future_to_folder = {executor.submit(process_single_sample, folder, output_path): folder for folder in folders}
        for future in concurrent.futures.as_completed(future_to_folder):
            folder = future_to_folder[future]
            try:
                sample_id = future.result()
                if sample_id:
                    processed_samples.append(sample_id)
            except Exception as e:
                print(f"Error processing {folder.name}: {str(e)}")
    
    print(f"Processed {len(processed_samples)} samples successfully")
    print(f"Data written to {output_path / 'Sample Abundances Partitioned.parquet'} as partitioned parquet files")
    print("Merge all data in one parquet file")
    (pd.read_parquet(output_path / "Sample Abundances Partitioned.parquet", engine='pyarrow')
     .to_parquet(output_path / "Sample Abundances.parquet"))


if __name__ == "__main__":
    process_sample_abundance("../data/metagenomic/completed_reports", "../build/test")
