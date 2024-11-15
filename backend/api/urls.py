from django.urls import path, include

urlpatterns = [
    path("", include("api.courses.urls")),
    path("", include("api.students.urls")),
    path("", include("api.enrollments.urls")),
]
