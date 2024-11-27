import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import hot from "../public/hot.jpg";
import cold from "../public/cold.jpg";
import nonCoffee from "../public/non-coffee.jpg";
import snacks from "../public/snacks.jpg";
import axios from "axios";

export default function Cart({
  cartItems = [],
  updateQuantity,
  removeFromCart,
}) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!name || !email) {
      setError("Please provide both name and email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/customer", { name, email });
      const customerId = response.data.customer_id;
      navigate("/checkout", { state: { customerId, total } });
    } catch (error) {
      console.error("Error creating/updating customer:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const categoryImages = {
    HOT: hot,
    COLD: cold,
    NON_COFFEE: nonCoffee,
    SNACKS: snacks,
  };

  return (
    <div className="bg-[#FAF3E0] min-h-screen p-8">
      <button
        className="bg-[#5C4033] text-white py-2 px-4 rounded-md hover:bg-[#4A3328] mb-3"
        onClick={handleBack}
      >
        Back
      </button>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-6 text-[#5C4033]">
          Your Cart
        </h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.p_id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center">
                  <img
                    src={categoryImages[item.category] || snacks}
                    alt={item.p_name}
                    className="w-16 h-16 object-cover mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-[#5C4033]">
                      {item.p_name}
                    </h2>
                    <p className="text-[#8B4513]">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.p_id, item.quantity - 1)}
                    className="bg-[#8B4513] text-white px-2 py-1 rounded-full mr-2"
                  >
                    <FaMinus />
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.p_id, item.quantity + 1)}
                    className="bg-[#5C4033] text-white px-2 py-1 rounded-full ml-2"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.p_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-full ml-4"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-6">
              <p className="text-xl font-semibold text-[#5C4033]">
                Total: ${total.toFixed(2)}
              </p>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 mb-2 border rounded"
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#5C4033] text-[#FFDAB9] px-6 py-2 rounded-full hover:bg-[#8B4513]"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

