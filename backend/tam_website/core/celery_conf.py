# import os
# from celery import Celery
# from datetime import timedelta

# # Set the default Django settings module
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# # Create the Celery app
# app = Celery('core')

# # Configure Celery using Django settings
# app.config_from_object('django.conf:settings', namespace='CELERY')

# # Celery settings
# app.conf.update(
#     broker_url='redis://redis:6379/0',
#     result_backend='redis://redis:6379/0',
#     task_serializer='json',
#     accept_content=['json'],
#     result_serializer='json',
#     timezone='Asia/Tehran',
#     result_expires=timedelta(days=1)
# )

# # Auto-discover tasks from all registered Django apps
# app.autodiscover_tasks()
