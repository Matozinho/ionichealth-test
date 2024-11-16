from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .services.students_service import StudentService
from .serializers import StudentSerializer
from django.core.exceptions import ValidationError
from drf_yasg.utils import swagger_auto_schema
from api.enrollments.serializers import EnrollmentSerializer

class StudentListView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve a list of all students",
        responses={200: StudentSerializer(many=True)}
    )
    def get(self, request):
        students = StudentService.get_all_students()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Create a new student",
        request_body=StudentSerializer,
        responses={
            201: StudentSerializer,
            400: "Validation Error"
        }
    )
    def post(self, request):
        student_data = request.data
        course_ids = student_data.pop("courses", [])

        try:
            student = StudentService.create_student(student_data, course_ids)
            serializer = StudentSerializer(student)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class StudentDetailView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve a specific student by ID",
        responses={200: StudentSerializer, 404: "Not Found"}
    )
    def get(self, request, student_id):
        student, enrollments = StudentService.get_student(student_id)
        if not student:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)
        student_serializer = StudentSerializer(student)
        enrollments_serializer = EnrollmentSerializer(enrollments, many=True)
        data = {
            **student_serializer.data,
            "courses": enrollments_serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Update an existing student",
        request_body=StudentSerializer,
        responses={200: StudentSerializer, 400: "Validation Error"}
    )
    def put(self, request, student_id):
        student_data = request.data
        course_ids = student_data.pop("courses", [])

        try:
            student = StudentService.update_student(student_id, student_data, course_ids)
            serializer = StudentSerializer(student)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        operation_description="Delete a student by ID",
        responses={204: "No Content", 404: "Not Found"}
    )
    def delete(self, request, student_id):
        try:
            StudentService.delete_student(student_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
