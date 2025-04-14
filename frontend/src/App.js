import React, { useState } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyDesigns from './components/MyDesigns';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import Generate from './components/GeneratePage';
import History from './pages/HistoryPage';
import ImageUpload from './components/ImageUpload';

function App() {
  const [style, setStyle] = useState('modern');
  const [roomType, setRoomType] = useState('living-room');
  const [furniture, setFurniture] = useState('');
  const [colorPalette, setColorPalette] = useState('');
  const [theme, setTheme] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // API for your backend (if needed for additional data like saving design history)
 
  const handleImageUpload = (uploadedImage) => {
  };

  // This will trigger the AI generation process
  const handleGenerateDesign = async () => {
    setLoading(true);
    try {
      // Construct a descriptive prompt for the AI image generation
      const prompt = `${style} ${roomType} interior with furniture like ${furniture}, color palette of ${colorPalette}, and a ${theme} theme.`;

      // Make API call to generate AI image using Stability AI or your own backend
      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",  // Adjust the API URL if necessary
        {
          prompt: prompt,
          output_format: "url",
          model: "stable-diffusion-xl-beta-v2-2-2",  // or your specific model
        },
        {
          headers: {
            Authorization: "Bearer YOUR_API_KEY", // Make sure to replace with your actual API key
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      // Set the generated image URL
      setGeneratedImage(response.data.image);
    } catch (error) {
      console.error("Error generating design:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="Navbar">
        <Navbar />
        <div className="nav-links">
        </div>
        <div className="App">
          <h1>Virtual AI Interior Designer</h1>
          <ImageUpload   onImageUpload={handleImageUpload} />
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/mydesigns" element={<MyDesigns />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>

          <div className="design-section flex justify-center items-center flex-col text-center mt-10">
            <h1>AI Interior Design</h1>
            
            {/* Display the generated image */}
            {generatedImage && (
              <img
                src={generatedImage}
                alt="AI Design"
                className="generated-image mt-4 max-w-md rounded shadow-lg"
              />
            )}

            {/* Form for user input */}
            <div>
              <label>Style:</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} className="mt-4 p-2 border rounded">
                <option value="modern">Modern</option>
                <option value="minimalist">Minimalist</option>
                <option value="vintage">Vintage</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            <div className="input-group">
              <label>Room Type:</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="living-room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="office">Home Office</option>
              </select>
            </div>

            {/* Additional Inputs */}
            <div className="input-group">
              <label>Furniture:</label>
              <input
                type="text"
                value={furniture}
                onChange={(e) => setFurniture(e.target.value)}
                placeholder="e.g., Sofa, Coffee Table, etc."
                className="p-2 border rounded"
              />
            </div>

            <div className="input-group">
              <label>Color Palette:</label>
              <input
                type="text"
                value={colorPalette}
                onChange={(e) => setColorPalette(e.target.value)}
                placeholder="e.g., Blue, White, Beige"
                className="p-2 border rounded"
              />
            </div>

            <div className="input-group">
              <label>Theme:</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., Cozy, Minimal, Elegant"
                className="p-2 border rounded"
              />
            </div>

            <button onClick={handleGenerateDesign} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Design'}
            </button>

            <div className="min-h-screen bg-gray-100">
              <div className="text-center mt-10">
                <a href="/generate" className="get-started-link">Get Started</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
