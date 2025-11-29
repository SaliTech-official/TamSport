# from .models import *
# from django.contrib import admin
# from django_jalali.admin.filters import JDateFieldListFilter
# from parler.admin import TranslatableAdmin


# @admin.register(Article)
# class ArticleAdmin(TranslatableAdmin):   
#     def get_created_date(self, obj):
#         if obj.created_date:
#             return f"Jalali: {obj.date_format('created_date')}"
#         return None

#     def get_updated_date(self, obj):
#         if obj.updated_date:
#             return f"Jalali: {obj.date_format('updated_date')}"
#         return None

#     get_created_date.short_description = 'Created Date'
#     get_updated_date.short_description = 'Updated Date'

#     list_display = ('get_title', 'author', 'status')
#     list_filter = (
#         'status',
#         'author',
#         ('created_date', JDateFieldListFilter),
#         ('updated_date', JDateFieldListFilter),
#     )
#     search_fields = ('translations__title', 'translations__body')
#     ordering = ('-created_date',)
#     date_hierarchy = 'created_date'
#     readonly_fields = ('get_created_date', 'get_updated_date', 'slug')

# @admin.register(Category)
# class CategoryAdmin(TranslatableAdmin):
#     list_display = ('name', 'description')
#     search_fields = ('translations__name', 'translations__description')
#     ordering = ('translations__name',)
#     # fieldsets = (
#     #     (None, {
#     #         'fields': ('image', 'name', 'description')
#     #     }),
#     # )

# @admin.register(Player)
# class PlayerAdmin(TranslatableAdmin):
#     list_display = ('name', 'number', 'position', 'goals', 'games')
#     search_fields = ('name', 'position')


#     def get_category_slug(self, obj: Article):
#         if obj.slug:
#             return obj.safe_translation_getter("slug", language_code="en", default="")
#         return None

#     get_category_slug.short_description = 'category slug'

# @admin.register(Team)
# class PlayerAdmin(TranslatableAdmin):
#     list_display = ('name', )
#     search_fields = ('name', 'slug')


# admin.site.register(IpAddress)
# admin.site.register(MiddleArticleIpAddress)
# admin.site.register(Image)

