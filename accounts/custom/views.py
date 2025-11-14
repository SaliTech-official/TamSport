from rest_framework_simplejwt.views import TokenViewBase
from .serializers import CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenViewBase, TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer, CustomTokenRefreshSerializer


class CustomTokenObtainPairView(TokenViewBase):
    serializer_class = CustomTokenObtainPairSerializer


class CustomTokenRefreshView(TokenRefreshView):
    serializer_class = CustomTokenRefreshSerializer