from rest_framework.generics import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils.translation import get_language, activate as set_language
from blog.serializers import ArticleSerializer, ArticleDetailSerializer, UserProfileBlogUpdateSerializer, UserPasswordBlogChangeSerializer
from permissions import IsAuthor, IsSuperUser, IsAuthorAndSuperuser
from blog.models import Article
from accounts.mixins import LocalizationMixin, IpAddressMixin
from .models import IpAddress
from django_filters import rest_framework as filters
from django.db.models import Count, Q, Case, When, Value, F
# from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from rest_framework.pagination import PageNumberPagination
from .models import Team, Player
from .serializers import TeamSerializer, PlayerSerializer
from accounts.models import Profile
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from accounts.models import User, Profile
from django.db import transaction
from django.utils.translation import gettext_lazy as _


class ArticlePagination(PageNumberPagination):
    page_size = 12
    page_query_param = 'page'

    def get_paginated_response(self, data):
        next_url = None
        if self.page.has_next():
            next_url = self.request.build_absolute_uri(
                self.get_next_link()
            )
        return Response({
            'articles': data,
            'next': next_url,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number
        })


class ArticleFilter(filters.FilterSet):
    type = filters.ChoiceFilter(choices=Article.Type.choices)
    status = filters.ChoiceFilter(choices=Article.Status.choices)
    category = filters.CharFilter(method='filter_category')
    most_viewed = filters.BooleanFilter(method='filter_most_viewed')
    most_popular = filters.BooleanFilter(method='filter_most_popular')
    search = filters.CharFilter(method='filter_search')
    team = filters.CharFilter(method='filter_team')

    class Meta:
        model = Article
        fields = ['type', 'status', 'category', 'most_viewed', 'most_popular', 'search', 'team']

    def filter_category(self, queryset, name, value):
        if value:
            return queryset.filter(category__slug=value)
        return queryset

    def filter_team(self, queryset, name, value):
        if value:
            return queryset.filter(team__id=value)
        return queryset

    def filter_most_viewed(self, queryset, name, value):
        if value:
            return queryset.annotate(
                view_count=Count('hits')
            ).order_by('-view_count')
        return queryset

    def filter_most_popular(self, queryset, name, value):
        if value:
            return queryset.annotate(
                like_count=Count('likes')
            ).order_by('-like_count')
        return queryset

    def filter_search(self, queryset, name, value):
        if value:
            # try:
                # Get the current language from the request
                # language = self.request.META.get('HTTP_ACCEPT_LANGUAGE', 'fa')
                
                # Use 'simple' configuration as a fallback if language-specific config doesn't exist
                # config = 'simple'
                
                # Create search vectors for title and body
                # title_vector = SearchVector('translations__title', weight='A', config=config)
                # body_vector = SearchVector('translations__body', weight='B', config=config)
                
                # Combine vectors
                # search_vector = title_vector + body_vector
                
                # Create search query with proper escaping
                # search_query = SearchQuery(value, config=config)
                
                # Perform the search with ranking
                # return queryset.filter(
                #     translations__language_code=language
                # ).annotate(
                #     rank=SearchRank(search_vector, search_query)
                # ).filter(
                #     rank__gt=0.3
                # ).order_by(
                #     '-rank',  # Sort by search rank first
                #     '-created_date'  # Then by creation date
                # ).distinct()
            # except Exception as e:
                # If search fails, fall back to simple contains search
            return queryset.filter(
                Q(translations__title__icontains=value) |
                Q(translations__body__icontains=value)
            ).distinct()
            
        return queryset


