// src/components/UploadForm.jsx
import React, { useState } from "react";
import axios from "axios";

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputImage, setOutputImage] = useState(null); // For response
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:8000/api/upload/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Backend should return base64 image or image URL
      setOutputImage(response.data.image); // If backend returns base64
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-md mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Upload Room Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {isLoading && <p className="mt-4 text-gray-500">Processing...</p>}

      {outputImage && (
        <div className="mt-4">
          <h2 className="text-md font-semibold mb-2">AI Design Output</h2>
          <img src={`data:image/png;base64,${outputImage}`} alt="AI Result" className="rounded-lg border" />
        </div>
      )}
    </div>
  );
};

export default UploadForm;
