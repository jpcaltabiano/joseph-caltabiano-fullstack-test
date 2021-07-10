"""
General assisting functions
"""
from Bio.Seq import Seq
from Bio import SeqIO
import os

def create_query_fasta(file_path:str, dna_sequence: str):
    with open(file_path, 'w') as out_fasta:
        out_fasta.write('>Query\n')
        for i in range(0, len(dna_sequence), 80):
            out_fasta.write(f'{dna_sequence[i: i+80]}\n')

# Note: has been changed from original, see README
def extract_sequence(start: int, end: int, strand: str):
    with open("genome/ecoli_k12_mg1655.fasta", "r") as handle:
        for record in SeqIO.parse(handle, "fasta"):
            if strand == 'plus': 
                sequence = record.seq[start - 1: end]
            elif strand == 'minus':
                sequence = record.seq[end - 1: start]
                sequence = sequence.reverse_complement()
    return str(sequence)