from pathlib import Path

import pandas as pd


def adjust_samples(input_dir=None, output_dir=None):
    print("Adjusting samples based on common IDs")
    # Default paths for backward compatibility
    input_dir = Path(input_dir)
    output_dir = Path(output_dir) / "Common Samples"
    Path.mkdir(output_dir, exist_ok=True, parents=True)

    if not (input_dir / 'Sample Metadata.csv').exists():
        print("Sample Metadata file not found.")
        return
    print("Read Metadata file")
    metadata_samples = pd.read_csv(input_dir/'Sample Metadata.csv', usecols=['Sample ID'])["Sample ID"].tolist()

    if not (input_dir/'Sample Abundances.parquet').exists():
        print("Sample Abundances file not found.")
        return
    print("Read Abundance samples")
    abundance_samples = pd.read_parquet(input_dir/'Sample Abundances.parquet', columns=['Sample ID'])['Sample ID'].tolist()

    if not (input_dir/'Sample Read Stats.csv').exists():
        print("Sample Read Stats file not found.")
        return
    print("Sample Read Stats file")
    read_samples = pd.read_csv(input_dir/'Sample Read Stats.csv', usecols=['Sample ID'])["Sample ID"].tolist()

    common_samples = set(metadata_samples) & set(abundance_samples) & set(read_samples)
    samples_no_metadata = set(abundance_samples) - set(metadata_samples)
    samples_no_metagenomic = set(metadata_samples) - set(abundance_samples)

    # adjust metadata, abundance, abundance stacked, and read stats files
    print("Read Metadata file")
    df = pd.read_csv(input_dir/'Sample Metadata.csv')
    # filter rows based on common samples
    df[df["Sample ID"].isin(common_samples)].to_csv(output_dir/'Sample Metadata.csv', index=False)
    # save patients without metagenomics
    df[df["Sample ID"].isin(samples_no_metagenomic)].to_csv(output_dir / 'Samples_No_Metagenomics.csv', index=False)
    pd.DataFrame(samples_no_metadata, columns=["Sample ID"]).to_csv(output_dir / 'Samples_No_Metadata.csv', index=False)
    print("Metadata adjusted for common samples.")

    print("Adjust Abundance file")
    # copy Sample Abundances.parquet to the output directory with only common samples files
    df = pd.read_parquet(input_dir/'Sample Abundances.parquet')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv(output_dir/'Sample Abundances.csv', index=False)
    print("Abundance copied for common samples.")

    print("Read Sample Read Stats file")
    df = pd.read_csv(input_dir/'Sample Read Stats.csv')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv(output_dir/'Sample Read Stats.csv', index=False)
    print("Read Stats adjusted for common samples.")
