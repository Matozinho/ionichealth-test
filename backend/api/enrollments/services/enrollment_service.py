from django.core.exceptions import ValidationError
from api.courses.models import Course
from ..models import Enrollment


class EnrollmentService:
    @staticmethod
    def enroll_student_in_course(student, course_id):
        # Fetch the course instance
        course = Course.objects.get(id=course_id)

        # # Check if the student is already enrolled in this course
        # if Enrollment.objects.filter(student=student, course=course).exists():
        #     raise ValidationError(
        #         f"Student is already enrolled in the course: {course.name}"
        #     )

        # Check if the course has reached its student limit
        current_enrollment_count = Enrollment.objects.filter(course=course).count()
        if current_enrollment_count >= course.max_students:
            raise ValidationError(
                f"The course '{course.name}' has reached its maximum capacity of {course.max_students} students."
            )

        # Create the enrollment if all validations pass
        Enrollment.objects.create(student=student, course=course)
