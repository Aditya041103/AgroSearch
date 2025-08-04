import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function MarketPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchAuth = async () => {
      const response = await fetch("http://localhost:5000/api/checkAuth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }).catch((err) => console.error("Auth check failed:", err));
      if (response && response.status === 200) {
        setIsAuthenticated(true);
      }
    };
    fetchAuth();
  }, []);

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-green-400 mb-6">
            Are you a Buyer or a Seller?
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/market/seller")}
              className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Seller
            </button>
            <button
              onClick={() => navigate("/market/buyer")}
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Buyer
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-400 mb-4">You need to login</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
}
