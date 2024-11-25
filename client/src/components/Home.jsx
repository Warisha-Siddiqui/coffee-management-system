import React, { useState } from "react";
import { FaShoppingCart, FaUserCircle, FaPlus, FaMinus } from "react-icons/fa";
import img from "../public/cofeeee.png";

export default function Home() {
  const [cartItems, setCartItems] = useState(0); // Cart item count
  const [selectedCategory, setSelectedCategory] = useState("HOT");
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [productQuantities, setProductQuantities] = useState({}); // Track product quantities

  // Example products (to be fetched from backend later)
  const products = {
    HOT: [
      { id: 1, name: "Espresso (Single/Double)", price: 4, image: "espresso.jpg" },
      { id: 2, name: "Macchiato", price: 5, image: "macchiato.jpg" },
      { id: 3, name: "Cappuccino", price: 6, image: "cappuccino.jpg" },
      { id: 4, name: "Latte (Vanilla)", price: 6.5, image: "latte.jpg" },
      { id: 5, name: "Flat White", price: 6, image: "flatwhite.jpg" },
      { id: 6, name: "Americano", price: 4.5, image: "americano.jpg" },
      { id: 7, name: "Cortado", price: 5.5, image: "cortado.jpg" },
      { id: 8, name: "Black Coffee", price: 3.5, image: "blackcoffee.jpg" },
    ],
    COLD: [
      { id: 9, name: "Iced Americano", price: 5, image: "iced_americano.jpg" },
      { id: 10, name: "Iced Latte", price: 6, image: "iced_latte.jpg" },
      { id: 11, name: "Frappuccino", price: 6.5, image: "frappuccino.jpg" },
      { id: 12, name: "Iced Mocha", price: 7, image: "iced_mocha.jpg" },
      { id: 13, name: "Mocha Frappe", price: 7.5, image: "mocha_frappe.jpg" },
      { id: 14, name: "Nitro Cold Brew", price: 8, image: "nitro_cold_brew.jpg" },
      { id: 15, name: "Iced Signature Coffee", price: 8.5, image: "iced_signature.jpg" },
    ],
    NON_COFFEE: [
      { id: 16, name: "Chai Latte", price: 5, image: "chai_latte.jpg" },
      { id: 17, name: "Matcha Latte", price: 6, image: "matcha_latte.jpg" },
      { id: 18, name: "Herbal Tea", price: 4, image: "herbal_tea.jpg" },
      { id: 19, name: "Lemonade", price: 4.5, image: "lemonade.jpg" },
      { id: 20, name: "Water", price: 2, image: "water.jpg" },
      { id: 21, name: "Hot Chocolate", price: 5, image: "hot_chocolate.jpg" },
      { id: 22, name: "Steamed Milk", price: 3, image: "steamed_milk.jpg" },
    ],
    SNACKS: [
      { id: 23, name: "Croissants", price: 3.5, image: "croissant.jpg" },
      { id: 24, name: "Red Velvet", price: 5, image: "redvelvet.jpg" },
      { id: 25, name: "Cupcake", price: 3, image: "cupcake.jpg" },
      { id: 26, name: "Brownie", price: 4, image: "brownie.jpg" },
      { id: 27, name: "Muffin", price: 2.5, image: "muffin.jpg" },
      { id: 28, name: "Waffles", price: 6, image: "waffles.jpg" },

    ]
  };

  // Flatten the products for easier search across categories
  const allProducts = Object.values(products).flat();

  // Function to handle adding items to cart
  const addToCart = (productId) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    setCartItems((prev) => prev + 1);
  };

  // Function to increase product quantity
  const increaseQuantity = (productId) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: prev[productId] + 1,
    }));
    setCartItems((prev) => prev + 1);
  };

  // Function to decrease product quantity
  const decreaseQuantity = (productId) => {
    if (productQuantities[productId] > 0) {
      setProductQuantities((prev) => ({
        ...prev,
        [productId]: prev[productId] - 1,
      }));
      setCartItems((prev) => prev - 1);
    }
  };

  // Filter products based on search term
  const filteredProducts = searchTerm
    ? allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products[selectedCategory];

  return (
    <div className="bg-[#FAF3E0] min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center bg-[#5C4033] p-5 shadow-md">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={img} alt="Logo" className="w-16 h-16" />
        </div>

        {/* Icons Section */}
        <div className="flex items-center space-x-6">
          {/* Cart Icon with Badge */}
          <div className="relative">
            <FaShoppingCart className="text-[#FFDAB9] text-3xl cursor-pointer" />
            {cartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems}
              </span>
            )}
          </div>

          {/* Profile Icon */}
          <div>
            <a href="/login">
              <FaUserCircle className="text-[#FFDAB9] text-3xl cursor-pointer" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex justify-center items-center h-[80vh]">
        <div className="text-center flex flex-col items-center justify-center">
          <div className=" mx-auto">
            <img
              src={img}
              alt="Cozy Coffee Shop"
              className="w-60 h-auto"
            />
          </div>
          <h1 className="text-5xl font-semibold mb-5 text-[#5C4033]">
            COFFEE SHOP MANAGEMENT
          </h1>
          <p className="text-lg text-[#8B4513] mb-10">By Warisha and Nashmia</p>
        </div>
      </main>

      {/* Category Bar */}
      <div className="bg-[#5C4033] text-[#FFDAB9] p-3 flex justify-center space-x-5" >
        {["HOT", "COLD", "NON_COFFEE","SNACKS"].map((category) => (
          <button
            key={category}
            className={`px-4 py-2 rounded-lg ${
              selectedCategory === category ? "bg-[#FFDAB9] text-[#5C4033]" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-5 flex justify-center">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full max-w-lg px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5C4033]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product Grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center p-4"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-40 h-40 object-cover mb-3"
            />
            <h2 className="text-lg font-semibold text-[#5C4033]">
              {product.name}
            </h2>
            <p className="text-[#8B4513] text-sm">${product.price.toFixed(2)}</p>
            {productQuantities[product.id] ? (
              <div className="flex items-center space-x-3 mt-3">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  className="bg-[#8B4513] text-white px-2 py-1 rounded-full"
                >
                  <FaMinus />
                </button>
                <span>{productQuantities[product.id]}</span>
                <button
                  onClick={() => increaseQuantity(product.id)}
                  className="bg-[#5C4033] text-white px-2 py-1 rounded-full"
                >
                  <FaPlus />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product.id)}
                className="mt-3 bg-[#5C4033] text-[#FFDAB9] px-4 py-2 rounded-full hover:bg-[#8B4513]"
              >
                Add to Cart
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
