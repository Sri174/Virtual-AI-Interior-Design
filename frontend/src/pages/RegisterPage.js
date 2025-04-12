import React, { useState } from 'react';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      setMessage("Passwords don't match.");
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password1,
      });
      setMessage('Registered successfully!');
      navigate('/login');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Registration failed. Please check your input.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C1F33]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#CC5500]">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC5500]"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC5500]"
            required
          />
          <input
            name="password1"
            type="password"
            placeholder="Password"
            value={formData.password1}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC5500]"
            required
          />
          <input
            name="password2"
            type="password"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC5500]"
            required
          />
          <button
            type="submit"
            className="w-full bg-[#CC5500] text-white font-semibold py-3 rounded-xl hover:bg-opacity-90 transition"
          >
            Register
          </button>
          {message && (
            <p className="text-center text-sm text-red-600 font-medium mt-2">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
