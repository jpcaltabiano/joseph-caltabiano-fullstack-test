from rest_framework import serializers
from .models import BlastJob, BlastResult

class BlastJobSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlastJob
        fields = ('id' ,'query', 'status')

class BlastResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlastResult
        fields = ('id' ,'blast_job', 'result_no', 'sstart', 'send', 'sstrand', 'evalue', 'pident', 'sequence')