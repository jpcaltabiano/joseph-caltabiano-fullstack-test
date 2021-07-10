FROM ncbi/blast
RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get update && apt-get install redis-server sqlite3 libsqlite3-dev nodejs -y --no-install-recommends
RUN npm i npm@latest -g

WORKDIR /FullStackTestProject
RUN mkdir /blast_test
RUN mkdir /genome
COPY manage.py requirements.txt init.sh ./
COPY /blast_test ./blast_test
COPY /genome ./genome

RUN pip3 install -r requirements.txt
RUN python3 manage.py makemigrations blast_test
RUN python3 manage.py migrate

RUN mkdir /frontend
COPY /frontend/index.html /frontend/package.json ./frontend/
COPY /frontend/src ./frontend/src

EXPOSE 8000
EXPOSE 6379
EXPOSE 1234
STOPSIGNAL SIGTERM
CMD ["/bin/bash", "init.sh"]