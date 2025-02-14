import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import axios from "axios";
import LoginPage from "./login";
import SignupPage from "./signup";

export function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/checkAuth", { withCredentials: true })
      .then(response => {
        console.log("Auth check success:", response); // Debug log
        setIsAuthenticated(true);
      })
      .catch(error => {
        console.error("Auth check failed:", error);  // Debug log
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Are you a Buyer or a Seller?</h2>
        {isAuthenticated ? (
          <div className="space-y-4">
            <button
              onClick={() => navigate("/seller")}
              className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Seller
            </button>
            <button
              onClick={() => navigate("/buyer")}
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buyer
            </button>
          </div>
        ) : (
          <p className="text-gray-600">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}

export function SellerPage() {
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    price: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/sell",
        {
          ...formData,
          quantity: Number(formData.quantity), // Convert to number
          price: Number(formData.price), // Convert to number
        },
        { withCredentials: true }
      );
      console.log("Server Response", response.data);
      alert("Crop added successfully!");
    } catch (error) {
      alert("Authentication required!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Sell a Crop</h2>
        <form className="space-y-4">
          <input
            name="crop"
            placeholder="Crop Name"
            value={formData.crop}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSubmit}
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export function BuyerPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Search for a Crop</h2>
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
            setSellers([...sellers].sort((a, b) => Number(a.price || 0) - Number(b.price || 0)))
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
                <p className="text-gray-700">
                  <strong>{seller.user_id.name}</strong> - {seller.user_id.phone} - {seller.user_id.address}
                </p>
                <p className="text-gray-700">
                  {seller.crop} - {seller.quantity}kg - ₹{seller.price || "N/A"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function MarketPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/buyer" element={<BuyerPage />} />
      </Routes>
    </Router>
  );
}