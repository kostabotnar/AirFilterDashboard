from pathlib import Path

import click

from src.adjust_sample_data import adjust_samples
from src.clean_sample_metadata import clean_metadata
from src.merge_abundance import process_sample_abundance
from src.prepare_reads_data import process_sample_read_stats


@click.group()
def cli():
    """AirFilterDashboard - Process and combine sample data for dashboard visualization."""
    pass


@cli.command()
@click.option('--meta/--no-meta', default=True, help='Run metadata cleaning step')
@click.option('--abundance/--no-abundance', default=True, help='Run abundance processing step')
@click.option('--reads/--no-reads', default=True, help='Run reads processing step')
@click.option('--postprocessing/--no-postprocessing', default=True, help='Run post-processing step')
@click.option('--meta-path', type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path), 
              help='Path to metadata directory')
@click.option('--abund-path', type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path), 
              help='Path to sample abundance directory')
@click.option('--read-path', type=click.Path(exists=True, file_okay=False, dir_okay=True, path_type=Path), 
              help='Path to sample reads data directory')
@click.option('--output', required=True, type=click.Path(file_okay=False, dir_okay=True, path_type=Path),
              help='Output directory for processed files')
def run(meta, abundance, reads, postprocessing, meta_path, abund_path, read_path, output):
    """Run the AirFilterDashboard data processing pipeline."""
    # Create output directory if it doesn't exist
    output.mkdir(parents=True, exist_ok=True)
    
    if meta:
        click.echo("Running metadata cleaning...")
        if not meta_path:
            click.echo("Error: --meta-path is required when --meta is enabled")
            return
        clean_metadata(input_dir=meta_path, output_dir=output)
    
    if abundance:
        click.echo("Processing sample abundance data...")
        if not abund_path:
            click.echo("Error: --abund-path is required when --abundance is enabled")
            return
        process_sample_abundance(input_dir=abund_path, output_dir=output)
    
    if reads:
        click.echo("Processing sample reads data...")
        if not read_path:
            click.echo("Error: --read-path is required when --reads is enabled")
            return
        process_sample_read_stats(input_dir=read_path, output_dir=output)
    
    if postprocessing:
        click.echo("Running post-processing adjustments...")
        adjust_samples(input_dir=output, output_dir=output)
    
    click.echo("Processing complete!")


if __name__ == "__main__":
    cli()