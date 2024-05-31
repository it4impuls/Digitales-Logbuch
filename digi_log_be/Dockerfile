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

# install our dependencies
# we use --system flag because we don't need an extra virtualenv
# COPY requirements.txt config/entrypoint.sh config/gunicorn.config.py ./
RUN apt update && apt install -y libldap2-dev libsasl2-dev libssl-dev gunicorn
RUN pip install -r requirements.txt

RUN ["python", "manage.py", "collectstatic", "--no-input", "-v 2"]

# copy our project code
# COPY . /opt/services/djangoapp/src

# /desksharing-web
# moves static files to correct location
# RUN python manage.py collectstatic --no-input -v 2
# move media files to correct location
#COPY ./media /opt/services/djangoapp/media
#RUN cd backend && python manage.py createsuperuser2 --noinput --username=$ADMIN_USERNAME --email=$ADMIN_EMAIL --password=$ADMIN_PASSWORD

# expose the port 80 internally, in the docker-compose.yml it gets redirected to 8000
EXPOSE 8080


RUN ls
CMD ["gunicorn", "-c", "./config/gunicorn.config.py"]
# RUN ["bash", "config/entrypoint.sh"]
# CMD ["bash"]