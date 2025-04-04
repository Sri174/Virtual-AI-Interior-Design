from django.http import HttpResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import DesignRequest
from .serializers import DesignRequestSerializer

import logging
import replicate
import tempfile
import os

# Create a logger
logger = logging.getLogger(__name__)


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


# Generate AI design view
class GenerateDesignView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        logger.info('Received POST request to generate design')

        image = request.FILES.get('image')
        prompt = request.data.get('prompt', 'make it modern')

        if not image:
            logger.error('No image uploaded')
            return Response({"error": "No image uploaded."}, status=status.HTTP_400_BAD_REQUEST)

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
