from pathlib import Path

import pandas as pd


def adjust_samples(input_dir=None, output_dir=None):
    # Default paths for backward compatibility
    input_dir = input_dir or Path("data")
    output_dir = output_dir or Path("build")

    if not Path(f'{input_dir}/Sample Metadata.csv').exists():
        print("Sample Metadata file not found.")
        return
    print("Read Metadata file")
    df = pd.read_csv(f'{input_dir}/Sample Metadata.csv')

    if not Path(f'{input_dir}/Sample Abundances.csv').exists():
        print("Sample Abundances file not found.")
        return
    print("Read Abundance samples")
    df_abundance_samples = pd.read_csv(f'{input_dir}/Sample Abundances.csv', usecols=['Sample ID']).drop_duplicates()

    if not Path(f'{input_dir}/Sample Read Stats.csv').exists():
        print("Sample Read Stats file not found.")
        return
    print("Sample Read Stats file")
    df_read_samples = pd.read_csv(f'{input_dir}/Sample Read Stats.csv', usecols=['Sample ID']).drop_duplicates()

    common_samples = set(df["Sample ID"].tolist()) & set(df_abundance_samples["Sample ID"].tolist()) & set(df_read_samples["Sample ID"].tolist())

    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv(f'{output_dir}/Sample Metadata.csv', index=False)
    print("Metadata adjusted for common samples.")

    print("Read Abundance file")
    df = pd.read_csv(f'{input_dir}/Sample Abundances.csv')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv(f'{output_dir}/Sample Abundances.csv', index=False)
    print("Abundance adjusted for common samples.")

    print("Read Abundance Stacked file")
    df = pd.read_csv(f'{input_dir}/Sample Abundances stacked.csv')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv(f'{output_dir}/Sample Abundances stacked.csv', index=False)
    print("Abundance stacked adjusted for common samples.")

    print("Read Sample Read Stats file")
    df = pd.read_csv(f'{input_dir}/Sample Read Stats.csv')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv(f'{output_dir}/Sample Read Stats.csv', index=False)
    print("Read Stats adjusted for common samples.")
