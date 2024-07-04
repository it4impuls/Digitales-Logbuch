
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser --noinput
#python manage.py import --file example.json
gunicorn -c ./config/gunicorn.config.py