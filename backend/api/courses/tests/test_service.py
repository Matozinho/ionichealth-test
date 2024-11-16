from django.test import TestCase
from ..services.courses_service import CourseService
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta
from api.enrollments.models import Enrollment
from api.students.models import Student
from django.db import IntegrityError


class CourseServiceTest(TestCase):
    def setUp(self):
        self.course_data = {
            "name": "Python 101",
            "max_students": 30,
            "begin_date": datetime.now(),
            "end_date": datetime.now() + timedelta(days=30),
        }

    def test_create_course_with_positive_max_students(self):
        course = CourseService.create_course(self.course_data)
        self.assertIsNotNone(course)

    def test_create_course_with_invalid_max_students(self):
        self.course_data["max_students"] = -5
        with self.assertRaises(ValidationError):
            CourseService.create_course(self.course_data)

    def test_update_course(self):
        course = CourseService.create_course(self.course_data)
        updated_course = CourseService.update_course(
            course.id, {"name": "Python Advanced"}
        )
        self.assertEqual(updated_course.name, "Python Advanced")

    def test_delete_course(self):
        course = CourseService.create_course(self.course_data)
        CourseService.delete_course(course.id)
        self.assertIsNone(CourseService.get_course(course.id))

    def test_create_course_with_end_date_before_begin_date(self):
        self.course_data["end_date"] = datetime.now() - timedelta(days=30)
        with self.assertRaises(ValidationError):
            CourseService.create_course(self.course_data)

    # can't delete a course if there is any student enrolled on it
    def test_course_cannot_be_deleted_if_students_enrolled(self):
        student1 = Student.objects.create(
            cpf="12345678901",
            name="John Doe",
            email="johndoe@example.com",
            cellphone="1234567890",
        )
        course = CourseService.create_course(self.course_data)
        Enrollment.objects.create(student=student1, course=course)
        
        with self.assertRaises(ValidationError):
            CourseService.delete_course(course.id)