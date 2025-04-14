import React, { useState } from 'react';
import axios from 'axios';

const GeneratePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [description, setDescription] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [style, setStyle] = useState('modern');
  const [roomType, setRoomType] = useState('living-room');

  // Handle image generation and form submission
  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError('Please upload an image of your room.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('description', `${style} ${roomType} ${description}`);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8000/api/generate/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setGeneratedImage(response.data.generated_image_url); // Correctly set the generated image
    } catch (err) {
      console.error(err);
      setError('Error generating design. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle image file input change
  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
    setGeneratedImage(null); // Reset generated image when a new image is uploaded
  };

  return (
    <div className="min-h-screen bg-[#2C1F33] text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-white text-black rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-[#CC5500] mb-6">Transform Your Room with AI</h1>
        <p className="text-center text-gray-600 mb-4">
          Upload a photo of your room and let our AI generate stunning interior design ideas instantly.
        </p>

        <form onSubmit={handleGenerate} className="space-y-5">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-gray-50 border rounded-xl p-2"
          />

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-1 font-semibold">Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full p-2 border rounded-xl"
              >
                <option value="modern">Modern</option>
                <option value="minimalist">Minimalist</option>
                <option value="vintage">Vintage</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-1 font-semibold">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full p-2 border rounded-xl"
              >
                <option value="living-room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="office">Home Office</option>
              </select>
            </div>
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional: Add extra details (e.g., bright, cozy, eco-friendly)"
            rows={3}
            className="w-full border p-3 rounded-xl"
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
          <h2 className="text-lg font-semibold mb-2">Uploaded Image</h2>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Original"
            className="w-64 rounded-xl mx-auto shadow-md"
          />
        </div>
      )}

      {generatedImage && (
        <div className="mt-10 text-center">
          <h2 className="text-lg font-semibold mb-2 text-white">AI Generated Design</h2>
          <img
            src={generatedImage}
            alt="Generated"
            className="w-64 rounded-xl mx-auto shadow-xl border-4 border-[#CC5500]"
          />
        </div>
      )}

      <div className="mt-10">
        <a
          href="/generate"
          className="inline-block px-6 py-3 bg-[#CC5500] text-white rounded-full font-semibold text-lg shadow-md hover:opacity-90 transition"
        >
          Try It Now
        </a>
      </div>
    </div>
  );
};

export default GeneratePage;
