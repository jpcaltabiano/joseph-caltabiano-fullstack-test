from django.shortcuts import render
from blast_test.models import BlastJob, BlastResult
from .serializers import BlastJobSerializer, BlastResultSerializer
from rest_framework import status, viewsets
from rest_framework.exceptions import NotFound 
from rest_framework.response import Response
from blast_test.tasks import create_query_file

# API class for creating jobs
class JobsView(viewsets.ModelViewSet):
    serializer_class = BlastJobSerializer   
    queryset = BlastJob.objects.all()

    # custom action to handle POST
    def create(self, request):
        job_instance = BlastJobSerializer(data=request.data)

        if job_instance.is_valid():
            job_instance.save()
            # dispatch Celery task to run blast search
            create_query_file.delay(job_instance.data['id'])
            return Response(job_instance.data, status=status.HTTP_201_CREATED)
        else:
            return Response(job_instance.errors, status=status.HTTP_400_BAD_REQUEST)

# API class for returning results
class ResultsView(viewsets.ModelViewSet):
    serializer_class = BlastResultSerializer
    queryset = BlastResult.objects.all()

    # custom action to handle GET
    # URL pattern: http://localhost:8000/api/results/?blast_job_id=<related job's id>
    # returns a set of BlastResult
    def get_queryset(self):
        queryset = BlastResult.objects.all()
        blast_job_id = self.request.query_params.get('blast_job_id')
        if blast_job_id is not None:
            queryset = queryset.filter(blast_job = blast_job_id)
        if queryset:  
            return queryset
        else:
            raise NotFound()

def home(request):
    return render(request, 'main.html')