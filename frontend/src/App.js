// src/App.js
import React, { useState } from 'react';
import My3DScene from './My3DScene';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import HomePage from './components/HomePage';
import DesignForm from "./components/DesignForm";
import MyDesigns from './components/MyDesigns';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from './components/ProtectedRoute';
import Generate from './pages/GeneratePage';
import History from './pages/HistoryPage';
import ImageUpload from './components/ImageUpload';

function App() {
  const [style, setStyle] = useState('modern');
  const [image, setImage] = useState(null);
  const [roomType, setRoomType] = useState('living-room');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE_URL;


  const App = () => {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <h1>AI Interior Design</h1>
        <My3DScene />
      </div>
    );
  };

  const handleGenerateDesign = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        {
          prompt: `${style} ${roomType} interior`,
          output_format: "url",
          model: "stable-diffusion-xl-beta-v2-2-2"
        },
        {
          headers: {
            Authorization: "Bearer sk-mNzcRYYlkpYsvrFx5t3ZtCFbJBEFJ5mbAWWbeqcXaP3HhW4r",
            "Content-Type": "application/json",
            Accept: "application/json",
          }
        }
      );
      console.log("Image URL:", response.data.image);
      setImage(response.data.image);
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
          <a href="/login" className="nav-button">Login</a>
          <a href="/register" className="nav-button">Register</a>
        </div>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<ProtectedRoute><Generate /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/mydesigns" element={<MyDesigns />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>

          <div className="design-section">
            <h1>AI Interior Design</h1>
            <select value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
              <option value="vintage">Vintage</option>
              <option value="industrial">Industrial</option>
            </select>
            <button onClick={handleGenerateDesign} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Design'}
            </button>
            {image && <img src={image} alt="AI Design" className="generated-image" />}

            <div className="input-group">
              <label>Room Type:</label>
              <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                <option value="living-room">Living Room</option>
                <option value="bedroom">Bedroom</option>
                <option value="kitchen">Kitchen</option>
                <option value="office">Home Office</option>
              </select>
            </div>

            <div className="results">
              {generatedImage && (
                <div className="preview">
                  <img src={generatedImage} alt="AI Design" />
                </div>
              )}
            </div>

            <div className="min-h-screen bg-gray-100">
              <div className="text-center mt-10">
                <a
                  href="/generate"
                  className="get-started-link">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;