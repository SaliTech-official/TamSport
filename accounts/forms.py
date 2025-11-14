from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django.utils.translation import gettext_lazy as _
from .models import User

class CustomUserCreationForm(UserCreationForm):
    """
    A form for creating new users. Includes all the required
    fields, plus a repeated password.
    """
    password1 = forms.CharField(
        label=_("Password"),
        strip=False,
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        help_text=_("Your password must contain at least 8 characters."),
    )
    password2 = forms.CharField(
        label=_("Password confirmation"),
        widget=forms.PasswordInput(attrs={'autocomplete': 'new-password'}),
        strip=False,
        help_text=_("Enter the same password as before, for verification."),
    )

    class Meta:
        model = User
        fields = ('phone_number', 'is_staff', 'is_active', 'is_author', 'is_seller')
        field_classes = {'phone_number': forms.CharField}

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if User.objects.filter(phone_number=phone_number).exists():
            raise forms.ValidationError(_("A user with that phone number already exists."))
        return phone_number

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError(_("The two password fields didn't match."))
        return password2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class CustomUserChangeForm(UserChangeForm):
    """
    A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = None  # Remove the password field from the form

    class Meta:
        model = User
        fields = ('phone_number', 'is_staff', 'is_active', 'is_author', 'is_seller', 'groups', 'user_permissions')
        field_classes = {'phone_number': forms.CharField}

    def clean_phone_number(self):
        phone_number = self.cleaned_data.get('phone_number')
        if User.objects.exclude(pk=self.instance.pk).filter(phone_number=phone_number).exists():
            raise forms.ValidationError(_("A user with that phone number already exists."))
        return phone_number 