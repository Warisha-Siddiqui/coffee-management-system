import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function Checkout({ cartItems, clearCart }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customer, setCustomer] = useState(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { customerId, total } = location.state;

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/customer/${customerId}`
      );
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const calculateDiscount = () => {
    if (useLoyaltyPoints && customer) {
      return Math.round(customer.loyalty_points / 100);
    }
    return 0;
  };

  const handleCheckout = async () => {
    const discount = calculateDiscount();
    try {
      const response = await axios.post("http://localhost:5000/orders", {
        status: "P",
        payment_method: paymentMethod,
        order_details: cartItems.map((item) => ({
          product_id: item.p_id,
          quantity: item.quantity,
          price: item.price,
        })),
        customer_id: customerId,
        use_loyalty_points: useLoyaltyPoints,
        discount: discount,
      });

      if (response.data) {
        alert("Order placed successfully!");
        clearCart();
        navigate("/");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(error.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-[#FAF3E0] min-h-screen p-8">
      <button
        className="bg-[#5C4033] text-white py-2 px-4 rounded-md hover:bg-[#4A3328] mb-3 "
        onClick={handleBack}
      >
        Back
      </button>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-semibold mb-6 text-[#5C4033]">Checkout</h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-[#5C4033]">
            Order Summary
          </h2>
          {cartItems.map((item) => (
            <div key={item.p_id} className="flex justify-between py-2">
              <span>
                {item.p_name} x {item.quantity}
              </span>
              <span>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            {customer && (
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useLoyaltyPoints}
                    onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                    className="mr-2"
                  />
                  Use Loyalty Points ({customer.loyalty_points} available)
                </label>
              </div>
            )}
            {useLoyaltyPoints ? (
              <div>
                <div className="flex justify-between text-green-600 mt-2">
                  <span>Discount</span>
                  <span>-${Math.round(customer.loyalty_points / 100)}</span>
                </div>
                <div className="flex justify-between font-semibold mt-2">
                  <span>Total</span>
                  <span>
                    ${Math.round(total - customer.loyalty_points / 100)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between font-semibold mt-2">
                <span>Total</span>
                <span>${total}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-[#5C4033]">
            Payment Method
          </h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <button
          onClick={handleCheckout}
          className="w-full bg-[#5C4033] text-[#FFDAB9] px-6 py-3 rounded-full hover:bg-[#8B4513]"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
