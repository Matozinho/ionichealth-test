from ..models import Student
from api.courses.models import Course
from api.enrollments.models import Enrollment


class StudentRepository:
    @staticmethod
    def get_all_students():
        return Student.objects.all()

    @staticmethod
    def create_student(student_data):
        return Student.objects.create(**student_data)

    @staticmethod
    def get_student_by_id(student_id):
        try:
            return Student.objects.get(id=student_id)
        except Student.DoesNotExist:
            return None

    @staticmethod
    def get_student_by_cpf(cpf):
        try:
            return Student.objects.get(cpf=cpf)
        except Student.DoesNotExist:
            return None

    @staticmethod
    def update_student(student, student_data):
        for field, value in student_data.items():
            setattr(student, field, value)
        student.save()
        return student

    @staticmethod
    def delete_student(student):
        student.delete()