class ArticleListView(ListAPIView):
    """
    View for listing all published articles.
    Supports filtering by type, status, most viewed and most popular.
    Supports pagination with page parameter.
    Supports search by title and body in the current language.
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ArticleFilter
    pagination_class = ArticlePagination

    def get_queryset(self):
        queryset = super().get_queryset()
        # Optimize category prefetching for list view
        return queryset.prefetch_related(
            'team',
            'team__translations',
            'article_images',
            'hits',
            'likes'
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['list'] = True
        return context

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        if not queryset.exists():
            return Response({
                'detail': 'no articles found!',
                'articles': [],
                'next': None,
                'total_pages': 0,
                'current_page': 1
            }, status=status.HTTP_200_OK)
        
        # Check if fetch-all parameter is present
        fetch_all = request.query_params.get('fetch-all', 'false').lower() == 'true'
        if fetch_all:
            # Get the requested page number
            page_number = int(request.query_params.get('page', 1))
            # Calculate the number of items to return (page_size * page_number)
            items_to_return = self.pagination_class.page_size * page_number
            # Get articles up to the requested page
            articles = queryset[:items_to_return]
            serializer = self.get_serializer(articles, many=True)
            
            # Calculate next URL if there are more pages
            next_url = None
            if queryset.count() > items_to_return:
                next_page = page_number + 1
                next_url = request.build_absolute_uri(f"{request.path}?page={next_page}")
            
            return Response({
                'articles': serializer.data,
                'next': next_url,
                'total_pages': page_number,
                'current_page': page_number
            })
            
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ArticleDetailView(IpAddressMixin, RetrieveAPIView):
    """
    View for retrieving a single published article by slug.
    Supports language selection via query parameter 'lang' (defaults to 'fa').
    """
    serializer_class = ArticleSerializer
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED)
    lookup_field = 'slug'


    def retrieve(self, request, *args, **kwargs):
        article = self.get_object()
        ip = self.get_client_ip(request)
        if not article.hits.filter(ip=ip).exists():
            ipaddress_obj = IpAddress.objects.get_or_create(
                ip=ip
            )
            article.hits.add(ipaddress_obj[0])
            article.save()
    
        # Serialize main article (detail context)
        main_data = self.get_serializer(article, context={ "client_ip": ip }).data

        # Fetch up to 3 related articles by the same team (exclude current)
        related_qs = Article.objects.filter(status=Article.Status.PUBLISHED)
        if article.team_id:
            related_qs = related_qs.filter(team_id=article.team_id)
        else:
            related_qs = related_qs.none()
        related_qs = related_qs.exclude(id=article.id).order_by('-created_date')[:3]

        # Serialize related articles in list context so list fields (like slug) are preserved
        related_data = ArticleSerializer(related_qs, many=True, context={ 'request': request, 'list': True }).data

        # Attach related articles to the response payload
        main_data['relatedArticles'] = related_data

        return Response(main_data)


class CreateArticleView(LocalizationMixin, CreateAPIView):
    """
    View for creating new articles. Only authenticated authors can create articles.
    """
    serializer_class = ArticleDetailSerializer
    permission_classes = [IsAuthor]

    def perform_create(self, serializer):
        # Get or create profile for the user
        profile = Profile.objects.get_or_create(user=self.request.user)
        serializer.save(author=profile)


class UpdateArticleView(LocalizationMixin, GenericAPIView):
    """
    View for updating an existing article. Only the author can update their own articles.
    """
    serializer_class = ArticleDetailSerializer
    permission_classes = [IsAuthor]
    queryset = Article.objects.all()
    lookup_field = 'slug'


    def patch(self, request, slug):
        srz_data = self.serializer_class(self.get_object(), data=request.data, partial=True)
        if srz_data.is_valid():
            return Response(srz_data.data, status=status.HTTP_206_PARTIAL_CONTENT)
        return Response(srz_data.errors, status=status.HTTP_400_BAD_REQUEST)



class DeleteArticleView(LocalizationMixin, APIView):
    """
    View for deleting an existing article. Only the author can delete their own articles.
    """
    permission_classes = [IsAuthor]

    def delete(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        self.check_object_permissions(request, article)
        article.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ArticleListForAuthorsView(ArticleListView):
    """
    View for listing all articles for authors, including drafts and rejected articles.
    Only shows articles belonging to the requesting author.
    """
    permission_classes = [IsAuthor]
    
    def get_queryset(self):
        # Get the user's profile
        profile = Profile.objects.get_or_create(user=self.request.user)
        return Article.objects.filter(author=profile)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['preview_article'] = True
        return context


class ArticleDetailForAuthorsView(ArticleDetailView):
    """
    View for authors to retrieve any of their articles regardless of status.
    Only allows access to articles belonging to the requesting author.
    """
    permission_classes = [IsAuthor, IsSuperUser]

    def get_queryset(self):
        # Get the user's profile
        profile = Profile.objects.get_or_create(user=self.request.user)
        return Article.objects.filter(author=profile)
    

    def retrieve(self, request, *args, **kwargs):
        """
        override retrieve method with no changes for preventing view count increment in preview 
        """
        article:Article = self.get_object()
        serializer = self.get_serializer(article)
        return Response(serializer.data)


class ArticleLikeView(IpAddressMixin, APIView):
    """
    View for liking an article.
    """
    def get(self, request, slug):
        article = get_object_or_404(Article, slug=slug)
        ip_obj = IpAddress.objects.get(ip=self.get_client_ip(request))
        if not article.likes.filter(ip=ip_obj.ip).exists():
            article.likes.add(ip_obj)
            article.save()
        else:
            article.likes.remove(ip_obj)
            article.save()
        return Response(status=status.HTTP_200_OK)


class HomeDataView(LocalizationMixin, APIView):
    def get(self, request):
        try:
            # Get latest 5 articles
            articles = Article.objects.filter(Q(status='PB') & Q(type="TX")).order_by('-created_date')[:5]
            articles_data = ArticleSerializer(articles, many=True, context={'request': request, "list": True}).data

            # Get latest videos
            videos = Article.objects.filter(status='PB', type='VD').order_by('-created_date')[:5]
            videos_data = ArticleSerializer(videos, many=True, context={'request': request, "list": True}).data

            # Get all teams
            teams = Team.objects.all()
            teams_data = TeamSerializer(teams, many=True, context={'request': request}).data

            # Get all players
            players = Player.objects.all()
            players_data = PlayerSerializer(players, many=True, context={'request': request}).data

            return Response({
                'articles': articles_data,
                'videos': videos_data,
                'tam_teams': teams_data,
                'players': players_data
            })
        except Exception as e:
            print(e)
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ArticleFilterDataView(APIView):
    """
    View to return all article filter options.
    """

    # Define explicit mappings for translations
    ARTICLE_TYPE_TRANSLATIONS = {
        'en': {
            '': 'All Types',
            'TX': 'Text',
            'SS': 'Slide Show',
            'VD': 'Video',
        },
        'fa': {
            'TX': 'عادی',
            'SS': 'اسلایدشو',
            'VD': 'ویدیو',
            '': 'همه نوع‌ها',
        },
    }

    ARTICLE_STATUS_TRANSLATIONS = {
        'en': {
            '': 'All Statuses',
            'ST': 'Scheduled',
            'DR': 'Draft',
            'PB': 'Published',
        },
        'fa': {
            '': 'همه وضعیت‌ها',
            'ST': 'زمان بندی شده',
            'DR': 'پیش نویس',
            'PB': 'منتشر شده',
        },
    }

    def get(self, request, format=None):
        """
        Return filter options for type, status, and teams.
        """
        current_language = get_language()

        # Article Type options (sent as 'status' in response for frontend compatibility)
        article_type_options = {}
        translated_article_types = self.ARTICLE_TYPE_TRANSLATIONS.get(current_language, self.ARTICLE_TYPE_TRANSLATIONS['en'])
        for choice_key, choice_value in Article.Type.choices:
            article_type_options[choice_key] = translated_article_types.get(choice_key, self.ARTICLE_TYPE_TRANSLATIONS['en'].get(choice_key, choice_value))
        
        if '' not in article_type_options:
            article_type_options[''] = translated_article_types.get('', self.ARTICLE_TYPE_TRANSLATIONS['en'][''])

        # Article Status options (sent as 'type' in response for frontend compatibility)
        article_status_options = {}
        translated_article_statuses = self.ARTICLE_STATUS_TRANSLATIONS.get(current_language, self.ARTICLE_STATUS_TRANSLATIONS['en'])
        for choice_key, choice_value in Article.Status.choices:
            if request.query_params.get("filter_page", False) and choice_key == 'ST':
                article_status_options["ST"] = translated_article_statuses.get('ST', self.ARTICLE_STATUS_TRANSLATIONS['en']['ST'])
            else:
                article_status_options[choice_key] = translated_article_statuses.get(choice_key, self.ARTICLE_STATUS_TRANSLATIONS['en'].get(choice_key, choice_value))
        
        if '' not in article_status_options:
            article_status_options[''] = translated_article_statuses.get('', self.ARTICLE_STATUS_TRANSLATIONS['en'][''])
        
        # Team options
        teams_data = {}
        teams_data[''] = 'All Teams' if current_language == 'en' else 'همه تیم‌ها'
        
        # Get all teams and add to options
        teams = Team.objects.all()
        for team in teams:
            # Get translated team name based on current language
            team_name = team.safe_translation_getter('name', language_code=current_language, default=team.safe_translation_getter('name', any_language=True))
            
            teams_data[str(team.id)] = team_name
        
        return Response({
            'status': article_type_options, # Frontend expects 'status' key for article types
            'type': article_status_options, # Frontend expects 'type' key for article statuses
            'teams': teams_data
        })


class PlayerPreRegisterView(APIView):
    """
    API endpoint for player pre-registration.
    Receives form data and sends it as an email.
    """
    def post(self, request, *args, **kwargs):
        full_name = request.data.get('fullName')
        phone_number = request.data.get('phone')
        age = request.data.get('age')
        sport = request.data.get('sport')

        if not all([full_name, phone_number, age, sport]):
            return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)

        subject = 'پیش ثبت نام سایت تام'
        message = (
            f'بازیکن جدید پیش ثبت نام کرد:\n'
            f'نام و نام خانوادگی: {full_name}\n'
            f'شماره تلفن همراه: {phone_number}\n'
            f'سن: {age}\n'
            f'رشته ورزشی: {sport}'
        )
        from_email = settings.EMAIL_HOST_USER  # Use the configured email address
        recipient_list = ['tamisfahan@gmail.com']
        print(subject, message, from_email, recipient_list)
        try:
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)
            return Response({'message': 'Pre-registration successful!'}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error sending email: {e}")
            return Response({
                'error': 'Failed to send pre-registration email.',
                'detail': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfileBlogUpdateView(UpdateAPIView):
    serializer_class = UserProfileBlogUpdateSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    
    def get_object(self):
        return self.request.user


class UserPasswordBlogChangeView(UpdateAPIView):
    serializer_class = UserPasswordBlogChangeSerializer
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user
