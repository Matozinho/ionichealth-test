from django.test import TestCase
from ..services.enrollment_service import EnrollmentService
from api.courses.models import Course
from api.students.models import Student
from django.core.exceptions import ValidationError


class EnrollmentServiceTest(TestCase):
    def setUp(self):
        self.course1 = Course.objects.create(
            name="Math 101",
            max_students=1,
            begin_date="2024-01-01",
            end_date="2024-12-31",
        )
        self.course2 = Course.objects.create(
            name="Science 101",
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

    def test_course_max_student_capacity(self):
        # Enroll the first student successfully
        EnrollmentService.enroll_student_in_course(self.student1, self.course1.id)

        # Attempt to enroll a second student in a full course
        with self.assertRaises(ValidationError) as context:
            EnrollmentService.enroll_student_in_course(self.student2, self.course1.id)

        self.assertIn("has reached its maximum capacity", str(context.exception))

    def test_student_can_be_enrolled_in_multiple_courses(self):
        enrollment1 = EnrollmentService.enroll_student_in_course(
            self.student1, self.course1.id
        )
        enrollment2 = EnrollmentService.enroll_student_in_course(
            self.student1, self.course2.id
        )

        self.assertIsNotNone(enrollment1)
        self.assertIsNotNone(enrollment2)

    def test_prevent_duplicate_enrollment_in_same_course(self):
        EnrollmentService.enroll_student_in_course(self.student1, self.course2.id)

        with self.assertRaises(ValidationError) as context:
            EnrollmentService.enroll_student_in_course(self.student1, self.course2.id)

        self.assertIn("Already enrolled", str(context.exception))
