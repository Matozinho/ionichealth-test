from django.test import TestCase
from ..models import Course
from ..repositories.courses_repository import CourseRepository
from datetime import datetime, timedelta


class CourseRepositoryTest(TestCase):
    def setUp(self):
        self.course_data = {
            "name": "Python 101",
            "max_students": 30,
            "begin_date": datetime.now(),
            "end_date": datetime.now() + timedelta(days=30),
        }
        self.course = CourseRepository.create_course(self.course_data)

    def test_get_all_courses(self):
        courses = CourseRepository.get_all_courses()
        self.assertIn(self.course, courses)

    def test_get_course_by_id(self):
        found_course = CourseRepository.get_course_by_id(self.course.id)
        self.assertEqual(found_course, self.course)

    def test_create_course(self):
        self.assertIsInstance(self.course, Course)

    def test_update_course(self):
        updated_course = CourseRepository.update_course(
            self.course, {"name": "Python Advanced"}
        )
        self.assertEqual(updated_course.name, "Python Advanced")

    def test_delete_course(self):
        CourseRepository.delete_course(self.course)
        self.assertIsNone(CourseRepository.get_course_by_id(self.course.id))
