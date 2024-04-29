from django.contrib import admin
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken 
from .models import Course

admin.site.register(Course)

# admin.site.register(BlacklistedToken)
# admin.site.register(OutstandingToken)
