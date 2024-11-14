from django.test import TestCase
from ..models import Student
from django.db import IntegrityError


class StudentModelTest(TestCase):
    def setUp(self):
        self.student_data = {
            "cpf": "12345678901",
            "name": "John Doe",
            "email": "johndoe@example.com",
            "cellphone": "1234567890",
        }

    def test_student_creation(self):
        student = Student.objects.create(**self.student_data)
        self.assertIsInstance(student, Student)

    def test_student_duplicate_cpf(self):
        Student.objects.create(**self.student_data)
        with self.assertRaises(IntegrityError):
            Student.objects.create(
                **self.student_data
            )  # Attempt to create with the same CPF
