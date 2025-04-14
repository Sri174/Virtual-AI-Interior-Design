from rest_framework.permissions import AllowAny
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.urls import path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.contrib.auth.models import User
from .models import InteriorDesign, DesignImage
from .serializers import InteriorDesignSerializer, DesignRequestSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import uuid
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from rest_framework.decorators import api_view
from dotenv import load_dotenv
import logging
import tempfile
from .ai_generator import AIDesignGenerator
import os
import base64
import requests

load_dotenv()

STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")

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

def home(request):
    logger.info('Received request to home page')
    return HttpResponse("Welcome to the AI Interior Design App!")

@api_view(['GET'])
def design_api(request):
    return Response({"message": "Design API endpoint working!"})

@api_view(["POST"])
def generate_stable_image(request):
    prompt = request.data.get("prompt")

    headers = {
        "Authorization": f"Bearer {STABILITY_API_KEY}",
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

@api_view(["POST"])
@permission_classes([AllowAny])
def generate_room_image(request):
    prompt = request.data.get("prompt", "a beautiful modern living room")
    headers = {
        "Authorization": f"Bearer {'STABILITY_API_KEY'}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "prompt": prompt,
        "output_format": "url",
        "model": "stable-diffusion-xl-beta-v2-2-2"
    }

    try:
        res = requests.post("https://api.stability.ai/v2beta/stable-image/generate/core", headers=headers, json=payload)
        res.raise_for_status()
        return Response(res.json(), status=res.status_code)
    except requests.exceptions.RequestException as e:
        logger.error(f"Stability API error: {str(e)}")
        return Response({"error": "Failed to generate image"}, status=500)

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

@csrf_exempt
def design_ai_room(request):
    if request.method == 'POST':
        uploaded_image = request.FILES.get('image')
        if not uploaded_image:
            return JsonResponse({'error': 'No image uploaded'}, status=400)

        # Save uploaded image temporarily
        image_path = default_storage.save(uploaded_image.name, uploaded_image)
        image_full_path = os.path.join(settings.MEDIA_ROOT, image_path)

        # Call Stability API here
        with open(image_full_path, 'rb') as image_file:
            response = requests.post(
                'https://api.stability.ai/v2beta/stable-image/generate/core',
                headers={
                    'Authorization': f'Bearer {os.getenv("STABILITY_API_KEY")}',
                },
                files={'image': image_file},
                data={
                    'prompt': 'modern cozy living room with warm lighting and elegant furniture',
                    'mode': 'image-to-image',
                },
            )

        # Delete uploaded image
        default_storage.delete(image_path)

        if response.status_code == 200:
            output = response.json()
            return JsonResponse({'image': output['image']})
        else:
            return JsonResponse({'error': 'AI generation failed'}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_design(request):
    data = request.data
    try:
        serializer = DesignRequestSerializer(data=request.data)
        if serializer.is_valid():
            image_url = 'http://localhost:8000/media/' + str(serializer.validated_data['image'])
            return Response({"image_url": "http://example.com/generated_image.png"})

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

    def post(self, request, *args, **kwargs):
        serializer = DesignRequestSerializer(data=request.data)
        # Get the uploaded image from the request
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "No image provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Save the image temporarily
        temp_image_path = default_storage.save('temp_image.jpg', ContentFile(image_file.read()))

        # Call AI image generation API (example with Stability AI)
        ai_model_api_url = "'https://api.stability.ai/v2beta/stable-image/generate/core'"  # Replace with actual API URL
        headers = {
            "Authorization": f"Bearer {settings.mNzcRYYlkpYsvrFx5t3ZtCFbJBEFJ5mbAWWbeqcXaP3HhW4r}",  # Replace with your API key
            "Content-Type": "application/json",
        }
        data = {
            "image_path": temp_image_path,
            "options": {
                "prompt": "Modern living room with minimalist design",  # Example prompt
                "style": "modern",
            }
        }

        try:
            # Call the AI model's API to generate the image
            response = requests.post(ai_model_api_url, headers=headers, json=data)

            if response.status_code == 200:
                # Process the generated image and send back the URL
                generated_image_url = response.json().get("image_url")  # Adjust based on API response
                return Response({"generated_image": generated_image_url}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to generate image from the model."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({"error": f"Error generating image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if serializer.is_valid():
            image = serializer.validated_data['image']
            filename = f"{uuid.uuid4()}.png"
            save_path = os.path.join(settings.MEDIA_ROOT, 'uploads', filename)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            with open(save_path, 'wb+') as f:
                for chunk in image.chunks():
                    f.write(chunk)

            return Response({
                "message": "Design generated"
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InteriorDesignUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = InteriorDesignSerializer(data=request.data)
        if serializer.is_valid():
            instance = serializer.save()

            uploaded_image_path = instance.uploaded_image.path

            with open(uploaded_image_path, "rb") as f:
                img_base64 = base64.b64encode(f.read()).decode("utf-8")

            response = requests.post(
                "https://api.stability.ai/v2beta/stable-image/generate/core",
                headers={"Authorization": f"Bearer {STABILITY_API_KEY}"},
                json={
                    "prompt": "modern living room with warm lighting",
                    "image": img_base64,
                    "mode": "image-to-image",
                },
            )

            result = response.json()
            generated_img_base64 = result["image"]

            image_data = ContentFile(base64.b64decode(generated_img_base64), name=f'generated_{instance.id}.png')
            instance.generated_image.save(image_data.name, image_data)
            instance.save()

            return Response(InteriorDesignSerializer(instance).data)

        return Response(serializer.errors, status=400)

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
