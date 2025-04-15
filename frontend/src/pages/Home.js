import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import './Home.css';

const Home = () => (
  
  <div className="home-container">
    <div className="overlay">
      <h1>Welcome to the DreamScape</h1>
    </div>;
    <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Transform Your Room with AI</h1>
    <p>Your AI Interior Designer</p>
    <a
      href="/generate"
      className="home-button"
    >
      Get Started
    </a>
  </div>
);

export default Home;
