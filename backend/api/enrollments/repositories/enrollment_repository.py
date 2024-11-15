from ..models import Enrollment


class EnrollmentRepository:
    @staticmethod
    def create_enrollment(student, course):
        return Enrollment.objects.create(student=student, course=course)

    @staticmethod
    def get_enrollment_by_student_and_course(student, course):
        return Enrollment.objects.filter(student=student, course=course).first()

    @staticmethod
    def get_enrollments_for_student(student):
        return Enrollment.objects.filter(student=student)

    @staticmethod
    def get_enrollments_for_course(course):
        return Enrollment.objects.filter(course=course)

    @staticmethod
    def delete_enrollment(enrollment):
        enrollment.delete()

    @staticmethod
    def get_enrollment_by_id(enrollment_id):
        return Enrollment.objects.filter(id=enrollment_id).first()
