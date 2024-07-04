
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --noinput
gunicorn -c ./config/gunicorn.config.py