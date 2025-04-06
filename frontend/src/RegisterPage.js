// RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '' });
    const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        email,
        password
      });
      setMessage("Registration successful!");
    } catch (error) {
      console.error(error);
      setMessage("Error registering. Check form fields.");
    }

    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/register/`, formData);
            alert('Registration successful!');
        } catch (err) {
            alert('Error registering. Check form fields.');
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <h2 className="text-xl mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
            <input  type="password"
            placeholder="Password"
            className="p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
            <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
             />
            <input name="password" type="password" onChange={handleChange} placeholder="Password" />
            <input name="password2" type="password" onChange={handleChange} placeholder="Confirm Password" />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Register</button>
            {message && <p className="text-red-600">{message}</p>}
        </form>
    </div>
    );
}

export default RegisterPage;
