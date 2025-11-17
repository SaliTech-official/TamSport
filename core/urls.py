from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path('', include_docs_urls(title='TAM API Documentation', public=True)),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/admin/', include('adminpanel.urls')),
    # path('rosetta/', include('rosetta.urls')),
]
