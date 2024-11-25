import React, { useState } from 'react';

export default function Signup() {
  const [userType, setUserType] = useState('client'); // Default to 'client'

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#FAF3E0] to-[#F5E6CC] flex items-center justify-center">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-4xl font-bold text-[#5C4033] mb-8 text-center">
          Sign Up
        </h2>
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-2 rounded-full font-semibold ${
              userType === 'admin'
                ? 'bg-[#8B4513] text-white'
                : 'bg-[#FAF3E0] text-[#5C4033] border border-[#8B4513]'
            } transition duration-300`}
            onClick={() => handleUserTypeChange('admin')}
          >
            Admin
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold ${
              userType === 'client'
                ? 'bg-[#8B4513] text-white'
                : 'bg-[#FAF3E0] text-[#5C4033] border border-[#8B4513]'
            } transition duration-300`}
            onClick={() => handleUserTypeChange('client')}
          >
            Client
          </button>
        </div>
        <form className="space-y-6">
          {/* Name Input */}
          <div>
            <label className="block text-[#8B4513] font-semibold mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 border border-[#CD853F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              placeholder="Enter your name"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-[#8B4513] font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-[#CD853F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-[#8B4513] font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-[#CD853F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513]"
              placeholder="Create a password"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#8B4513] to-[#5C4033] text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-300"
            >
              Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
