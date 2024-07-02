
python manage.py migrate
gunicorn -c ./config/gunicorn.config.py