# Full Stack position test project

Joseph Caltabiano

## How to run

Open a terminal and run the following from this directory (joseph-caltabiano-fullstack-test):
```
git clone git@github.com:jpcaltabiano/joseph-caltabiano-fullstack-test.git
cd joseph-caltabiano-fullstack-test
sudo docker build -t blast-test-image .
sudo docker run -it -p 8000:8000 -p 1234:1234 blast-test-image
```
After running the final command, npm will need to install packages and start the dev server, which may take a minute or so.
Once your terminal shows that the package has been built and the server is running, navigate to `http://localhost:1234`.

Notes:
- Steps to run tested only on Ubuntu 20.04 - please let me know if this does not work!
- The original version of blast_test/utils.py:extract_sequence() returned nothing when strand=="minus". I've assumed that this was a bug and edited the function accordingly.

This project could be further improved by writing a test suite, writing more complete documentation & using JSDoc, and adding better error handling both on frontend requests and backend handling.
