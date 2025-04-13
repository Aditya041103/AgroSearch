import React, { useState, useEffect } from "react";
import axios from "axios";

function BuyerPage() {
  const [searchData, setSearchData] = useState({ crop: "", quantity: "" });
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);
  const crops = ["Wheat", "Rice", "Corn", "Barley", "Oats"];

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleSearchChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!searchData.crop || !searchData.quantity) {
      alert("Please enter both crop name and quantity.");
      return;
    }

    try {
      setError(null);
      const response = await axios.get(
        "https://agrosearch-backend.onrender.com/api/buy",
        {
          params: {
            crop: searchData.crop,
            quantity: Number(searchData.quantity)
          },
          withCredentials: true
        }
      );
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setError("Error fetching sellers. Please try again.");
    }
  };

  const handlePayment = async (seller) => {
    try {
      const amount = seller.price * searchData.quantity; // Calculate total price

      // Create order on backend
      const orderResponse = await axios.post(
        "https://agrosearch-backend.onrender.com/api/create-order",
        { amount },
        { withCredentials: true }
      );

      const { order } = orderResponse.data;

      const options = {
        key: "rzp_live_yGYfFddFxJR1UQ", // Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "AgroSearch",
        description: `Purchase of ${seller.crop}`,
        order_id: order.id,
        handler: async (response) => {
          // Payment success handler
          await axios.post(
            "http://localhost:5000/api/cart",
            { id: seller._id, quantity: searchData.quantity },
            { withCredentials: true }
          );
          alert("Payment successful! Crop bought successfully.");
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Search for a Crop
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            name="crop"
            value={searchData.crop}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="" disabled>
              Select a crop
            </option>
            {crops.map((crop, index) => (
              <option key={index} value={crop}>
                {crop}
              </option>
            ))}
          </select>
          <div className="flex items-center">
          <input
            name="quantity"
            placeholder="Quantity (Kg)"
            type="text" // Use text input to allow 'Kg' as part of the value
            value={searchData.quantity} // Append Kg to the value displayed in the input
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          </div>

          <button
            onClick={handleSearch}
            className="w-full sm:w-auto py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Search
          </button>
        </div>
        <button
          onClick={() =>
            setSellers(
              [...sellers].sort(
                (a, b) => Number(a.price || 0) - Number(b.price || 0)
              )
            )
          }
          disabled={sellers.length === 0}
          className="w-full sm:w-auto py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-6"
        >
          Sort by Price
        </button>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        {sellers.length === 0 ? (
          <p className="text-gray-600 text-center">No sellers found.</p>
        ) : (
          <ul className="space-y-4">
            {sellers.map((seller, index) => (
              <li key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-800">
                      <span className="text-green-600">👤</span>{" "}
                      {seller.user_id.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-green-600">📞</span>{" "}
                      {seller.user_id.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-green-600">📍</span>{" "}
                      {seller.user_id.address}
                    </p>
                  </div>

                  <hr className="my-4 border-gray-200" />
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-800">
                      <span className="text-green-600">🌾</span> {seller.crop}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-green-600">⚖️</span>{" "}
                      {seller.quantity} kg
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="text-green-600">💰</span> ₹
                      {seller.price || "N/A"}/Kg
                    </p>
                  </div>

                  <button
                    onClick={() => handlePayment(seller)}
                    className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export { BuyerPage };
