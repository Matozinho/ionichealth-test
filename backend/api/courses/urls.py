from django.urls import path
from . import views

urlpatterns = [
    path("course/", views.CourseListView.as_view(), name="course-list-create"),
    path(
        "course/<uuid:course_id>/",
        views.CourseDetailView.as_view(),
        name="course-get-update-delete",
    ),
]
