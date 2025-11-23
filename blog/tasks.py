# from celery import shared_task
# from django.utils import timezone
# from django.db.models import Q
# import logging

# logger = logging.getLogger(__name__)

# @shared_task
# def publish_scheduled_article(article_id):
#     """
#     Task to publish an article that was scheduled for publication.
#     This task is scheduled using apply_async with an eta parameter.
#     """
#     from .models.article import Article
    
#     try:
#         # Get the article by ID
#         article = Article.objects.get(id=article_id)
        
#         # Check if the article is still in draft status
#         if article.status == Article.Status.DRAFT:
#             # Update the status to published
#             article.status = Article.Status.PUBLISHED
#             article.save()
            
#             return f"Published article: {article.get_title()}"
#         else:
#             return f"Article was already published: {article.get_title()}"
            
#     except Article.DoesNotExist:
#         pass
#     except Exception as e:
#         pass