import pandas as pd


def main():
    """
    Reads the fastq_stats.tsv file, extracts sample IDs, and formats the data for easier downstream analysis.
    """
    print("Reading fastq_stats.tsv...")
    df = pd.read_csv("data/fastq_stats.tsv", sep="\t")
    print("Extracting sample IDs...")
    df["Sample"] = df["Sample"].apply(lambda x: x.split(".")[0])
    df.columns = ["Sample ID", "Number of Reads", "Mean Read Length"]
    df['Sample ID'] = df['Sample ID'].str.upper()
    print("Saving to Sample Read Stats.csv...")
    df.dropna().to_csv("build/Sample Read Stats.csv", index=False)
    print("Sample Read Stats.csv saved successfully.")

if __name__ == "__main__":
    main()