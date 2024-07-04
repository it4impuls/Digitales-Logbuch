
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --noinput || echo 'couldnt create su'
gunicorn -c ./config/gunicorn.config.py