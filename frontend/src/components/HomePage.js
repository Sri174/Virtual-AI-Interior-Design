import React, { useState } from 'react';

function HomePage() {
  const [image, setImage] = useState(null);
  const [generatedDesign, setGeneratedDesign] = useState(null);
  const [history, setHistory] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleGenerateDesign = async () => {
    const formData = new FormData();
    formData.append("image", image);

    const response = await fetch("http://127.0.0.1:5000/api/generate-design/", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      setGeneratedDesign(data.generated_image);
      setHistory((prevHistory) => [...prevHistory, data.generated_image]);
    } else {
      console.error("Error generating design");
    }
  };

  return (
    <div>
      <h1>Upload an Image for AI Design</h1>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={handleGenerateDesign}>Generate Design</button>

      {image && <img src={image} alt="Uploaded" width="200" />}
      {generatedDesign && (
        <div>
          <h2>Generated Design:</h2>
          <img src={generatedDesign} alt="Generated" width="200" />
        </div>
      )}

      <div>
        <h2>Design History</h2>
        <ul>
          {history.map((design, index) => (
            <li key={index}>
              <img src={design} alt={`Design ${index + 1}`} width="100" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
