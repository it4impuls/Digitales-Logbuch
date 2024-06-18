# start from an official image
FROM python:3.12
LABEL name="backend-gunicorn"
# args
#ARG ADMIN_USERNAME=admin
#ARG ADMIN_PASSWORD=admin
#ARG ADMIN_EMAIL=admin@example.com
# arbitrary location choice: you can change the directory
RUN mkdir -p /opt/services/djangoapp/src
WORKDIR /opt/services/djangoapp/src

COPY . .

RUN apt update && apt install -y libldap2-dev libsasl2-dev libssl-dev gunicorn
RUN pip install -r requirements.txt

RUN ["python", "manage.py", "collectstatic", "--no-input", "-v 2"]
RUN ["python", "manage.py", "migrate"]
RUN ["python", "manage.py", "createsuperuser"]

# expose the port 80 internally, in the docker-compose.yml it gets redirected to 8000
EXPOSE 8080

CMD ["gunicorn", "-c", "./config/gunicorn.config.py"]