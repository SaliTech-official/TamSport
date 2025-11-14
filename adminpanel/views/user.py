from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user import UserListSerializer, UserDeactivateSerializer, UserDetailSerializer, UserUpdateSerializer, UserChangePasswordSerializer, CreateUserSerializer
from rest_framework.views import APIView
from accounts.models import User
from permissions import IsSuperUser
from django_filters.rest_framework import DjangoFilterBackend
from .base import BasePagination
from ..filters import UserFilter


class AdminUserListView(ListAPIView):
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = User.objects.all().order_by('-created_date')
    filter_backends = [DjangoFilterBackend]
    filterset_class = UserFilter
    pagination_class = BasePagination


class UserFilterDataView(APIView):
    permission_classes = [IsAuthenticated, IsSuperUser]

    def get(self, request):
        user_permissions = User.get_user_permissions_dict()
        return Response({'user_permissions': user_permissions}, status=status.HTTP_200_OK)


class AdminUserDetailView(RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = User.objects.all()
    lookup_field = 'id'


class AdminUserUpdateView(UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = User.objects.all()
    lookup_field = 'id'


class AdminUserChangePasswordView(UpdateAPIView):
    serializer_class = UserChangePasswordSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = User.objects.all()
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response({'detail': 'گذرواژه با موفقیت تغییر کرد.'}, status=status.HTTP_200_OK)


class CreateUserView(CreateAPIView):
    serializer_class = CreateUserSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'detail': "کاربر با موفقیت ساخته شد!",
                'id': user.id
            }, status=status.HTTP_200_OK)
        return Response({
                'detail': "کاربر با موفقیت ساخته شد!",
                'id': user.id
            }, status=status.HTTP_400_BAD_REQUEST)

class UserDeactivateView(UpdateAPIView):
    serializer_class = UserDeactivateSerializer
    permission_classes = [IsAuthenticated, IsSuperUser]
    queryset = User.objects.all()
    lookup_field = 'id'

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Check if the user is trying to deactivate their own account
        if request.user == instance and not request.query_params.get('force_deactivate') == 'true':
            return Response({'detail': 'You are trying to deactivate your own account. Please confirm in the next step.', 'self_deactivation_pending': True}, status=status.HTTP_200_OK)
        
        # Proceed with normal update if not self-deactivation or if force_deactivate is true
        return super().patch(request, *args, **kwargs)
