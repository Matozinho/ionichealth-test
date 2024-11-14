from ..repositories.students_repository import StudentRepository
from api.courses.models import Course
from api.enrollments.models import Enrollment
from ..models import Student
from api.enrollments.services.enrollment_service import EnrollmentService
from django.core.exceptions import ValidationError
from django.db import transaction


class StudentService:
    @staticmethod
    def get_all_students():
        return StudentRepository.get_all_students()

    @staticmethod
    @transaction.atomic
    def create_student(student_data, course_ids):
        # Check if a student with the same CPF already exists
        # if StudentRepository.get_student_by_cpf(student_data["cpf"]):
        #     raise ValidationError("A student with this CPF already exists.")

        # Check that at least one course is provided
        if not course_ids:
            raise ValidationError("At least one course must be selected.")

        # Start transaction and attempt to create student and enrollments
        try:
            # Create the student
            student = StudentRepository.create_student(student_data)

            # Enroll the student in the specified courses
            for course_id in course_ids:
                EnrollmentService.enroll_student_in_course(student, course_id)

            return student
        except ValidationError as e:
            # If any error occurs, the transaction will be rolled back
            raise ValidationError(f"Failed to create student and enrollments: {e}")

    @staticmethod
    def get_student(student_id):
        return StudentRepository.get_student_by_id(student_id)

    @staticmethod
    @transaction.atomic
    def update_student(student_id, student_data, course_ids=None):
        student = StudentRepository.get_student_by_id(student_id)
        if not student:
            raise ValidationError("Student not found.")

        # Update the student details
        updated_student = StudentRepository.update_student(student, student_data)

        # If course_ids are provided, update enrollments
        if course_ids is not None:
            Enrollment.objects.filter(student=student).delete()
            for course_id in course_ids:
                course = Course.objects.get(id=course_id)
                Enrollment.objects.create(student=student, course=course)

        return updated_student

    @staticmethod
    def delete_student(student_id):
        student = StudentRepository.get_student_by_id(student_id)
        if not student:
            raise ValidationError("Student not found.")
        StudentRepository.delete_student(student)
