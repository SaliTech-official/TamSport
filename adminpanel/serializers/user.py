from rest_framework import serializers
from accounts.models import User
from accounts.models import Profile
from django.contrib.auth.password_validation import validate_password
from django.utils.translation import gettext_lazy as _
from django.db import transaction


class AdminAccessUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_profile.first_name', read_only=True)
    last_name = serializers.CharField(source='user_profile.last_name', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'is_active', 'is_superuser', 'is_author', 'is_seller', 'permissions']

    def get_permissions(self, obj):
        return obj.permissions()


class UserListSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_profile.first_name', read_only=True)
    last_name = serializers.CharField(source='user_profile.last_name', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'is_active', 'permissions']

    def get_permissions(self, obj):
        return obj.permissions()


class UserDeactivateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']

    def update(self, instance, validated_data):
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.save()
        return instance


class UserDetailSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_profile.first_name', read_only=True)
    last_name = serializers.CharField(source='user_profile.last_name', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'phone_number', 'first_name', 'last_name', 'is_active',
            'is_superuser', 'is_author', 'is_seller',
            'created_date', 'updated_date', 'last_login', 'permissions'
        ]

    def get_permissions(self, obj):
        return obj.permissions()


class UserUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user_profile.first_name', required=False, allow_blank=True, max_length=100)
    last_name = serializers.CharField(source='user_profile.last_name', required=False, allow_blank=True, max_length=100)

    class Meta:
        model = User
        fields = ['phone_number', 'first_name', 'last_name', 'is_active', 'is_superuser', 'is_author', 'is_seller']
        extra_kwargs = {
            'phone_number': {'required': False},
            'is_active': {'required': False},
            'is_superuser': {'required': False},
            'is_author': {'required': False},
            'is_seller': {'required': False},
        }

    def validate_phone_number(self, value):
        if len(value) != 11 or not value.isdigit():
            raise serializers.ValidationError(_("شماره موبایل باید 11 رقم و فقط شامل اعداد باشد."))
        # Check uniqueness only if phone number is changed and user exists (for update)
        if self.instance and self.instance.phone_number != value:
            if User.objects.filter(phone_number=value).exists():
                raise serializers.ValidationError(_("این شماره موبایل قبلا ثبت شده است."))
        return value

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('user_profile', {})
        
        with transaction.atomic():
            # Update User fields
            instance.phone_number = validated_data.get('phone_number', instance.phone_number)
            instance.is_active = validated_data.get('is_active', instance.is_active)
            instance.is_superuser = validated_data.get('is_superuser', instance.is_superuser)
            instance.is_author = validated_data.get('is_author', instance.is_author)
            instance.is_seller = validated_data.get('is_seller', instance.is_seller)
            instance.save()

            # Update or create Profile
            profile, created = Profile.objects.get_or_create(user=instance)
            profile.first_name = profile_data.get('first_name', profile.first_name)
            profile.last_name = profile_data.get('last_name', profile.last_name)
            profile.save()

        return instance


class UserChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(write_only=True, required=True)
    repeat_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        return data # No validation here, handled by frontend

    def save(self, **kwargs):
        user = kwargs.get('user', self.context['request'].user) # Get user from kwargs or fallback to request user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class CreateUserSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=100)
    last_name = serializers.CharField(write_only=True, required=False, allow_blank=True, max_length=100)
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'phone_number', 'password', 'first_name', 'last_name',
            'is_superuser', 'is_author', 'is_seller', 'is_active'
        ]
        extra_kwargs = {
            'is_active': {'required': False, 'default': True},
        }

    def validate_phone_number(self, value):
        if len(value) != 11 or not value.isdigit():
            raise serializers.ValidationError(_("شماره موبایل باید 11 رقم و فقط شامل اعداد باشد."))
        if User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(_("این شماره موبایل قبلا ثبت شده است."))
        return value

    def create(self, validated_data):
        phone_number = validated_data.pop("phone_number", '')
        password = validated_data.pop('password')


        with transaction.atomic():
            user = User.objects.create_user(phone_number=phone_number, password=password, **validated_data)

        return user
