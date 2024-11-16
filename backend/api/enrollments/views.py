from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .services.enrollment_service import EnrollmentService
from .serializers import EnrollmentSerializer
from api.students.models import Student
from api.courses.models import Course
from django.core.exceptions import ValidationError
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class EnrollmentCreateView(APIView):
    @swagger_auto_schema(
        operation_description="Enroll a student in a course",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "student_id": openapi.Schema(
                    type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID
                ),
                "course_id": openapi.Schema(
                    type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID
                ),
            },
        ),
        responses={201: EnrollmentSerializer, 400: "Validation Error"},
    )
    def post(self, request):
        student_id = request.data.get("student_id")
        course_id = request.data.get("course_id")

        try:
            student = Student.objects.get(id=student_id)
            enrollment = EnrollmentService.enroll_student_in_course(student, course_id)
            serializer = EnrollmentSerializer(enrollment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except (Student.DoesNotExist, Course.DoesNotExist):
            return Response(
                {"error": "Student or course not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EnrollmentListView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve all enrollments for a given student or course",
        responses={200: EnrollmentSerializer(many=True)},
    )
    def get(self, request):
        student_id = request.query_params.get("student_id")
        course_id = request.query_params.get("course_id")

        if student_id:
            try:
                student = Student.objects.get(id=student_id)
                enrollments = EnrollmentService.get_enrollments_for_student(student)
            except Student.DoesNotExist:
                return Response(
                    {"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND
                )
        elif course_id:
            try:
                course = Course.objects.get(id=course_id)
                enrollments = EnrollmentService.get_enrollments_for_course(course)
            except Course.DoesNotExist:
                return Response(
                    {"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "Please provide either a student_id or course_id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = EnrollmentSerializer(enrollments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EnrollmentDeleteView(APIView):
    @swagger_auto_schema(
        operation_description="Delete an enrollment by ID",
        responses={204: "No Content", 404: "Not Found"},
    )
    def delete(self, request, enrollment_id):
        try:
            EnrollmentService.delete_enrollment(enrollment_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class DisEnrollByStudentCourseView(APIView):
    @swagger_auto_schema(
        operation_description="Delete an enrollment by student and course",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "student_id": openapi.Schema(
                    type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID
                ),
                "course_id": openapi.Schema(
                    type=openapi.TYPE_STRING, format=openapi.FORMAT_UUID
                ),
            },
        ),
        responses={204: "No Content", 404: "Not Found"},
    )
    def delete(self, request, student_id, course_id):
        try:
            EnrollmentService.disenroll_student_from_course(student_id, course_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
