from django.core.exceptions import ValidationError
from django.db import transaction, IntegrityError
from api.courses.models import Course
from api.students.models import Student
from ..models import Enrollment
from ..repositories.enrollment_repository import EnrollmentRepository


class EnrollmentService:
    @staticmethod
    @transaction.atomic
    def enroll_student_in_course(student, course_id):
        course = Course.objects.get(id=course_id)

        # Check if the course has reached its student limit
        current_enrollment_count = Enrollment.objects.filter(course=course).count()
        if current_enrollment_count >= course.max_students:
            raise ValidationError(
                f"The course '{course.name}' has reached its maximum capacity of {course.max_students} students."
            )

        # Attempt to create the enrollment, catching any IntegrityError for duplicate entries
        try:
            return EnrollmentRepository.create_enrollment(student, course)
        except IntegrityError as e:
            if "UNIQUE constraint failed" in str(e):
                raise ValidationError("Already enrolled")
            raise

    @staticmethod
    def enroll_student_in_multiple_courses(student, course_ids):
        for course_id in course_ids:
            EnrollmentService.enroll_student_in_course(student, course_id)

    @staticmethod
    def create_enrollment(student, course):
        return EnrollmentRepository.create_enrollment(student, course)

    @staticmethod
    def get_enrollments_for_student(student):
        return EnrollmentRepository.get_enrollments_for_student(student)

    @staticmethod
    def get_enrollments_for_course(course):
        return EnrollmentRepository.get_enrollments_for_course(course)

    @staticmethod
    def delete_enrollment(enrollment_id):
        enrollment = EnrollmentRepository.get_enrollment_by_id(enrollment_id)
        if not enrollment:
            raise ValidationError("Enrollment not found.")
        EnrollmentRepository.delete_enrollment(enrollment)

    @staticmethod
    def disenroll_student_from_course(student_id, course_id):
        course = Course.objects.get(id=course_id)
        student = Student.objects.get(id=student_id)
        enrollment = EnrollmentRepository.get_enrollment_by_student_and_course(student, course)
        if not enrollment:
            raise ValidationError("Enrollment not found.")
        EnrollmentRepository.delete_enrollment(enrollment)
