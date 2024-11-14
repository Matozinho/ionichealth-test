from django.test import TestCase
from ..models import Student
from ..repositories.students_repository import StudentRepository
from django.db import IntegrityError


class StudentRepositoryTest(TestCase):
    def setUp(self):
        self.student_data = {
            "cpf": "12345678901",
            "name": "Jane Doe",
            "email": "janedoe@example.com",
            "cellphone": "0987654321",
        }

    def test_create_student(self):
        student = StudentRepository.create_student(self.student_data)
        self.assertIsNotNone(student)

    def test_get_student_by_id(self):
        student = StudentRepository.create_student(self.student_data)
        found_student = StudentRepository.get_student_by_id(student.id)
        self.assertEqual(found_student, student)

    def test_update_student(self):
        student = StudentRepository.create_student(self.student_data)
        updated_student = StudentRepository.update_student(
            student, {"name": "Jane Smith"}
        )
        self.assertEqual(updated_student.name, "Jane Smith")

    def test_delete_student(self):
        student = StudentRepository.create_student(self.student_data)
        StudentRepository.delete_student(student)
        self.assertIsNone(StudentRepository.get_student_by_id(student.id))

    def test_duplicate_cpf_raises_error(self):
        StudentRepository.create_student(self.student_data)
        with self.assertRaises(IntegrityError):
            StudentRepository.create_student(
                self.student_data
            )  # Attempt to create with duplicate CPF
