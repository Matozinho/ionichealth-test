from django.urls import path
from .views import EnrollmentCreateView, EnrollmentListView, EnrollmentDeleteView

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
]
