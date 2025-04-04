from django.db import models

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class DesignRequest(models.Model):
    prompt = models.TextField(blank=True)
    input_image = models.ImageField(upload_to='input_images/', blank=True, null=True)
    output_image = models.ImageField(upload_to='output_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.id} - {self.prompt}"
