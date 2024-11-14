from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from ..models import Course
from datetime import datetime, timedelta


class CourseViewTest(APITestCase):
    def setUp(self):
        self.course_data = {
            "name": "Python 101",
            "max_students": 30,
            "begin_date": (datetime.now()).strftime("%Y-%m-%d"),
            "end_date": (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d"),
        }
        self.course = Course.objects.create(**self.course_data)
        self.list_url = reverse("course-list-create")
        self.detail_url = reverse(
            "course-get-update-delete", kwargs={"course_id": self.course.id}
        )

    def test_get_all_courses(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_course_by_id(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], self.course.name)

    def test_create_course(self):
        response = self.client.post(self.list_url, self.course_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_course(self):
        response = self.client.put(
            self.detail_url,
            {
                **self.course_data,
                "name": "Python Advanced",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Python Advanced")

    def test_delete_course(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Course.objects.filter(id=self.course.id).exists())
