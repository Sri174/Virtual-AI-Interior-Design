import React, { useState } from 'react';
import axios from 'axios';

const DesignForm = () => {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [outputImage, setOutputImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOutputImage(null);

    const formData = new FormData();
    formData.append('image', image);
    formData.append('prompt', prompt);

    try {
      const response = await axios.post('http://localhost:8000/api/generate-design/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setOutputImage(response.data.output_image || response.data.output_image_url);
    } catch (error) {
      console.error('Error generating design:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Generate AI Interior Design</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-2"
          required
        />
        <br />
        <input
          type="text"
          placeholder="Enter a design prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-2 border p-2 w-full"
          required
        />
        <br />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? 'Generating...' : 'Generate Design'}
        </button>
      </form>

      {outputImage && (
        <div className="mt-4">
          <h3 className="font-semibold">Generated Design:</h3>
          <img src={outputImage} alt="Generated Design" className="w-full max-w-md mt-2" />
        </div>
      )}
    </div>
  );
};

export default DesignForm;
