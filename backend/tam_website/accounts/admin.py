# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from django.utils.translation import gettext_lazy as _
# from .forms import CustomUserCreationForm, CustomUserChangeForm
# from .models import *
# from django_jalali.admin.filters import JDateFieldListFilter
# from django.contrib.sessions.models import Session

# # --- اضافه کردن اینلاین پروفایل ---
# class ProfileInline(admin.StackedInline):
#     model = Profile
#     can_delete = False
#     fk_name = 'user'
#     extra = 0
#     verbose_name = 'پروفایل کاربر'
#     verbose_name_plural = 'پروفایل کاربر'

# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     add_form = CustomUserCreationForm
#     form = CustomUserChangeForm
#     model = User

#     def get_created_date(self, obj):
#         if obj.created_date:
#             return obj.created_date.strftime("%Y/%m/%d in %H:%M:%S")
#         return None

#     def get_updated_date(self, obj):
#         if obj.updated_date:
#             return obj.updated_date.strftime("%Y/%m/%d in %H:%M:%S") 
#         return None

#     def get_last_login(self, obj):
#         if obj.last_login:
#             return obj.last_login.strftime("%Y/%m/%d in %H:%M:%S")
#         return None

#     get_created_date.short_description = 'Created Date'
#     get_updated_date.short_description = 'Updated Date'
#     get_last_login.short_description = 'Last Login'

#     list_display = ('phone_number', 'is_staff', 'is_active', 'is_author', 'is_seller', 'get_created_date', 'get_updated_date')
#     list_filter = (
#         'is_staff',
#         'is_active',
#         'is_author',
#         'is_seller', 
#         ('created_date', JDateFieldListFilter),
#         ('updated_date', JDateFieldListFilter),
#     )

#     fieldsets = (
#         (None, {'fields': ('phone_number', 'password')}),
#         ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_author', 'is_seller', 'groups', 'user_permissions')}),
#         ('Important dates', {'fields': ('get_last_login', 'get_created_date', 'get_updated_date')}),
#     )

#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('phone_number', 'password1', 'password2', 'is_staff', 'is_active', 'is_author', 'is_seller')}
#         ),
#     )

#     readonly_fields = ('get_last_login', 'get_created_date', 'get_updated_date')
#     search_fields = ('phone_number',)
#     ordering = ('phone_number',)

#     inlines = [ProfileInline]


# @admin.register(Profile)
# class ProfileAdmin(admin.ModelAdmin):
#     list_display = ('full_name', 'user')
#     search_fields = ('full_name', 'user__phone_number')


# @admin.register(Session)
# class SessionAdmin(admin.ModelAdmin):
#     def _session_data(self, obj):
#         return obj.get_decoded()
#     list_display = ['session_key', '_session_data', 'expire_date']
#     readonly_fields = ['_session_data']


# @admin.register(OtpCode)
# class OtpCode(admin.ModelAdmin):

#     def get_expire_time(self, obj):
#         return obj.expire_time

#     def get_is_expire_time(self, obj):
#         return obj.is_expire_time


#     list_display = ['phone_number', 'code']
#     readonly_fields = ('get_expire_time', 'get_is_expire_time')

