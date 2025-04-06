// src/components/DesignForm.js
import React, { useState } from "react";

const DesignForm = () => {
  const [image, setImage] = useState(null);
  const [inputImageUrl, setInputImageUrl] = useState(null);
  const [prompt, setPrompt] = useState("Make it modern");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setInputImageUrl(previewUrl);
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !prompt) {
      setError("Please upload an image and enter a prompt.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImageUrl(null);
    
  const handleGenerateDesign = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("input_image", image);
    formData.append("prompt", prompt);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-design/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image generation failed");
      }

      const data = await response.json();

      if (data.output_image_url) {
        setGeneratedImageUrl(data.output_image_url);
      } else {
        setError("Generation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error generating design:", error);
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md space-y-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Upload Image & Generate Design
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Enter your design prompt"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Generating..." : "Generate Design"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {inputImageUrl && (
        <div>
          <p className="font-semibold">Uploaded Image:</p>
          <img src={inputImageUrl} alt="Input" className="w-full rounded shadow" />
        </div>
      )}

      {generatedImageUrl && (
        <div>
          <p className="font-semibold mt-4">Generated Design:</p>
          <img src={generatedImageUrl} alt="Output" className="w-full rounded shadow" />
          <a href={generatedImageUrl} download="generated.jpg">
            <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Download Design
            </button>
          </a>
        </div>
      )}
    </div>
  );
};
}
export default DesignForm;
