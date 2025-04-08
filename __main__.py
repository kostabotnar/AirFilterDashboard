from adjust_sample_data import adjust_samples
from clean_sample_metadata import clean_metadata
from merge_abundance import process_sample_abundance
from merge_reads import process_sample_reads


def main():
    clean_metadata()
    # process_sample_abundance()
    # process_sample_reads()
    adjust_samples()

if __name__ == "__main__":
    main()