import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/orders");
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-100 min-h-screen p-8">
      <button
        className="bg-orange-400 px-2 mb-3 rounded-md py-1 text-white hover:bg-orange-500"
        onClick={handleBack}
      >
        Back
      </button>
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-serif font-bold mb-8 text-amber-800 text-center">
          Orders
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-amber-100">
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Order ID
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Date
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Status
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Payment Method
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Total Bill
                </th>
                <th className="p-3 text-left text-amber-800 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-b border-amber-200 hover:bg-amber-50 transition-colors"
                >
                  <td className="p-3">{order.order_id}</td>
                  <td className="p-3">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "P"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {order.status === "P" ? "Pending" : "Completed"}
                    </span>
                  </td>
                  <td className="p-3">{order.payment_method}</td>
                  <td className="p-3">${order.total_bill}</td>
                  <td className="p-3">
                    <Link
                      to={`/order/${order.order_id}`}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
