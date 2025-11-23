from django.urls import path
from .custom import views as custom_views
from rest_framework_simplejwt.views import TokenRefreshView
from . import views
from .views import UserProfileUpdateView


urlpatterns = [
    path('get-access-token/', custom_views.CustomTokenObtainPairView.as_view(), name='access-token'),
    path('get-refresh-token/', custom_views.CustomTokenRefreshView.as_view(), name='refresh-token'),
    path('otp_code/', views.OtpCodeView.as_view(), name='otp_code'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('change_password/',views.ChangePasswordView.as_view(), name='change-password'),
    path('user/', views.UserInfoView.as_view(), name='user-info'),
    path('profile/', UserProfileUpdateView.as_view(), name='user-profile-update'),
]