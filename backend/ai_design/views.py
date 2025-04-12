from django.http import HttpResponse, JsonResponse
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from .models import DesignImage, DesignRequest
from django.contrib.auth.models import User
from rest_framework.parsers import MultiPartParser, FormParser
import uuid
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .serializers import DesignRequestSerializer
from django.conf import settings
import logging
import tempfile
from .ai_generator import AIDesignGenerator
import os
import requests

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

def design_api(request):
    if request.method == "POST":
        return JsonResponse({"status": "success"})
    return JsonResponse({"error": "Method not allowed"}, status=405)

@api_view(["POST"])
def generate_stable_image(request):
    prompt = request.data.get("prompt")

    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    payload = {
        "prompt": prompt,
        "output_format": "url",
        "model": "stable-diffusion-xl-beta-v2-2-2"
    }

    res = requests.post("https://api.stability.ai/v2beta/stable-image/generate/core", headers=headers, json=payload)
    return Response(res.json())

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_image(request):
    logger.info('Received POST request to upload image')
    if 'image' not in request.FILES:
        logger.error('No file uploaded')
        return Response({'error': 'No file uploaded'}, status=400)

    file = request.FILES['image']
    design = DesignImage.objects.create(original_image=file)
    logger.info('Image uploaded successfully')
    return Response({
        'message': 'File uploaded successfully',
        'id': design.id,
        'image_url': design.original_image.url
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_design(request):
    try:
        design_id = request.data.get('id')
        prompt = request.data.get('prompt', 'modern interior design')
        theme = request.data.get('theme', 'modern')
        room_type = request.data.get('roomType', 'living-room')

        if not design_id:
            return Response({"error": "Design ID required"}, status=400)

        design = DesignImage.objects.get(id=design_id)
        full_prompt = f"A {theme} {room_type} with {theme} furniture, {COLOR_PALETTES[theme][0]} walls, and stylish decor"

        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            for chunk in design.original_image.chunks():
                temp_file.write(chunk)
            temp_file_path = temp_file.name

        logger.info('Image uploaded and saved to temporary file')

        with open(temp_file_path, "rb") as img_file:
            image_url = replicate.files.upload(img_file)

        logger.info('Image uploaded to replicate')

        output = replicate.run(
            "timothybrooks/instruct-pix2pix:8e16f6b7cf0efec7f16df7f99a91c3b0b90cb23c35b45b2f1cdd6d168119179a",
            input={"image": image_url, "prompt": full_prompt}
        )

        design.generated_image.save(
            os.path.basename(output[0]),
            ContentFile(requests.get(output[0]).content))

        logger.info('Generated design output')

        return Response({
            "output_image": design.generated_image.url,
            "colors": COLOR_PALETTES[theme],
            "furniture": FURNITURE_DB[theme]
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f'Error in generate_design: {str(e)}')
        return Response({"error": str(e)}, status=500)

class GenerateDesignView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            logger.info('Received POST request to generate design')
            image = request.FILES.get('image')
            prompt = request.data.get('prompt', 'make it modern')

            if not image:
                logger.error('No image uploaded')
                return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)

            generator = AIDesignGenerator()
            result = generator.process_image(image)

            return Response({
                'style': result['style'],
                'layout': result['layout'],
                'elements': result['elements']
            })

        except Exception as e:
            logger.error(f'Error in GenerateDesignView: {str(e)}')
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'email and password required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=email, email=email, password=password)
    return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)