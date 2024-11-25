import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserTie, FaCoffee, FaLeaf } from "react-icons/fa";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () =>{
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F4F6] to-[#E5E7EB] p-8">
      <div className="flex flex-row-reverse">
        <button
          className="bg-[#5C4033] self-end px-2 mb-3 rounded-md py-1 text-white hover:bg-[#462e23]"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <h1 className="text-4xl font-extrabold text-center text-[#5C4033] mb-10">
        Admin Dashboard
      </h1>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Employees Box */}
        <Link to={"/employee"}>
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center border-t-4 border-[#8B4513] hover:shadow-xl transition-transform transform hover:scale-105">
            <FaUserTie className="text-[#5C4033] text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-[#5C4033]">Employees</h2>
          </div>
        </Link>

        {/* Products Box */}
        <Link to={"/product"}>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center border-t-4 border-[#CD853F] hover:shadow-xl transition-transform transform hover:scale-105">
          <FaCoffee className="text-[#5C4033] text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-[#5C4033]">Products</h2>
        </div>
        </Link>
        
        {/* Ingredients Box */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center border-t-4 border-[#8B4513] hover:shadow-xl transition-transform transform hover:scale-105">
          <FaLeaf className="text-[#5C4033] text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-[#5C4033]">Ingredients</h2>
        </div>
      </div>
    </div>
  );
}
