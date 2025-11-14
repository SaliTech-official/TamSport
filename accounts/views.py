from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from permissions import IsNotAuthenticated
from django.utils.translation import gettext_lazy as _
from django.utils import translation
from .mixins import LocalizationMixin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import RetrieveUpdateAPIView
from django.contrib.auth import get_user_model
from rest_framework.generics import UpdateAPIView

User = get_user_model()

class OtpCodeView(LocalizationMixin, GenericAPIView):
    permission_classes = [IsNotAuthenticated]

    def post(self, request):
        srz_data = self.get_serializer(data=request.data)
        if srz_data.is_valid():
            message = srz_data.save()
            return Response(message, status=status.HTTP_200_OK)
        
        return Response(srz_data.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_serializer_class(self):
        if self.request.query_params.get('send', None):
            return SendOtpCodeSerializer
        else:
            return CheckOtpCodeSerializer
        
    def get_serializer_context(self):
        context = super().get_serializer_context()
        # send reset_password query params for changing the create method behaver when we are using check=True
        context['reset_password'] = self.request.query_params.get('reset_password')
        return context

class RegisterView(LocalizationMixin, GenericAPIView):
    permission_classes = [IsNotAuthenticated]
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        srz_data = self.get_serializer(data=request.data)
        if srz_data.is_valid():
            srz_data.save()
            return Response(srz_data.data, status=status.HTTP_201_CREATED)
        
        return Response(srz_data.errors, status=status.HTTP_400_BAD_REQUEST)



class ChangePasswordView(LocalizationMixin, GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        srz_data = self.get_serializer(data=request.data)
        if srz_data.is_valid(raise_exception=True):
            message = srz_data.update(request.user, srz_data.validated_data)

            return Response(message, status=status.HTTP_200_OK)
        
        return Response(srz_data.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(LocalizationMixin, GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [IsNotAuthenticated]

    def post(self, request):
        srz_data = self.serializer_class(data=request.data)
        if srz_data.is_valid():
            srz_data.save()

            data = {
                'message': _('your password successfully changed!')
            }

            return Response(data, status=status.HTTP_200_OK)
        
        return Response(srz_data.errors, status=status.HTTP_400_BAD_REQUEST)

class UserInfoView(LocalizationMixin, GenericAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        except Exception as e:
            print(f"Error in UserInfoView: {e}")
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileUpdateView(UpdateAPIView):
    serializer_class = UserInfoSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user 
        