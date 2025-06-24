from django.db import models
from django.utils.timezone import now
import os

class UploadedImage(models.Model):
    image = models.ImageField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
class Animal(models.Model):
    image = models.ImageField(upload_to='animal_images/')
    tags = models.CharField(max_length=255, blank=True, null=True)
    details = models.TextField(blank=True, null=True)  # Field for animal details
    uploaded_at = models.DateTimeField(default=now) # Add default value

    def delete(self, *args, **kwargs):
        # Delete the image file from the filesystem when the object is deleted
        if self.image:
            # Check if the file exists and delete it
            if os.path.isfile(self.image.path):
                os.remove(self.image.path)
        # Call the parent class's delete method to delete the object from the database
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Animal {self.id} - Tags: {self.tags or 'No Tags'}"


import uuid

class InjuryReport(models.Model):
    report_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=255)  # Can also use ForeignKey if you have a user model
    image_url = models.URLField()
    image = models.ImageField(upload_to='injury_reports/')
    
    location = models.TextField()  # Optional: store raw location JSON
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    report_data = models.TextField()  # Stores Gemini's analysis result
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"InjuryReport {self.report_id} by {self.user_id}"
