from django.test import TestCase
from ..services.students_service import StudentService
from api.courses.models import Course
from django.core.exceptions import ValidationError


class StudentServiceTest(TestCase):
    def setUp(self):
        self.course = Course.objects.create(
            name="English 101",
            max_students=30,
            begin_date="2024-01-01",
            end_date="2024-12-31",
        )
        self.student_data = {
            "cpf": "11223344556",
            "name": "Alice Smith",
            "email": "alicesmith@example.com",
            "cellphone": "1231231234",
        }

    def test_create_student_with_courses(self):
        student = StudentService.create_student(self.student_data, [self.course.id])
        self.assertIsNotNone(student)
        self.assertEqual(student.cpf, self.student_data["cpf"])

    def test_create_student_without_courses_raises_error(self):
        with self.assertRaises(ValidationError):
            StudentService.create_student(self.student_data, [])

    def test_update_student(self):
        student = StudentService.create_student(self.student_data, [self.course.id])
        updated_student = StudentService.update_student(
            student.id, {"name": "Alice Brown"}
        )
        self.assertEqual(updated_student.name, "Alice Brown")

    def test_delete_student(self):
        student = StudentService.create_student(self.student_data, [self.course.id])
        StudentService.delete_student(student.id)
        self.assertIsNone(StudentService.get_student(student.id))
