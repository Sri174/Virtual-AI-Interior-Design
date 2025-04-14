import React, { useState } from 'react';
import axios from 'axios';
import DesignLayout from './DesignLayout';  // Assuming this component is used to display the design result

const ImageUpload = () => {
  const [image, setImage] = useState(null);               // Preview before upload
  const [selectedImage, setSelectedImage] = useState(null); // File to send
  const [uploadedImage, setUploadedImage] = useState(null); // Response from backend
  const [loading, setLoading] = useState(false);            // Loading state
  const [error, setError] = useState(null);                 // Error state

  // Handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));          // Preview the image
      setSelectedImage(file);                       // Store the file for upload
      setUploadedImage(null);                       // Reset uploaded image preview
      setError(null);                               // Clear error state
    }
  };

  // Handle the upload and API call for generating design
  const handleUpload = async () => {
    if (!selectedImage) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedImage); // Attach selected image file

    try {
      setLoading(true); // Set loading state to true while the request is ongoing

      // Replace the URL below with your actual backend API endpoint for generating designs
      const response = await axios.post(
        'http://localhost:8000/api/generate-design/', // Change this to your backend URL
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Assuming the response contains an image URL or data you want to display
      setUploadedImage(response.data); // Expected response: { image_url: "..." }
    } catch (err) {
      setError('Failed to upload or generate design');
      console.error('Upload error:', err);
    } finally {
      setLoading(false); // Reset loading state once the request is finished
    }
  };

  return (
    <div className="image-upload-container" style={{ padding: '20px', maxWidth: '600px', margin: 'auto'}}>
      <h2>Upload Your Room Image</h2>

      {/* Image upload input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ marginBottom: '10px' }}
      />
      <button
        onClick={handleUpload}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50', // Add styling for button
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {loading ? 'Generating...' : 'Upload Image'}
      </button>

      {/* Display image preview if selected */}
      {image && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Image Preview:</h4>
          <img src={image} alt="Uploaded Preview" style={{ width: '100%', borderRadius: '10px' }} />
        </div>
      )}

      {/* Display error message if there was an issue */}
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {/* Display generated design */}
      {uploadedImage && uploadedImage.image_url && (
        <div>
          <h3>Generated Design:</h3>
          {/* Assuming you have a DesignLayout component to display the design */}
          <DesignLayout layout={uploadedImage} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
