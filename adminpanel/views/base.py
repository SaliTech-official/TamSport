from rest_framework.generics import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ..serializers.user import AdminAccessUserSerializer # Import the new serializer
from ..serializers import *
from rest_framework.decorators import api_view, permission_classes
from accounts.models import User
from permissions import *
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from blog.models import Article, Team, MiddleArticleIpAddress, Player # Import Player model
from django.utils import timezone
from datetime import timedelta



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_admin_access(request):
    """
    Check if the authenticated user has admin access
    """
    is_admin = request.user.is_superuser
    is_author = request.user.is_author
    is_seller = request.user.is_seller
    if is_admin or is_author or is_seller:
        serializer = AdminAccessUserSerializer(request.user)
        return Response({'detail': "Access granted.", 'user': serializer.data}, status=status.HTTP_200_OK)
    return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAuthorAndSuperuser])
def dashboard_stats_view(request):
    """
    Returns comprehensive dashboard data including:
    - Total users
    - Total articles (published and draft)
    - Total teams
    - Total players # Added for player count
    - Total site views
    - Daily view statistics for the last 7 days
    - Recent articles
    - Top viewed articles
    - Top liked articles
    """
    try:
        
        # Basic counts
        users_count = User.objects.count()
        articles_count = Article.objects.count()
        teams_count = Team.objects.count()
        players_count = Player.objects.count() # Get players count
        
        # Calculate total views (unique IP addresses that viewed articles)
        total_views = MiddleArticleIpAddress.objects.values('ipaddress').count()
        
        
        # Article status distribution
        published_articles = Article.objects.filter(status='PB').count()
        draft_articles = Article.objects.filter(status='DR').count()
        
        
        # Get top viewed articles (top 3 by view count)
        top_viewed_articles = []
        viewed_articles = Article.objects.annotate(
            view_count=Count('viewed_articles', distinct=True)
        ).filter(view_count__gt=0).order_by('-view_count')[:3]
        
        for article in viewed_articles:
            top_viewed_articles.append({
                'id': article.id,
                'title': article.get_title('fa') or article.get_title('en'),
                'views': article.view_count,
                'slug': article.slug
            })
        
        # Get top liked articles (top 3 by like count)
        top_liked_articles = []
        liked_articles = Article.objects.annotate(
            like_count=Count('likes', distinct=True)
        ).filter(like_count__gt=0).order_by('-like_count')[:3]
        
        for article in liked_articles:
            top_liked_articles.append({
                'id': article.id,
                'title': article.get_title('fa') or article.get_title('en'),
                'likes': article.like_count,
                'slug': article.slug
            })
        
        return Response({
            'users': users_count,
            'articles': articles_count,
            'teams': teams_count,
            'players': players_count, # Include players count in response
            'total_views': total_views,
            'published_articles': published_articles,
            'draft_articles': draft_articles,
            'top_viewed_articles': top_viewed_articles,
            'top_liked_articles': top_liked_articles
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    

class BasePagination(PageNumberPagination):
    page_size = 8
    page_size_query_param = 'page_size'
    max_page_size = 50
