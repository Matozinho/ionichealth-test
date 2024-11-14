from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from ..models import Student
from api.courses.models import Course


class StudentViewTest(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(
            name="History 101",
            max_students=30,
            begin_date="2024-01-01",
            end_date="2024-12-31",
        )
        self.student_data = {
            "cpf": "12345678901",
            "name": "Bob Brown",
            "email": "bobbrown@example.com",
            "cellphone": "5555555555",
            "courses": [self.course.id],
        }
        self.list_url = reverse("student-list-create")
        self.detail_url = None

    def test_create_student_with_course(self):
        response = self.client.post(self.list_url, self.student_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_student_without_course(self):
        data = self.student_data.copy()
        data["courses"] = []
        response = self.client.post(self.list_url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("At least one course must be selected", response.data["error"])

    def test_create_student_duplicate_cpf(self):
        self.client.post(self.list_url, self.student_data, format="json")
        response = self.client.post(self.list_url, self.student_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("A student with this CPF already exists", response.data["error"])

    def test_retrieve_student(self):
        response = self.client.post(self.list_url, self.student_data, format="json")
        self.detail_url = reverse(
            "student-detail", kwargs={"student_id": response.data["id"]}
        )
        get_response = self.client.get(self.detail_url)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_response.data["cpf"], self.student_data["cpf"])

    def test_update_student(self):
        response = self.client.post(self.list_url, self.student_data, format="json")
        self.detail_url = reverse(
            "student-detail", kwargs={"student_id": response.data["id"]}
        )
        updated_data = {"name": "Bob Brown Updated", "courses": [self.course.id]}
        update_response = self.client.put(self.detail_url, updated_data, format="json")
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["name"], "Bob Brown Updated")

    def test_delete_student(self):
        response = self.client.post(self.list_url, self.student_data, format="json")
        self.detail_url = reverse(
            "student-detail", kwargs={"student_id": response.data["id"]}
        )
        delete_response = self.client.delete(self.detail_url)
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        get_response = self.client.get(self.detail_url)
        self.assertEqual(get_response.status_code, status.HTTP_404_NOT_FOUND)
