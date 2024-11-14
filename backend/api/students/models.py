import uuid
from django.db import models

class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cpf = models.CharField(max_length=11, unique=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    cellphone = models.CharField(max_length=11)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
