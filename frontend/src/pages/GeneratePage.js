import React, { useState } from 'react';
import axios from 'axios';
import { generateDesign } from "../utils/api";



const Generate = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  axios.post(`${API_BASE}/generate-design/`, formData)


  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setGeneratedImage(null); // clear old result
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!selectedImage || !description) {
      setError('Please upload an image and enter a description.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('description', description);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/generate/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setGeneratedImage(response.data.generated_image_url); // Update with actual key
    } catch (err) {
      console.error(err);
      setError('Something went wrong while generating the design.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C1F33] text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl bg-white text-black rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-[#CC5500] mb-6">Generate Interior Design</h1>
        
        <form onSubmit={handleGenerate} className="space-y-5">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-50 border rounded-xl p-2"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the style or feel you want (e.g., cozy minimalist bedroom)"
            rows={4}
            className="w-full border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC5500]"
          />
          <button
            type="submit"
            className="w-full bg-[#CC5500] text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition"
          >
            {loading ? 'Generating...' : 'Generate Design'}
          </button>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>
      </div>

      {selectedImage && (
        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Original Image:</h2>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Original"
            className="w-64 rounded-xl mx-auto shadow-md"
          />
        </div>
      )}

      {generatedImage && (
        <div className="mt-10 text-center">
          <h2 className="text-lg font-semibold mb-2">AI Generated Design:</h2>
          <img
            src={generatedImage}
            alt="Generated"
            className="w-64 rounded-xl mx-auto shadow-xl border-4 border-[#CC5500]"
          />
        </div>
      )}
    </div>
  );
};

export default Generate;
