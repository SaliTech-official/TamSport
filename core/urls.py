from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('accounts.urls')),
    path('blog/', include('blog.urls')),
    path('admin/', include('adminpanel.urls')),
    # path('rosetta/', include('rosetta.urls')),
]
