import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    p_name: "",
    price: 0,
    category: "HOT",
    stock_quantity: 0,
  });
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(
          `http://localhost:5000/product/${editingProduct.p_id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/product", formData);
      }
      fetchProducts();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ p_name: "", price: 0, category: "HOT", stock_quantity: 0 });
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      p_name: product.p_name,
      price: product.price,
      category: product.category,
      stock_quantity: product.stock_quantity,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/product/${id}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <button
        className="bg-orange-400 px-2 mb-3 rounded-md py-1 text-white hover:bg-orange-500"
        onClick={handleBack}
      >
        Back
      </button>
      <h1 className="text-3xl mb-5 font-bold text-orange-700">
        Product Management
      </h1>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition mb-4"
      >
        <FaPlus className="inline mr-2" />
        {showForm ? "Cancel" : "Add Product"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="p_name"
              value={formData.p_name}
              onChange={handleInputChange}
              placeholder="Product Name"
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Price"
              className="p-2 border rounded"
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 border rounded"
              required
            >
              <option value="HOT">HOT</option>
              <option value="COLD">COLD</option>
              <option value="NON_COFFEE">NON_COFFEE</option>
              <option value="SNACKS">SNACKS</option>
            </select>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleInputChange}
              placeholder="Stock Quantity"
              className="p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
          >
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow">
          <thead className="bg-orange-300 text-orange-900">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Name</th>
              <th className="p-2">Price</th>
              <th className="p-2">Category</th>
              <th className="p-2">Stock</th>
              <th className="p-2">last Restocked</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.p_id} className="text-center">
                <td className="p-2 border">{product.p_id}</td>
                <td className="p-2 border">{product.p_name}</td>
                <td className="p-2 border">${product.price}</td>
                <td className="p-2 border">{product.category}</td>
                <td className="p-2 border">{product.stock_quantity}</td>
                <td className="p-2 border">
                  {formatDate(product.last_restocked)}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-500 text-white p-1 rounded mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(product.p_id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
