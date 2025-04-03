import pandas as pd


def main():
    df = pd.read_csv('data/Sample Metadata.csv', parse_dates=['Collection Date'])
    df = df.dropna(subset=['Sample ID', 'Collection Date', 'Location (on dish)'])

    df_reg = pd.read_csv('data/Regions.csv', usecols=['Location', 'Region'])
    df['Location (on dish)'] = df['Location (on dish)'].str.upper()  # Convert location names to uppercase
    df = (df.merge(df_reg, left_on='Location (on dish)', right_on='Location').
          drop(columns=['Location', 'Location (on dish)']))
    df = df.fillna("Unknown")
    df['Sample ID'] = df['Sample ID'].str.upper()  # Remove leading/trailing whitespace from sample IDs
    df.to_csv('build/Sample Metadata.csv', index=False)



if __name__ == "__main__":
    main()