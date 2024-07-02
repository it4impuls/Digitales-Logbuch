
python manage.py migrate
echo python manage.py createsuperuser --noinput || echo 'couldnt create su'
gunicorn -c ./config/gunicorn.config.py