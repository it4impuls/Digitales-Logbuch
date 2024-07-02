# start from an official image
FROM python:3.12
LABEL name="backend-gunicorn"
# args
ARG DJANGO_SUPERUSER_EMAIL
ARG DJANGO_SUPERUSER_USERNAME
ARG DJANGO_SUPERUSER_PASSWORD
ENV DJANGO_SUPERUSER_EMAIL=$DJANGO_SUPERUSER_EMAIL
ENV DJANGO_SUPERUSER_USERNAME=$DJANGO_SUPERUSER_USERNAME
ENV DJANGO_SUPERUSER_PASSWORD=$DJANGO_SUPERUSER_PASSWORD


RUN mkdir -p /opt/services/djangoapp/src
WORKDIR /opt/services/djangoapp/src

COPY . .

RUN apt update && apt install -y libldap2-dev libsasl2-dev libssl-dev gunicorn
RUN pip install -r requirements.txt

RUN ["python", "manage.py", "collectstatic", "--no-input", "-v 2"]

EXPOSE 8080

ENTRYPOINT ["./entrypoint.sh"]