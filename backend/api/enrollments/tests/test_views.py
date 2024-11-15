from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.courses.models import Course
from api.students.models import Student


class EnrollmentViewTest(APITestCase):
    def setUp(self):
        self.course1 = Course.objects.create(
            name="History 101",
            max_students=1,
            begin_date="2024-01-01",
            end_date="2024-12-31",
        )
        self.course2 = Course.objects.create(
            name="Biology 101",
            max_students=2,
            begin_date="2024-01-01",
            end_date="2024-12-31",
        )
        self.student = Student.objects.create(
            cpf="12345678901",
            name="Bob Brown",
            email="bobbrown@example.com",
            cellphone="5555555555",
        )
        self.enrollment_url = reverse("enrollment-create")

    def test_enroll_student_in_course_with_capacity_limit(self):
        # First enrollment should succeed
        response1 = self.client.post(
            self.enrollment_url,
            {"student_id": self.student.id, "course_id": self.course1.id},
        )
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # Second enrollment should fail due to capacity limit
        student2 = Student.objects.create(
            cpf="12345678902",
            name="Alice Green",
            email="alicegreen@example.com",
            cellphone="5555555556",
        )
        response2 = self.client.post(
            self.enrollment_url,
            {"student_id": student2.id, "course_id": self.course1.id},
        )
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("maximum capacity", response2.data["error"])

    def test_enroll_student_in_multiple_courses(self):
        # Enroll student in two different courses
        response1 = self.client.post(
            self.enrollment_url,
            {"student_id": self.student.id, "course_id": self.course1.id},
        )
        response2 = self.client.post(
            self.enrollment_url,
            {"student_id": self.student.id, "course_id": self.course2.id},
        )

        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)

    def test_prevent_duplicate_enrollment_in_same_course(self):
        # First enrollment should succeed
        response1 = self.client.post(
            self.enrollment_url,
            {"student_id": self.student.id, "course_id": self.course2.id},
        )
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # Second enrollment in the same course should fail
        response2 = self.client.post(
            self.enrollment_url,
            {"student_id": self.student.id, "course_id": self.course2.id},
        )
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Already enrolled", response2.data["error"])
