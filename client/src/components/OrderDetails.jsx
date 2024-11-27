import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetails() {
  const [order, setOrder] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/order/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handleMarkCompleted = async () => {
    try {
      await axios.put(`http://localhost:5000/order/${id}/complete`);
      alert("Order has been completed");
      navigate("/orders");
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (!order)
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        Loading...
      </div>
    );

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-serif font-bold mb-8 text-amber-800 text-center">
          Order Details
        </h1>
        <div className="bg-amber-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-amber-800">
            Order Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Order ID:</span> {order.order_id}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(order.order_date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Status:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                  order.status === "P"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {order.status === "P" ? "Pending" : "Completed"}
              </span>
            </p>
            <p>
              <span className="font-semibold">Payment Method:</span>{" "}
              {order.payment_method}
            </p>
            <p>
              <span className="font-semibold">Total Bill:</span> $
              {order.total_bill}
            </p>
            <p>
              <span className="font-semibold">Discount:</span> $
              {order.discount}
            </p>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-amber-800">
          Order Items
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr className="bg-amber-100">
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Product
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Quantity
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Price
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {order.details.map((item) => (
                <tr
                  key={item.orderdetail_id}
                  className="border-b border-amber-200"
                >
                  <td className="p-3">{item.p_name}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">${item.price}</td>
                  <td className="p-3">${item.quantity * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between">
          {order.status === "P" && (
            <button
              onClick={handleMarkCompleted}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
