from django.core.exceptions import ValidationError
from django.db.models.deletion import ProtectedError
from ..repositories.courses_repository import CourseRepository


class CourseService:
    @staticmethod
    def create_course(course_data):
        if (
            course_data.get("max_students") is not None
            and course_data.get("max_students") < 1
        ):
            raise ValidationError("The minimum number of students is 1")
        elif course_data.get("begin_date") > course_data.get("end_date"):
            raise ValidationError("The end date must be greater than the start date.")
        else:
            return CourseRepository.create_course(course_data)

    @staticmethod
    def get_all_courses():
        return CourseRepository.get_all_courses()

    @staticmethod
    def get_course(course_id):
        return CourseRepository.get_course_by_id(course_id)

    @staticmethod
    def update_course(course_id, course_data):
        course = CourseRepository.get_course_by_id(course_id)
        if not course:
            raise ValidationError("Course not found.")

        if "max_students" in course_data and course_data["max_students"] <= 0:
            raise ValidationError("Maximum number of students must be positive.")

        return CourseRepository.update_course(course, course_data)

    @staticmethod
    def delete_course(course_id):
        course = CourseRepository.get_course_by_id(course_id)
        if not course:
            raise ValidationError("Course not found.")

        try:
            CourseRepository.delete_course(course)
        except ProtectedError:
            raise ValidationError("Cannot delete a course with active enrollments")
