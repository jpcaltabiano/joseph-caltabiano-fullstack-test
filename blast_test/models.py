from django.db import models

# status
#  'c' = created
#  'f' = finished
class BlastJob(models.Model):
    query = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=10, blank=True, null=True)

class BlastResult(models.Model):
    blast_job = models.ForeignKey(BlastJob, blank=False, null=False, on_delete=models.CASCADE)
    result_no = models.IntegerField(blank=False, null=False)
    sstart = models.IntegerField(blank=False, null=False)
    send = models.IntegerField(blank=False, null=False)
    sstrand = models.CharField(max_length=5)
    evalue = models.FloatField(blank=False, null=False)
    pident = models.FloatField(blank=False, null=False)
    sequence = models.CharField(max_length=255, blank=False, null=False)
