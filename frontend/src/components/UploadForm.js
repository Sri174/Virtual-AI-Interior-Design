// ImageUpload.js
import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [designId, setDesignId] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', selectedFile);

    const response = await axios.post('http://localhost:8000/api/upload/', formData);
    setDesignId(response.data.id);
  };

  const handleGenerate = async () => {
    const response = await axios.post('http://localhost:8000/api/generate/', { id: designId });
    console.log("Generated Image URL:", response.data.generated_image);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      {designId && <button onClick={handleGenerate}>Generate Design</button>}
    </div>
  );
}

export default ImageUpload;