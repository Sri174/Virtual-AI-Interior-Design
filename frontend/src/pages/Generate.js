import React, { useState } from "react";
import axios from "axios";

const Generate = () => {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!image || !prompt) return;

    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("image", image);

    setLoading(true);
    try {
      const res = await axios.post("https://your-django-backend.onrender.com/generate/", formData);
      setGeneratedImage(`data:image/png;base64,${res.data.image}`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Your Dream Room</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="mb-4"
      />
      <textarea
        className="border rounded p-2 w-80 mb-4"
        placeholder="Describe your room (furniture, color palette, theme)..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={handleGenerate}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        {loading ? "Generating..." : "Generate Room"}
      </button>

      {generatedImage && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">AI Generated Room</h2>
          <img src={generatedImage} alt="Generated Room" className="max-w-md rounded shadow" />
        </div>
      )}
    </div>
  );
};

export default Generate;
