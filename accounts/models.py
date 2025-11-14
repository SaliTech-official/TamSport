from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django_jalali.db import models as jmodels
from .utils import permission_detector
from django_jalali.db.models import datetime
from django.utils import timezone
from django.contrib.auth.base_user import BaseUserManager



class UserManager(BaseUserManager):
    """
    Custom user model manager where phone_number is the unique identifiers
    for authentication instead of usernames.
    """

    def create_user(self, phone_number, password, **extra_fields):
        """
        Create and save a User with the given phone_number and password.
        """
        if not phone_number:
            raise ValueError(_("The phone_number must be set!"))
        
        first_name = extra_fields.pop("first_name", "")
        last_name = extra_fields.pop("last_name", "")
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save()
        profile = Profile(user=user, first_name=first_name, last_name=last_name)
        profile.save()
        return user
    
    def create_superuser(self, phone_number, password, **extra_fields):
        """
        Create and save a SuperUser with the given phone_number and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_author", True)
        extra_fields.setdefault("is_seller", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))
        if extra_fields.get("is_author") is not True:
            raise ValueError(_("Superuser must have is_author=True."))
        if extra_fields.get("is_seller") is not True:
            raise ValueError(_("Superuser must have is_seller=True."))
        
        return self.create_user(phone_number, password, **extra_fields)
    
    def create_authoruser(self, phone_number, password, **extra_fields):
        """
        Create and save an Author user with the given phone_number and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_author", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Author user must have is_staff=True."))

        if extra_fields.get("is_author") is not True:
            raise ValueError(_("Author user must have is_author=True."))
        
        return self.create_user(phone_number, password, **extra_fields)
    
    def create_selleruser(self, phone_number, password, **extra_fields):
        """
        Create and save a Seller user with the given phone_number and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_seller", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Seller user must have is_staff=True."))

        if extra_fields.get("is_seller") is not True:
            raise ValueError(_("Seller user must have is_seller=True."))
        
        return self.create_user(phone_number, password, **extra_fields)

    # query sets

    def active_users(self):
        return self.filter(is_active=True)


class User(AbstractBaseUser, PermissionsMixin):
    # username field
    phone_number = models.CharField(_("phone number"), max_length=11, unique=True)

    # permission fields
    is_active = models.BooleanField(_("is active"), default=False)
    is_staff = models.BooleanField(_("management pannel access"), default=False)
    is_author = models.BooleanField(_("is author"), default=False)
    is_seller = models.BooleanField(_("is seller"), default=False)

    # date fields
    created_date = jmodels.jDateTimeField(_("created date"), auto_now_add=True)
    updated_date = jmodels.jDateTimeField(_("updated date"), auto_now=True)
    last_login = jmodels.jDateTimeField(_("last login"), null=True, blank=True)

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []

    user_permissions_ = {
        "is_author": "نویسنده",
        "is_seller": "فروشنده",
        "is_superuser": "ادمین",
        "normal": "کاربر عادی"
    }

    # manager
    objects = UserManager()

    def __str__(self):
        return self.phone_number


    def permissions(self):
        return permission_detector(admin=self.is_superuser, seller=self.is_seller, author=self.is_author)
    
    
    @property
    def get_profile(self):
        """
        Returns the user profile.
        """
        return getattr(self, 'user_profile', None)

    @classmethod
    def get_user_permissions_dict(cls):
        return cls.user_permissions_


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_profile')
    first_name = models.CharField(_("first name"), max_length=255, null=True, blank=True)
    last_name = models.CharField(_("last name"), max_length=255, null=True, blank=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}" if self.first_name and self.last_name else 'Unknown'
    
    def __str__(self) -> str:
        return self.full_name


class OtpCode(models.Model):
    phone_number = models.CharField(max_length=11)
    code = models.CharField(max_length=128)  # Store the hashed OTP code

    created_at = models.DateTimeField(default=timezone.now)

    @property
    def expire_time(self):
        return (self.created_at + timezone.timedelta(minutes=2)) - timezone.now()

    @property
    def is_expire_time(self):
        return self.expire_time <= timezone.timedelta(0)

    def __str__(self) -> str:
        return f"{self.phone_number} - {self.code}"