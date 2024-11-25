import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const nav = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const response = await axios.post('http://localhost:5000/admin/login', {
            email,password,
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
            alert('Login successful!');
            nav("/dashboard");
        
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Server error. Please try again later.');
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FAF3E0] to-[#F5E6CC] flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl font-bold text-[#5C4033] mb-8 text-center">
          Admin Login
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div>
            <label
              className="block text-[#8B4513] font-semibold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-[#CD853F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              placeholder="Enter your admin email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              className="block text-[#8B4513] font-semibold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-[#CD853F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              placeholder="Enter your admin password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8B4513] to-[#5C4033] text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-300"
            >
              Login as Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
