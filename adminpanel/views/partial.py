from rest_framework.generics import *
from rest_framework.response import Response
from ..serializers import *
from permissions import *
from django_filters.rest_framework import DjangoFilterBackend
from ..filters import UserFilter, PlayerFilter, TeamFilter
from rest_framework.views import APIView
from rest_framework import viewsets
from blog.models.partial import Player
from blog.models.article import Team
from .base import BasePagination
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from permissions import *


class PlayerListView(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing or retrieving players.
    """
    queryset = Player.objects.all()
    serializer_class = BilingualPlayerSerializer
    filterset_class = PlayerFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsAuthorAndSuperuser]
    pagination_class = BasePagination
    
    def get_serializer_context(self):
        """
        Add request to serializer context to access query parameters
        """
        context = super().get_serializer_context()
        return context


class PlayerPositionsView(APIView):
    """
    View to return all player positions for filtering.
    """
    permission_classes = [IsAuthorAndSuperuser]

    def get(self, request, format=None):
        """
        Return a list of positions with their English keys and Persian display values.
        """
        positions = {
            '': 'همه‌ی پست‌ها',  # Empty string for "All"
        }
        # Add all position choices
        for choice_key, choice_value in Player.Positions.choices:
            positions[choice_key] = choice_value
        
        return Response(positions)


@api_view(['DELETE'])
@permission_classes([IsAuthorAndSuperuser])
def delete_player(request, player_id):
    """
    Delete a player by ID.
    """
    try:
        player = Player.objects.get(id=player_id)
        player_name = player.get_name()
        player.delete()
        return Response(
            {"message": f"Player '{player_name}' deleted successfully"}, 
            status=status.HTTP_200_OK
        )
    except Player.DoesNotExist:
        return Response(
            {"error": "Player not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class CreatePlayerView(CreateAPIView):
    """
    View for creating a new player
    """
    serializer_class = PlayerCreateSerializer
    permission_classes = [IsAuthorAndSuperuser]
    
    def create(self, request, *args, **kwargs):
        """
        Create a new player with bilingual support
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            player = serializer.save()
            return Response(
                {"message": "بازیکن جدید با موفقیت ایجاد شد.", "id": player.id},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class PlayerDetailView(RetrieveAPIView):
    """
    View for retrieving player details for editing
    """
    queryset = Player.objects.all()
    serializer_class = PlayerDetailSerializer
    permission_classes = [IsAuthorAndSuperuser]
    lookup_url_kwarg = 'player_id'


class UpdatePlayerView(UpdateAPIView):
    """
    View for updating an existing player
    """
    queryset = Player.objects.all()
    serializer_class = PlayerUpdateSerializer
    permission_classes = [IsAuthorAndSuperuser]
    lookup_url_kwarg = 'player_id'
    
    def get_serializer_context(self):
        """
        Add player instance to serializer context
        """
        context = super().get_serializer_context()
        context['player_instance'] = self.get_object()
        return context
    
    def update(self, request, *args, **kwargs):
        """
        Update the player with bilingual support
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "اطلاعات بازیکن با موفقیت بروزرسانی شد."},
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )


class TeamListView(ListAPIView):
    queryset = Team.objects.all()
    serializer_class = BilingualTeamSerializer
    filterset_class = TeamFilter
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsAuthorAndSuperuser]
    pagination_class = BasePagination
    def get_serializer_context(self):
        context = super().get_serializer_context()
        return context

@api_view(['DELETE'])
@permission_classes([IsAuthorAndSuperuser])
def delete_team(request, team_id):
    try:
        team = Team.objects.get(id=team_id)
        team_name = team.get_name()
        team.delete()
        return Response({"message": f"Team '{team_name}' deleted successfully"}, status=status.HTTP_200_OK)
    except Team.DoesNotExist:
        return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateTeamView(CreateAPIView):
    serializer_class = TeamCreateSerializer
    permission_classes = [IsAuthorAndSuperuser]
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            team = serializer.save()
            return Response({"message": "تیم جدید با موفقیت ایجاد شد.", "id": team.id}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamDetailView(RetrieveAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamDetailSerializer
    permission_classes = [IsAuthorAndSuperuser]
    lookup_url_kwarg = 'team_id'


class UpdateTeamView(UpdateAPIView):
    """
    View for updating an existing team
    """ 
    queryset = Team.objects.all()
    serializer_class = TeamUpdateSerializer
    permission_classes = [IsAuthorAndSuperuser]
    lookup_url_kwarg = 'team_id'

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['team_instance'] = self.get_object()
        return context

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "اطلاعات تیم با موفقیت بروزرسانی شد."}, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
