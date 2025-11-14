from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.password_validation import validate_password

def permission_detector(**kwargs):
    user_permissions = []
    permissions_map = {
        'admin': 'ادمین',
        'author': 'نویسنده',
        'seller': 'فروشنده',
    }

    # Check for superuser first as it's the highest privilege
    if kwargs.get('admin', False):
        user_permissions.append(permissions_map['admin'])
    
    if kwargs.get('author', False):
        user_permissions.append(permissions_map['author'])
    
    if kwargs.get('seller', False):
        user_permissions.append(permissions_map['seller'])

    return user_permissions if user_permissions else ['کاربر عادی']



class PasswordValidation:
    def __init__(self, password1, password2) -> None:
        self.password1 = password1
        self.password2 = password2

    def same_password_validation(self):
        if not (self.password1 == self.password2):
            raise serializers.ValidationError({
                'errors': _("passwords must be the same!")
            })
        
    def strong_password_validation(self):
        validate_password(self.password1)

        
    def validate(self):
        self.same_password_validation()
        self.strong_password_validation()



def send_opt_code(phone_number, code):
    print(phone_number, code)