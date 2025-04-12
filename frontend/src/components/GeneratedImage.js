// GeneratedImage.js
function GeneratedImage({ imageUrl }) {
    return (
      <div>
        {imageUrl && <img src={imageUrl} alt="Generated Design" />}
      </div>
    );
  }import { useState } from 'react';

  const Generate = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    };
  
    const handleSubmit = async () => {
      // Call backend endpoint to get AI-designed image
      console.log("Sending image to backend...");
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
          className="bg-primary text-white px-6 py-2 rounded-xl font-semibold hover:bg-opacity-90"
        >
          Generate Design
        </button>
      </div>
    );
  };
  
  export default Generate;
  