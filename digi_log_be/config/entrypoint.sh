#!/bin/bash
# cd app
python manage.py collectstatic --no-input -v 2
gunicorn -c config/gunicorn.config.py
#cfehome.wsgi:application --bind "0.0.0.0:8000" --daemon

#nginx -g 'daemon off;'