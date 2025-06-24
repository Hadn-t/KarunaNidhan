# animal/urls.pycc

from django.urls import path
from animal.views import image_list, upload_image, delete_animal, test_gemini_analysis, get_all_injury_reports

urlpatterns = [
    path('image-list/', image_list, name='image_list'),  # Add this route
    path('upload/', upload_image, name='upload_image'), 
    path('animal/delete/<int:animal_id>/', delete_animal, name='delete_animal'), # Keep the upload route
    path("test-gemini/", test_gemini_analysis, name="test-gemini"),
    path('injury-reports/', get_all_injury_reports, name='get-injury-reports'),

]
