#!/bin/bash
redis-server &
celery -A blast_test.celery worker --loglevel=info &
python3 manage.py runserver 0.0.0.0:8000 &
cd frontend && npm i && npm start
