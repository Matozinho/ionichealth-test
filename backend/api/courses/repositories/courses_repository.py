from ..models import Course


class CourseRepository:
    @staticmethod
    def get_all_courses():
        return Course.objects.all()

    @staticmethod
    def get_course_by_id(course_id):
        try:
            return Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return None

    @staticmethod
    def create_course(course_data):
        return Course.objects.create(**course_data)

    @staticmethod
    def update_course(course, course_data):
        for field, value in course_data.items():
            setattr(course, field, value)
        course.save()
        return course

    @staticmethod
    def delete_course(course):
        course.delete()
