# from django.contrib import admin
# from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


# urlpatterns = [
#     path('admin/', admin.site.urls),
#     path('animal/', include('animal.urls')),  # Include animal app's URLs
# ]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# backend/urls.py (root url configuration)

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('animal/', include('animal.urls')),  # Ensure this is correct
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
