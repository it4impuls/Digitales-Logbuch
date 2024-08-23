from django.http import HttpResponse
from django.conf import settings
# from django.contrib.auth.middleware import AuthenticationMiddleware as _AuthenticationMiddleware
# EXCLUDE_FROM_MIDDLEWARE = set('Django_Rest_Framework.views.apiIndexView',
#                             'Django_Rest_Framework.views.IndexView',
#                              'accounts.views.RegisterView',
#                              'accounts.views.LoginView'
#                             )

EXCLUDE_FROM_MIDDLEWARE = []


class AuthorizationMiddleware:
    def __init__(self, get_response=None):
        self.get_response = get_response

    def process_view(self, request, view_func, view_args, view_kwargs):
        view_name = '.'.join((view_func.__module__, view_func.__name__))
        print(view_name)
        if view_name in EXCLUDE_FROM_MIDDLEWARE:
            return None
    
    def __call__(self, request):
        token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])
        if token:
            request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
        return self.get_response(request)