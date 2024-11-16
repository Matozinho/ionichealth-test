from django.urls import path
from .views import EnrollmentCreateView, EnrollmentListView, EnrollmentDeleteView, DisEnrollByStudentCourseView

urlpatterns = [
    path("enrollment/", EnrollmentListView.as_view(), name="enrollment-list"),
    path(
        "enrollment/create/", EnrollmentCreateView.as_view(), name="enrollment-create"
    ),
    path(
        "enrollment/<uuid:enrollment_id>/delete/",
        EnrollmentDeleteView.as_view(),
        name="enrollment-delete",
    ),
    path(
        "enrollment/<uuid:student_id>/<uuid:course_id>/",
        DisEnrollByStudentCourseView.as_view(),
        name="enrollment-disenroll",
    ),
]
