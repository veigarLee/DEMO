from django.db import models

# Create your models here.

class UserModel(models.Model):
    username = models.CharField(max_length=32, unique=True)
    password = models.CharField(max_length=256)

    def verify_password(self, password):
        return self.password == password

