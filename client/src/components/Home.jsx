import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { Link } from "react-router-dom";
import img from "../public/cofeeee.png";
import hot from "../public/hot.jpg";
import cold from "../public/cold.jpg";
import nonCoffee from "../public/non-coffee.jpg";
import snacks from "../public/snacks.jpg";

export default function Home({ addToCart, cartItems = [] }) {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("HOT");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Map categories to images
  const categoryImages = {
    HOT: hot,
    COLD: cold,
    NON_COFFEE: nonCoffee,
    SNACKS: snacks,
  };

  const filteredProducts = products.filter(
    (product) =>
      product.category === selectedCategory &&
      product.p_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#FAF3E0] min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-[#5C4033] p-5 shadow-md">
        <Link to="/">
          <img src={img} alt="Logo" className="w-16 h-16" />
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-[#FFDAB9] text-3xl cursor-pointer" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
          <Link to="/login">
            <FaUserCircle className="text-[#FFDAB9] text-3xl cursor-pointer" />
          </Link>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex flex-col justify-center items-center pb-20 mt-10">
        <div className="text-center flex flex-col items-center justify-center">
          <div className=" mx-auto">
            <img src={img} alt="Cozy Coffee Shop" className="w-60 h-auto" />
          </div>
          <h1 className="text-5xl font-semibold mb-5 text-[#5C4033]">
            COFFEE SHOP MANAGEMENT
          </h1>
          <p className="text-lg text-[#8B4513] mb-10">By Warisha and Nashmia</p>
        </div>

        {/* Category Bar */}
        <div className="bg-[#5C4033] text-[#FFDAB9] p-3 flex justify-center space-x-5 mb-8 w-full">
          {["HOT", "COLD", "NON_COFFEE", "SNACKS"].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg ${
                selectedCategory === category
                  ? "bg-[#FFDAB9] text-[#5C4033]"
                  : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* search Grid */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.p_id}
              className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center p-4"
            >
              <img
                src={
                  categoryImages[product.category] || "/path-to-default-image.jpg"
                }
                alt={product.p_name}
                className="w-60 h-48 object-fit mb-3"
              />
              <h2 className="text-lg font-semibold text-[#5C4033]">
                {product.p_name}
              </h2>
              <p className="text-[#8B4513] text-sm">${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 bg-[#5C4033] text-[#FFDAB9] px-4 py-2 rounded-full hover:bg-[#8B4513]"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
