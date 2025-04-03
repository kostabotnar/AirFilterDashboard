import pandas as pd


def main():
    df = pd.read_csv("data/fastq_stats.tsv", sep="\t")
    df["Sample"] = df["Sample"].apply(lambda x: x.split(".")[0])
    df.columns = ["Sample ID", "Number of Reads", "Mean Read Length"]
    df.dropna().to_csv("build/Sample Read Stats.csv", index=False)

if __name__ == "__main__":
    main()