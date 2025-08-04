import React, { useState, useEffect } from "react";

export default function BuyerPage() {
  const [searchData, setSearchData] = useState({ crop: "", quantity: "" });
  const [sellers, setSellers] = useState([]);
  const crops = ["Wheat", "Rice", "Corn", "Barley", "Oats"];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/buy?crop=${searchData.crop}&quantity=${searchData.quantity}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await response.json();
      setSellers(data);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    }
  };

  const handlePayment = async (seller) => {
    try {
      const amount = seller.price * searchData.quantity;
      const orderResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/create-order`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ amount }),
          credentials: "include",
        }
      );
      const { order } = await orderResponse.json();
      const options = {
        key: "rzp_live_yGYfFddFxJR1UQ",
        amount: order.amount,
        currency: order.currency,
        name: "AgroSearch",
        description: `Purchase of ${seller.crop}`,
        order_id: order.id,
        handler: async () => {
          await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/complete-order`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
              seller_id: seller._id,
              quantity: searchData.quantity,
              crop: seller.crop,
              amount: order.amount,
            }),
            credentials: "include",
          });
          alert("Payment successful!");
          window.location.reload();
        },
      };
      new window.Razorpay(options).open();
    } catch (error) {
      console.error("Payment Failed:", error);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-green-400 text-center mb-6">
          Search for Crops to Buy 🌾
        </h2>

        {/* Form */}
        <form
          className="flex flex-col sm:flex-row gap-4 mb-6"
          onSubmit={handleSubmit}
        >
          <select
            name="crop"
            value={searchData.crop}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a crop</option>
            {crops.map((crop, index) => (
              <option key={index} value={crop}>
                {crop}
              </option>
            ))}
          </select>
          <input
            name="quantity"
            placeholder="Quantity (Kg)"
            type="Number"
            value={searchData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full sm:w-auto py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Search
          </button>
        </form>

        {/* Sort Button */}
        {sellers.length > 0 && (
          <button
            onClick={() =>
              setSellers([...sellers].sort((a, b) => a.price - b.price))
            }
            className="mb-6 w-full sm:w-auto py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Sort by Price
          </button>
        )}

        {/* Seller List */}
        {sellers.length === 0 ? (
          <p className="text-gray-400 text-center">No sellers found.</p>
        ) : (
          <ul className="space-y-6">
            {sellers.map((seller, index) => (
              <li key={index}>
                <div className="bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-2xl transition">
                  {/* Seller Info */}
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-green-300">
                      👤 {seller.user_id.name}
                    </p>
                    <p className="text-sm text-gray-300">📞 {seller.user_id.phone}</p>
                    <p className="text-sm text-gray-300">📍 {seller.user_id.address}</p>
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps?q=${encodeURIComponent(
                            seller.user_id.address
                          )}`,
                          "_blank"
                        )
                      }
                      className="text-blue-400 text-sm hover:underline"
                    >
                      View on Map
                    </button>
                  </div>

                  {/* Crop Info */}
                  <hr className="my-3 border-gray-500" />
                  <div className="space-y-1">
                    <p className="text-lg text-white font-semibold">🌾 {seller.crop}</p>
                    <p className="text-sm text-gray-300">⚖️ {seller.quantity} kg</p>
                    <p className="text-sm text-gray-300">💰 ₹{seller.price}/Kg</p>
                  </div>

                  {/* Images */}
                  {seller.images.map((image, idx) => (
                    <img
                      key={idx}
                      src={image}
                      alt="crop"
                      className="w-full h-48 object-cover rounded-md mt-4"
                    />
                  ))}

                  {/* Buy Button */}
                  <button
                    onClick={() => handlePayment(seller)}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition"
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
