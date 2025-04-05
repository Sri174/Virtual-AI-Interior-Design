import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./config";
import UploadForm from "./components/UploadForm";
import DesignForm from './components/DesignForm';

function App() {
    const [message, setMessage] = useState("");
    const [image, setImage] = useState(null); // For storing selected image
    const [prompt, setPrompt] = useState("make it modern"); // Default prompt
    const [inputImageUrl, setInputImageUrl] = useState(null); // For preview
    const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // For resul
    const [loading, setLoading] = useState(false); // For showing loading spinner



    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
        const handleImageChange = (e) => {
            const file = e.target.files[0];
            setImage(file);
          
            if (file) {
              const previewUrl = URL.createObjectURL(file); // browser URL
              setInputImageUrl(previewUrl); // Show image preview
            }
            const handleSubmit = async (e) => {
                e.preventDefault(); // prevent page refresh
              
                const formData = new FormData();
                formData.append("input_image", image);
                formData.append("prompt", prompt);
              
                setLoading(true); // show "Generating..." text
              
                fetch("http://127.0.0.1:8000/api/generate-design/", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => res.json())
                  .then((data) => {
                    setGeneratedImageUrl(data.output_image_url); // get output image
                    setLoading(false); // hide loading text
                  })
                  .catch((error) => {
                    console.error("Error generating design:", error);
                    alert("Something went wrong! Please try again."); // show error popup
                    setLoading(false);
                  });
              };
              
          };
          
    };

    const uploadImage = async () => {
        if (!image) {
            setMessage("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload-image/`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Upload failed");
        }

    };

    const handleGenerate = async () => {
        setLoading(true);  // Show spinner
      
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('prompt', prompt);
      
        try {
          const response = await fetch('http://localhost:8000/api/generate-design/', {
            method: 'POST',
            body: formData,
          });
      
          const data = await response.json();
          setOutputImage(data.output_image);
        } catch (error) {
          console.error('Error:', error);
          alert('Something went wrong. Please try again.');
        }
      
        setLoading(false);  // Hide spinner
      };
      
      {loading && <div className="spinner"></div>}

      

    return (
        <div className="min-h-screen bg-gray-100">
        <h1>AI Interior Design</h1>
        <input type="file" onChange={handleImageUpload} />
        <button onClick={uploadImage}>Upload</button>
        <UploadForm />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <DesignForm />
        </div>
        <p>{message}</p>
      
        {/* New additions below */}
        {loading && <p className="text-blue-600">Generating design... Please wait.</p>}
        {error && <p className="text-red-600">{error}</p>}
      
        {inputImageUrl && (
          <div>
            <p>Uploaded Image:</p>
            <img src={inputImageUrl} alt="Input" width="300" />
          </div>
        )}
      
        {generatedImageUrl && (
          <div>
            <p>Generated Design:</p>
            <img src={generatedImageUrl} alt="Output" width="300" />
            <br />
            <a href={generatedImageUrl} download="generated.jpg">
              <button>Download Design</button>
            </a>
          </div>
        )}
      </div>
      
    );
}

export default App;
const result = await response.json();
console.log(result);
