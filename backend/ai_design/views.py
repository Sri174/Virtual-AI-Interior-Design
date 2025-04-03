from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.http import HttpResponse

@api_view(['POST'])
def upload_image(request):
    if 'image' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=400)

    file = request.FILES['image']
    file_name = default_storage.save(f"uploads/{file.name}", file)
    return Response({'message': 'File uploaded successfully', 'file_name': file_name})
def home(request):
    return HttpResponse("Welcome to the AI Interior Design App!")
