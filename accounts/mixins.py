from rest_framework import serializers
from .utils import PasswordValidation
from django.utils.translation import activate as set_language
from rest_framework.response import Response


class PasswordSerializerMixin(serializers.Serializer):
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        # password validation
        pass_validate = PasswordValidation(attrs['new_password'], attrs['confirm_password'])
        pass_validate.same_password_validation()
        return attrs    


class LocalizationMixin:
    """
    using initial method to handle localization errors and contents for each request
    """
    
    def initial(self, request, *args, **kwargs):  
        set_language(request.headers.get('Accept-Language'))
        return super().initial(request, *args, **kwargs)
     

class IpAddressMixin:
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip