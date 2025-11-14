from django.urls import path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns
from . import views


router = routers.SimpleRouter()
router.register(r'players', views.PlayerListView, basename='player')
router.register(r'articles', views.AdminArticleListView, basename='article')

urlpatterns = [
    # Admin access
    path('admin-pannel-access/', views.check_admin_access, name='admin-access'),
    
    # Dashboard
    path('admin-dashboard-data/', views.dashboard_stats_view, name='dashboard-stats'),
    
    # User management
    path('users/', views.AdminUserListView.as_view(), name='admin-user-list'),
    path('user-filter-data/', views.UserFilterDataView.as_view(), name='user-filter-data'),
    path('user-deactivate/<int:id>/', views.UserDeactivateView.as_view(), name='user-deactivate'),
    path('user-create/', views.CreateUserView.as_view(), name='user-create'),
    path('user-detail/<int:id>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('user-update/<int:id>/', views.AdminUserUpdateView.as_view(), name='admin-user-update'),
    path('user-change-password/<int:id>/', views.AdminUserChangePasswordView.as_view(), name='admin-user-change-password'),

    # Player management
    path('player-positions/', views.PlayerPositionsView.as_view(), name='player-positions'),
    path('player-delete/<int:player_id>/', views.delete_player, name='player-delete'),
    path('player-create/', views.CreatePlayerView.as_view(), name='player-create'),
    path('player-detail/<int:player_id>/', views.PlayerDetailView.as_view(), name='player-detail'),
    path('player-update/<int:player_id>/', views.UpdatePlayerView.as_view(), name='player-update'),
    
    # Team management
    path('team-list/', views.TeamListView.as_view(), name='team-list'),
    path('team-delete/<int:team_id>/', views.delete_team, name='team-delete'),
    path('team-create/', views.CreateTeamView.as_view(), name='team-create'),
    path('team-detail/<int:team_id>/', views.TeamDetailView.as_view(), name='team-detail'),
    path('team-update/<int:team_id>/', views.UpdateTeamView.as_view(), name='team-detail'),
    
    # Article management
    path('article-filter-data/', views.AdminArticleFilterDataView.as_view(), name='article-filter-data'),
    path('article-create/', views.CreateArticleView.as_view(), name='article-create'),
    path('article-detail/<int:article_id>/', views.ArticleDetailView.as_view(), name='article-detail'),
    path('article-update/<int:article_id>/', views.UpdateArticleView.as_view(), name='article-update'),
    path('article-delete/<int:article_id>/', views.delete_article, name='article-delete'),
]

urlpatterns += router.urls