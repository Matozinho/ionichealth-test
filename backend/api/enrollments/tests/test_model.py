from django.test import TestCase
from ..models import Enrollment
from api.courses.models import Course
from api.students.models import Student
from django.db import IntegrityError


class EnrollmentModelTest(TestCase):
    def setUp(self):
        self.course = Course.objects.create(
            name="Math 101",
            max_students=2,
            begin_date="2024-01-01",
            end_date="2024-12-31",
        )
        self.student1 = Student.objects.create(
            cpf="12345678901",
            name="John Doe",
            email="johndoe@example.com",
            cellphone="1234567890",
        )
        self.student2 = Student.objects.create(
            cpf="12345678902",
            name="Jane Doe",
            email="janedoe@example.com",
            cellphone="1234567891",
        )

    def test_prevent_duplicate_enrollment_in_same_course(self):
        # Enroll the student in the course
        Enrollment.objects.create(student=self.student1, course=self.course)

        # Attempt to enroll the same student in the same course again
        with self.assertRaises(IntegrityError):
            Enrollment.objects.create(
                student=self.student1, course=self.course
            )  # This should raise an IntegrityError
