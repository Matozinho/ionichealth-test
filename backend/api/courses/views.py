from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from .serializers import CourseSerializer
from drf_yasg.utils import swagger_auto_schema

from .services.courses_service import CourseService


class CourseListView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve a list of all courses",
        responses={200: CourseSerializer(many=True)}
    )
    def get(self, request):
        courses = CourseService.get_all_courses()
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Create a new course",
        request_body=CourseSerializer,
        responses={
            201: CourseSerializer,
            400: "Validation Error"
        }
    )
    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            try:
                course = CourseService.create_course(serializer.validated_data)
                return Response(
                    CourseSerializer(course).data, status=status.HTTP_201_CREATED
                )
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CourseDetailView(APIView):
    @swagger_auto_schema(
        operation_description="Retrieve a specific course by ID",
        responses={200: CourseSerializer, 404: "Not Found"}
    )
    def get(self, request, course_id):
        course = CourseService.get_course(course_id)
        if not course:
            return Response(
                {"error": "Course not found."}, status=status.HTTP_404_NOT_FOUND
            )
        serializer = CourseSerializer(course)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        operation_description="Update an existing course",
        request_body=CourseSerializer,
        responses={200: CourseSerializer, 400: "Validation Error"}
    )
    def put(self, request, course_id):
        serializer = CourseSerializer(data=request.data)

        if serializer.is_valid():
            try:
                course = CourseService.update_course(
                    course_id, serializer.validated_data
                )
                return Response(
                    CourseSerializer(course).data, status=status.HTTP_200_OK
                )
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @swagger_auto_schema(
        operation_description="Delete a course by ID",
        responses={204: "No Content", 404: "Not Found"}
    )
    def delete(self, request, course_id):
        try:
            CourseService.delete_course(course_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
