import { useState } from 'react';
import axios from 'axios';

const GenerateImage = () => {
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Preview the uploaded image
    setGeneratedImage(null); // Reset previous generated image
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await axios.post('http://127.0.0.1:8000/api/generate/', formData);
      setGeneratedImage(res.data.image); // Assuming backend returns an image URL
    } catch (err) {
      alert('Error generating design.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-primary">Upload Your Room Photo</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="rounded-lg shadow-md" />
        </div>
      )}
      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-opacity-90"
      >
        {loading ? 'Generating...' : 'Generate Design'}
      </button>

      {generatedImage && (
        <div className="mt-6">
          <h3 className="text-xl mb-2">AI-Generated Room</h3>
          <img src={generatedImage} alt="Generated Room" className="w-full max-w-lg" />
        </div>
      )}
    </div>
  );
};

export default GenerateImage;
