from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    enrollment_date = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = "__all__"

    def get_enrollment_date(self, obj):
        # Retrieve enrollment_date from the context, defaulting to None if not available
        enrollment_data = self.context.get("enrollment_data", {})
        return enrollment_data.get(obj.id)  # Use the student ID as the key