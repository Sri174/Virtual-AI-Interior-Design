from django.db import models

class InteriorDesign(models.Model):
    uploaded_image = models.ImageField(upload_to='uploads/')
    generated_image = models.ImageField(upload_to='generated/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class DesignImage(models.Model):
    original_image = models.ImageField(upload_to='uploads/')
    generated_image = models.ImageField(upload_to='generated/', blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class DesignRequest(models.Model):
    prompt = models.TextField(blank=True)
    input_image = models.ImageField(upload_to='input_images/', blank=True, null=True)
    output_image = models.ImageField(upload_to='output_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request {self.id} - {self.prompt}"
