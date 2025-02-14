import React, { useState } from "react";
import axios from "axios";

function BuyerPage() {
  const [searchData, setSearchData] = useState({ crop: "", quantity: "" });
  const [sellers, setSellers] = useState([]);
  const [error, setError] = useState(null);

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
      const response = await axios.get("http://localhost:5000/api/buy", {
        params: {
          crop: searchData.crop,
          quantity: Number(searchData.quantity),
        },
        withCredentials: true,
      });
      setSellers(response.data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setError("Error fetching sellers. Please try again.");
    }
  };

  const handleBuy = async (id, quantity) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart",
        { id, quantity },
        { withCredentials: true }
      );
      if (response.status === 200) {
        alert("Crop bought successfully!");
        // Optionally, refresh the sellers list after a successful purchase
        handleSearch();
      }
    } catch (error) {
      console.error("Unable to Buy", error);
      alert("Failed to buy the crop. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Search for a Crop
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            name="crop"
            placeholder="Crop Name"
            value={searchData.crop}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="quantity"
            placeholder="Quantity"
            type="number"
            value={searchData.quantity}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
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
                  {/* Seller Details */}
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

                  {/* Divider */}
                  <hr className="my-4 border-gray-200" />

                  {/* Crop Details */}
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
                      {seller.price || "N/A"}
                    </p>
                  </div>

                  {/* Call to Action Button */}
                  <button
                    onClick={() => handleBuy(seller._id, searchData.quantity)}
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