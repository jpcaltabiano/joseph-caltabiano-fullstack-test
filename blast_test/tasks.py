from .models import BlastJob, BlastResult
from .celery import app
from .utils import create_query_fasta
from .utils import extract_sequence
import subprocess
from io import StringIO
import pandas as pd
import os

# Task to run a blastn job and instantiate BlastResults
@app.task(bind=True)
def create_query_file(self, model_id):
    fname = f'query_{model_id}.fsa'
    job = BlastJob.objects.get(pk=model_id)
    seq = job.query

    create_query_fasta(fname, seq)
    results = run_blast_search(fname, seq)

    # convert tab-deliniated results into a dict
    results = results.decode('utf-8')
    results = StringIO("sstart\tsend\tsstrand\tevalue\tpident\n" + results)
    results = pd.read_csv(results, sep="\t").to_dict('records')

    # convert each result record into a new BlastResult
    for i in range(0, len(results)):
        r = results[i]
        new_res = BlastResult()
        new_res.blast_job = job
        new_res.blast_job_id = job.id
        new_res.result_no = i
        new_res.sstart = r['sstart']
        new_res.send = r['send']
        new_res.sstrand = r['sstrand']
        new_res.evalue = r['evalue']
        new_res.pident = r['pident']
        new_res.sequence = extract_sequence(r['sstart'], r['send'], r['sstrand'])
        new_res.save()

    os.remove(fname)

    # change job status to 'f' = finished
    job.status = 'f'
    job.save()

# Task to call the blastn cmd
# Returns the results as str
def run_blast_search(fname: str, seq: str):
    # an option to optimize searches for queries shorter than 50 bases
    short_seq_flag = "-task blastn-short" if len(seq) < 50 else ""
    blastn_cmd = f'blastn -query {fname} -subject genome/ecoli_k12_mg1655.fasta {short_seq_flag} -outfmt \"6 sstart send sstrand evalue pident\"'
    
    # run the blastn command and gather results
    proc = subprocess.Popen(blastn_cmd, shell=True, stdout=subprocess.PIPE)
    (out, err) = proc.communicate()

    return out
