from django.http import HttpResponse, JsonResponse
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import DesignRequest
from .serializers import DesignRequestSerializer
from django.conf import settings
import logging
import replicate
import tempfile
import os

# Create a logger
logger = logging.getLogger(__name__)

FURNITURE_DB = {
    "modern": ["Sleek Sofa", "Glass Coffee Table", "Minimalist Bookshelf"],
    "minimalist": ["Low-profile Bed", "Simple Dining Table", "Floating Shelves"],
    "vintage": ["Antique Armchair", "Wooden Cabinet", "Retro Lamp"],
}

COLOR_PALETTES = {
    "modern": ["#FFFFFF", "#E0E0E0", "#2196F3"],
    "minimalist": ["#F5F5F5", "#9E9E9E", "#000000"],
    "vintage": ["#FFEBCD", "#8B4513", "#CD853F"],
}



# Home view
def home(request):
    logger.info('Received request to home page')
    return HttpResponse("Welcome to the AI Interior Design App!")


# Upload image view (optional if you use frontend upload form)
@api_view(['POST'])
def upload_image(request):
    logger.info('Received POST request to upload image')
    if 'image' not in request.FILES:
        logger.error('No file uploaded')
        return Response({'error': 'No file uploaded'}, status=400)

    file = request.FILES['image']
    file_name = default_storage.save(f"uploads/{file.name}", file)
    logger.info('Image uploaded successfully')
    return Response({'message': 'File uploaded successfully', 'file_name': file_name})

def register(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({'error': 'email and password required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)


    user = User.objects.create_user(username=email, email=email, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


def generate_design(request):
    image = request.FILES.get('input_image')
    prompt = request.data.get('prompt')
    data = request.data
    theme = data.get('theme', 'modern')
    room_type = data.get('roomType', 'living-room')

    prompt = f"A {theme} {room_type} with {theme} furniture, {COLOR_PALETTES[theme][0]} walls, and stylish decor"

    if not image or not prompt:
        return Response({"error": "Image and prompt required"}, status=400)

    # Simulate AI processing — replace with real AI logic
    output_image_path = handle_ai_image_generation(image, prompt)

    return Response({"output_image_url": request.build_absolute_uri(output_image_path)})


# Generate AI design view
class GenerateDesignView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        logger.info('Received POST request to generate design')
        try:
            image = request.FILES.get('image')
            prompt = request.data.get('prompt', 'make it modern')
            
            if not image:
                logger.error('No image uploaded')
                return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)
                image_data = response.json()["artifacts"][0]["base64"]
                return Response({
                "image": f"data:image/png;base64,{image_data}",
                "colors": COLOR_PALETTES[theme],
                "furniture": FURNITURE_DB[theme]
            })
            
        except Exception as e:
            # ✅ Catch unexpected errors and return 500
            return Response(
                {"error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
                return Response({"error": str(e)}, status=500)
            )        

        # Save uploaded image temporarily
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            for chunk in image.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name

        logger.info('Image uploaded and saved to temporary file')

        # Upload to Replicate
        with open(temp_file_path, "rb") as img_file:
            image_url = replicate.files.upload(img_file)

        logger.info('Image uploaded to replicate')

        # Call the AI model
        output = replicate.run(
            "timothybrooks/instruct-pix2pix:8e16f6b7cf0efec7f16df7f99a91c3b0b90cb23c35b45b2f1cdd6d168119179a",
            input={"image": image_url, "prompt": prompt}
        )

        logger.info('Generated design output')

        return Response({"output_image": output[0]}, status=status.HTTP_200_OK)
