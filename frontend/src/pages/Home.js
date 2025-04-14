import Navbar from '../components/Navbar';
import React from 'react';

const Home = () => (
  <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
    <div>Welcome to the Home Page!</div>;
    <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">Transform Your Room with AI</h1>
    <p className="text-lg md:text-xl max-w-xl mb-6">
      Upload a photo of your room and let our AI generate stunning interior design ideas instantly.
    </p>
    <a
      href="/generate"
      className="bg-primary hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-2xl transition"
    >
      Try It Now
    </a>
  </div>
);

export default Home;
