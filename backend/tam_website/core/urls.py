from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('rosetta/', include('rosetta.urls')),
    path('api/auth/', include('accounts.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/admin/', include('adminpanel.urls')),
]
