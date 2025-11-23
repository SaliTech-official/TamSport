from rest_framework import serializers
from .models import OtpCode, User, Profile
from .mixins import PasswordSerializerMixin
from rest_framework_simplejwt.serializers import *
from django.utils.translation import gettext_lazy as _
import random
from .utils import send_opt_code
from .session import UserInfoSession
from django.utils import timezone
from django.contrib.auth.hashers import make_password as make_otp_code, check_password as check_otp_code
from .utils import PasswordValidation
from django.db import transaction


class SendOtpCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = OtpCode
        fields = ('phone_number',)

    def validate(self, attrs):
        # validate based on reset_password query parameter
        if self.context.get('reset_password'):
            # if user wants to reset his password, then he must to have a account
            if not User.objects.filter(phone_number=attrs['phone_number']).exists():
                raise serializers.ValidationError({
                    'errors': _("User with this phone number doesn't exist!")
                })
        else:
            # if user wants to register, they must not have account already!
            if User.objects.filter(phone_number=attrs['phone_number']).exists():
                raise serializers.ValidationError({
                    'error': _("This phone number is already registered, please log in!")
                })

        return attrs

    def create(self, validated_data):
        otp_code_value = str(random.randint(10000, 99999))  # Generate OTP code
        otp_code, created = OtpCode.objects.get_or_create(
            phone_number=validated_data['phone_number'],
            defaults={
                'code': make_otp_code(otp_code_value),  # Hash the OTP code
                'phone_number': validated_data['phone_number']
            }
        )


        if created:
            # send otp code for the first time (create otp code obj) if it's didn't created before
            res_data = {
                'message': _('OTP code has been sent to your phone number!'),
                'expire_time': otp_code.expire_time
            }
            send_opt_code(validated_data['phone_number'], otp_code_value)
        else:
            # send otp code again (update otp code obj) dependence on otp code obj expire time
            if otp_code.is_expire_time:
                otp_code.created_at = timezone.now()
                otp_code.code = make_otp_code(otp_code_value)  # Hash the new OTP code
                otp_code.save()
                send_opt_code(validated_data['phone_number'], otp_code_value)

            res_data = {
                'message': _('OTP code has already been sent to your phone number!'),
                'expire_time': otp_code.expire_time
            }

        return res_data

class CheckOtpCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = OtpCode
        fields = ('phone_number', 'code')

    def validate(self, attrs):
        otp_code = OtpCode.objects.filter(phone_number=attrs['phone_number']).first()

        if otp_code is None:
            raise serializers.ValidationError({
                'errors': "We haven't sent any code for your phone number!"
            })

        elif otp_code.is_expire_time:
            raise serializers.ValidationError({
                'errors': _("OTP code has expired!")
            })

        elif not check_otp_code(attrs['code'], otp_code.code): 
            raise serializers.ValidationError({
                'errors': _("Invalid OTP code!")
            })

        return attrs

    def create(self, validated_data):
        if self.context.get('reset_password'):
            return {
                'message': _("OTP code was correct!")
            }

        user_session = UserInfoSession(self.context['request'])
        User.objects.create(**user_session.get_user_info)

        # Clear unnecessary information from session and db
        OtpCode.objects.filter(phone_number=validated_data['phone_number']).delete()
        user_session.clear()

        return {
            'message': _('User successfully registered!'),
            'phone_number': validated_data['phone_number'],
        }

class RegisterSerializer(PasswordSerializerMixin, serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = self.context.get('request')

    class Meta:
        model = User
        fields = ('phone_number', 'password', 'password1')

    def validate(self, attrs):
        # Validate the password and check for existing user
        super().validate(attrs)
        if User.objects.filter(phone_number=attrs['phone_number']).exists():
            raise serializers.ValidationError({
                'errors': _("User with this phone number already exists!")
            })
        return attrs

    def create(self, validated_data):
        user_session = UserInfoSession(self.request)
        # Remove password1 (repeat password) from dict because create_user method uses password
        del validated_data['password1']

        # Set user information to session to create user after OTP code checking with phone number
        user_session.set_user_info({
            **validated_data
        })

        return {
            'phone_number': validated_data['phone_number']
        }

class ChangePasswordSerializer(PasswordSerializerMixin, serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)


    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = self.context.get('request').user

    def validate(self, attrs):
        # password validation
        pass_validate = PasswordValidation(attrs['new_password'], attrs['confirm_password'])
        pass_validate.same_password_validation()
        user = self.user
        if not user.check_password(attrs['old_password']):
            raise serializers.ValidationError({'old_password': _('Your password is wrong!')})


        return attrs

    def update(self, instance, validated_data):
        user = self.user
        user.set_password(validated_data['new_password'])
        user.save()

        return {
            'message': _('your password changed successfully!'),
            'phone_number': user.phone_number
        }

class ResetPasswordSerializer(PasswordSerializerMixin, serializers.Serializer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.request = self.context.get("request")

    def create(self, validated_data):
        user = self.request.user
        user.set_password(validated_data['password'])
        user.save()

class UserInfoSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_profile.first_name', read_only=True)
    last_name = serializers.CharField(source='user_profile.last_name', read_only=True)
    permissions = serializers.SerializerMethodField()
    created_date = serializers.DateTimeField(read_only=True)
    updated_date = serializers.DateTimeField(read_only=True)
    last_login = serializers.DateTimeField(read_only=True)

    class Meta:
        model = User
        fields = [
            'phone_number', 'first_name', 'last_name', 'permissions',
            'is_superuser', 'is_author', 'is_seller',
            'created_date', 'updated_date', 'last_login'
        ]

    def get_permissions(self, obj):
        perms = []
        if obj.is_superuser:
            perms.append(_('Admin'))
        if obj.is_author:
            perms.append(_('Author'))
        if obj.is_seller:
            perms.append(_('Seller'))
        return perms if perms else [_('Normal User')]


