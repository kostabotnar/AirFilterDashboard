from pathlib import Path

import pandas as pd


def adjust_samples():
    if not Path('build/Sample Metadata.csv').exists():
        print("Sample Metadata file not found.")
        return
    print("Read Metadata file")
    df = pd.read_csv('build/Sample Metadata.csv')

    if not Path('build/Sample Abundances.csv').exists():
        print("Sample Abundances file not found.")
        return
    print("Read Abundance samples")
    df_abundance_samples = pd.read_csv('build/Sample Abundances.csv', usecols=['Sample ID']).drop_duplicates()

    if not Path('build/Sample Read Stats.csv').exists():
        print("Sample Read Stats file not found.")
        return
    print("Sample Read Stats file")
    df_read_samples = pd.read_csv('build/Sample Read Stats.csv', usecols=['Sample ID']).drop_duplicates()

    common_samples = set(df["Sample ID"].tolist()) & set(df_abundance_samples["Sample ID"].tolist()) & set(df_read_samples["Sample ID"].tolist())

    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv('build/Sample Metadata.csv', index=False)
    print("Metadata adjusted for common samples.")

    print("Read Abundance file")
    df = pd.read_csv('build/Sample Abundances.csv')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv('build/Sample Abundances.csv', index=False)
    print("Abundance adjusted for common samples.")

    print("Read Abundance Stacked file")
    df = pd.read_csv('build/Sample Abundances stacked.csv')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv('build/Sample Abundances stacked.csv', index=False)
    print("Abundance stacked adjusted for common samples.")

    print("Read Sample Read Stats file")
    df = pd.read_csv('build/Sample Read Stats.csv')
    df = df[df["Sample ID"].isin(common_samples)]
    df.to_csv('build/Sample Read Stats.csv', index=False)
    print("Read Stats adjusted for common samples.")
