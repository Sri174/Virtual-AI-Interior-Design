// frontend/src/components/ImageUpload.js
import React, { useState } from 'react';
import axios from 'axios';
import DesignLayout from './DesignLayout';


const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/generate-design/', // Your backend API endpoint
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadedImage(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload Image</button>
      {uploadedImage && (
        <div>
          <h3>Generated Design:</h3>
          {/* Render your design layout here */}
          <DesignLayout layout={uploadedImage} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
