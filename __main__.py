import click
from pathlib import Path
from src.adjust_sample_data import adjust_samples
from src.clean_sample_metadata import clean_metadata
from src.merge_abundance import process_sample_abundance
from src.merge_reads import process_sample_reads


@click.group()
def cli():
    """AirFilterDashboard - Process and combine sample data for dashboard visualization."""
    pass


@cli.command()
@click.option('--meta/--no-meta', default=True, help='Run metadata cleaning step')
@click.option('--abundance/--no-abundance', default=True, help='Run abundance processing step')
@click.option('--reads/--no-reads', default=True, help='Run reads processing step')
@click.option('--postprocessing/--no-postprocessing', default=True, help='Run post-processing step')
@click.option('--input', required=True, type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path), 
              help='Input directory containing raw data files')
@click.option('--output', required=True, type=click.Path(file_okay=False, dir_okay=True, path_type=Path),
              help='Output directory for processed files')
def run(meta, abundance, reads, postprocessing, input, output):
    """Run the AirFilterDashboard data processing pipeline."""
    # Create output directory if it doesn't exist
    output.mkdir(parents=True, exist_ok=True)
    
    if meta:
        click.echo("Running metadata cleaning...")
        clean_metadata(input_dir=input, output_dir=output)
    
    if abundance:
        click.echo("Processing sample abundance data...")
        process_sample_abundance(input_dir=input, output_dir=output)
    
    if reads:
        click.echo("Processing sample reads data...")
        process_sample_reads(input_dir=input, output_dir=output)
    
    if postprocessing:
        click.echo("Running post-processing adjustments...")
        adjust_samples(input_dir=input, output_dir=output)
    
    click.echo("Processing complete!")


if __name__ == "__main__":
    cli()