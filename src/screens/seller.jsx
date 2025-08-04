import React, { useState, useRef } from "react";

export default function SellerPage() {
  const crops = ["Wheat", "Rice", "Corn", "Barley", "Oats"];
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    price: "",
  });
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("crop", formData.crop);
      data.append("quantity", formData.quantity);
      data.append("price", formData.price);
      images.forEach((image) => data.append("images", image));

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sell`, {
        method: "POST",
        credentials: "include",
        body: data,
      }).catch((err) => console.log(err));

      if (response.ok) {
        setFormData({ crop: "", quantity: "", price: "" });
        setImages([]);
        if (fileInputRef.current) fileInputRef.current.value = null;
        alert("Crop listed successfully!");
      }
    } catch (error) {
      alert("Authentication required!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-12">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
          Sell a Crop 🌾
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Crop Select */}
          <select
            name="crop"
            required
            value={formData.crop}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a crop</option>
            {crops.map((crop, index) => (
              <option key={index} value={crop}>
                {crop}
              </option>
            ))}
          </select>

          {/* Quantity */}
          <input
            type="number"
            required
            name="quantity"
            placeholder="Quantity (kg)"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Price */}
          <input
            type="number"
            name="price"
            required
            placeholder="Price (₹ per kg)"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Images */}
          <input
            name="images"
            type="file"
            multiple
            onChange={handleImageChange}
            ref={fileInputRef}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:bg-green-700"
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
