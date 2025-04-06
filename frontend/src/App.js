// src/App.js
import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from './components/HomePage';
import DesignForm from "./components/DesignForm";
import MyDesigns from './components/MyDesigns';
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function App() {
  const [style, setStyle] = useState('modern');
  const [image, setImage] = useState(null);
  const [theme, setTheme] = useState('modern');
  const [roomType, setRoomType] = useState('living-room');
  const [colorPalette, setColorPalette] = useState(['#FFFFFF', '#F5F5F5', '#E0E0E0']);
  const [furnitureSuggestions, setFurnitureSuggestions] = useState([]);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateDesign = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:5000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ style }),
    });
    const data = await response.json();
    setImage(data.image);
    setLoading(false);
    setGeneratedImage(data.image);
    setColorPalette(data.colors);
    setFurnitureSuggestions(data.furniture);
  };

  return (
    <div className="App">
      <h1>AI Interior Design</h1>
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option value="modern">Modern</option>
        <option value="minimalist">Minimalist</option>
        <option value="vintage">Vintage</option>
        <option value="industrial">Industrial</option>
      </select>
      <button onClick={generateDesign} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Design'}
      </button>
      {image && <img src={image} alt="AI Design" style={{ width: '100%' }} />}

      <div className="input-group">
          <label>Room Type:</label>
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option value="living-room">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="kitchen">Kitchen</option>
            <option value="office">Home Office</option>
          </select></div>
      <div><div className="results">
        {generatedImage && (
          <div className="preview">
            <img src={generatedImage} alt="AI Design" />
          </div>
        )}

        <div className="suggestions">
          <h3>Color Palette</h3>
          <div className="color-palette">
            {colorPalette.map((color, index) => (
              <div key={index} className="color-box" style={{ backgroundColor: color }}></div>
            ))}
          </div>

          <h3>Recommended Furniture</h3>
          <ul className="furniture-list">
            {furnitureSuggestions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div></div>
    </div>
    
  );
}



function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/generate" element={<DesignForm />} />
          <Route path="/history" element={<MyDesigns />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        
        {/* Optional: Call-to-action section on the homepage */}
        <div className="min-h-screen bg-gray-100">
          <div className="text-center mt-10">
            <a
              href="/generate"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
