from django.urls import path
from . import views

urlpatterns = [
    path("student/", views.StudentListView.as_view(), name="student-list-create"),
    path(
        "student/<uuid:student_id>/",
        views.StudentDetailView.as_view(),
        name="student-get-update-delete",
    ),
]
