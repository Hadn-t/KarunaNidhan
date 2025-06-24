import base64
import io
import json
import uuid
import logging

from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from rest_framework.response import Response
from rest_framework import status

from .models import InjuryReport, UploadedImage, Animal
from .serializers import InjuryReportSerializer
from animal.services.gemini_client import analyze_animal_injury

# Set up logger (optional)
logger = logging.getLogger(__name__)


@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        # Handle POST request for uploading image and details
        if 'image' not in request.FILES:
            return JsonResponse({'error': 'No image uploaded'}, status=400)

        try:
            details = request.POST.get('details', '').strip()
            if not details:
                return JsonResponse({'error': 'Details are required'}, status=400)

            image = request.FILES['image']

            # Save image to UploadedImage model
            uploaded_image = UploadedImage.objects.create(image=image)

            # Generate tags dynamically (example logic based on details)
            tags = ["urgent", "help-needed"] if "injured" in details.lower() else ["healthy"]

            # Save to Animal model
            animal = Animal.objects.create(
                image=uploaded_image.image,
                tags=", ".join(tags),
                details=details
            )

            # Return success response
            return JsonResponse({
                'message': 'Image and details uploaded successfully',
                'tags': tags,
                'image_url': animal.image.url,
                'animal_id': animal.id,
            })

        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

    elif request.method == 'GET':
        # Render HTML page for viewing images and details
        animals = Animal.objects.all()
        return render(request, 'animal/image_list.html', {'animals': animals})

    # Handle unsupported methods
    return JsonResponse({'error': 'Invalid method'}, status=405)

# @csrf_exempt
# def image_list(request):
#     # Fetch all Animal objects
#     animals = Animal.objects.all()
#     return render(request, 'animal/image_list.html', {'animals': animals})

@csrf_exempt
def image_list(request):
    try:
        # Fetch all Animal objects
        animals = Animal.objects.all()

        # Preprocess tags for the template
        for animal in animals:
            animal.tags_list = [tag.strip() for tag in animal.tags.split(',')]

        return render(request, 'animal/image_list.html', {'animals': animals})
    except Exception as e:
        # Log and handle errors gracefully
        logger.error(f"Error fetching animal list: {str(e)}")
        return JsonResponse({'error': 'Failed to fetch animal list.'}, status=500)
    
def delete_animal(request, animal_id):
    # Fetch the animal object by ID
    animal = get_object_or_404(Animal, id=animal_id)

    try:
        # Delete the animal object and its associated image
        animal.delete()

        # Return a success response
        return JsonResponse({'message': 'Animal deleted successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'Error deleting animal: {str(e)}'}, status=500)

@csrf_exempt
@require_POST
def test_gemini_analysis(request):
    try:
        image_file = request.FILES.get('image')
        location = request.POST.get('location')  # Expected as JSON string
        user_id = request.POST.get('user_id', 'demo_user')  # fallback for testing

        if not image_file or not location:
            return JsonResponse({"error": "Missing required fields: image or location"}, status=400)

        try:
            location_data = json.loads(location)
            lat = location_data.get('latitude')
            lon = location_data.get('longitude')
        except Exception:
            return JsonResponse({"error": "Invalid location format"}, status=400)

        # Read and encode image
        image_bytes = image_file.read()
        base64_image = base64.b64encode(image_bytes).decode('utf-8')

        # Call Gemini image analysis
        ai_response = analyze_animal_injury(base64_image)

        if not ai_response.get('success'):
            return JsonResponse({"error": ai_response.get('error')}, status=502)

        # Save to DB
        image_name = image_file.name
        report = InjuryReport.objects.create(
            report_id=uuid.uuid4(),
            user_id=user_id,
            image=image_file,  # ✅ This saves the image to MEDIA_ROOT
            location=json.dumps(location_data),
            latitude=lat,
            longitude=lon,
            report_data=ai_response.get('result'),
        )


        # Serialize and return the saved report
        serializer = InjuryReportSerializer(report)
        return JsonResponse({
            "message": "Image analyzed and report saved successfully",
            "report": serializer.data
        }, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

from rest_framework.decorators import api_view

@api_view(['GET'])
def get_all_injury_reports(request):
    reports = InjuryReport.objects.all().order_by('-created_at')
    serializer = InjuryReportSerializer(reports, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)