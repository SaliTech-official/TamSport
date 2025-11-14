from csv import DictReader
from django_filters import rest_framework as filters
from accounts.models import User
from django.db.models import Q
# from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
from blog.models.partial import Player
from blog.models.article import Team, Article

class UserFilter(filters.FilterSet):
    user_type = filters.CharFilter(method='filter_user_type')
    search = filters.CharFilter(method='filter_search')
    is_active = filters.BooleanFilter(field_name='is_active')

    class Meta:
        model = User
        fields = ['user_type', 'search', 'is_active']

    def filter_user_type(self, queryset, name, value):
        if value == 'is_superuser':
            return queryset.filter(is_superuser=True)
        elif value == 'is_author':
            return queryset.filter(is_author=True)
        elif value == 'is_seller':
            return queryset.filter(is_seller=True)
        elif value == 'normal': # New condition for normal users
            return queryset.filter(is_superuser=False, is_author=False, is_seller=False)
        return queryset

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        
        search_words = value.split()
        query = Q()
        for word in search_words:
            query &= (Q(phone_number__icontains=word) |
                      Q(user_profile__first_name__icontains=word) |
                      Q(user_profile__last_name__icontains=word))
        return queryset.filter(query).distinct()


class PlayerFilter(filters.FilterSet):
    position = filters.CharFilter(field_name='position')
    search = filters.CharFilter(method='filter_search')
    search_language = filters.CharFilter(method='filter_search_language')

    class Meta:
        model = Player
        fields = ['position', 'search', 'search_language']
    
    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        
        # Get search language from request, default to 'fa'
        search_language = self.request.query_params.get('search_language', 'fa')
        
        # Create a filter that targets the appropriate language translation
        if search_language == 'en':
            # Search in English translations
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='en')
            ).distinct()
        else:
            # Default to search in Persian translations
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='fa')
            ).distinct()
    
    def filter_search_language(self, queryset, name, value):
        # This is just a parameter holder for the serializer
        # The actual filtering is done in filter_search
        return queryset


class TeamFilter(filters.FilterSet):
    search = filters.CharFilter(method='filter_search')
    search_language = filters.CharFilter(method='filter_search_language')

    class Meta:
        model = Team
        fields = ['search', 'search_language']
    
    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        search_language = self.request.query_params.get('search_language', 'fa')
        if search_language == 'en':
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='en')
            ).distinct()
        else:
            return queryset.filter(
                Q(translations__name__icontains=value) & Q(translations__language_code='fa')
            ).distinct()
    def filter_search_language(self, queryset, name, value):
        return queryset


class ArticleFilter(filters.FilterSet):
    status = filters.CharFilter(method='filter_status')
    type = filters.CharFilter(field_name='type')
    team = filters.CharFilter(field_name='team')
    search = filters.CharFilter(method='filter_search')
    search_language = filters.CharFilter(method='filter_search_language')

    class Meta:
        model = Article
        fields = ['status', 'type', 'team', 'search', 'search_language']
    
    def filter_search(self, queryset, name, value):
        if not value:
            return queryset
        
        # try:
            # Get search language from request, default to 'fa'
            # search_language = self.request.query_params.get('search_language', 'fa')
            
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
            #     translations__language_code=search_language
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
        search_language = self.request.query_params.get('search_language', 'fa')
        if search_language == 'en':
            return queryset.filter(
                Q(translations__title__icontains=value) & Q(translations__language_code='en')
            ).distinct()
        else:
            return queryset.filter(
                Q(translations__title__icontains=value) & Q(translations__language_code='fa')
            ).distinct()
        
    def filter_status(self, queryset, name, value):
        if not value:
            return queryset

        if value == "ST":  # زمان‌بندی شده = پیش‌نویس + scheduled_publish_at پر
            return queryset.filter(
                status=Article.Status.DRAFT,
                scheduled_publish_at__isnull=False,
            )

        return queryset.filter(status=value)

    def filter_search_language(self, queryset, name, value):
        # This is just a parameter holder for the serializer
        # The actual filtering is done in filter_search
        return queryset 