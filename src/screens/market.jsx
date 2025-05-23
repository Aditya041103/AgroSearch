import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginPage from "./login";
import { BuyerPage } from "./buyer";
import { SellerPage } from "./seller";

export function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    axios
      .get("https://agrosearch-backend.onrender.com/api/checkAuth", {
        withCredentials: true
      })
      .then((response) => {
        console.log("Auth check success:", response); // Debug log
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Auth check failed:", error); // Debug log
        // navigate("/market/login");
      });
  }, [navigate]);

  return (
    isAuthenticated ? (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Are you a Buyer or a Seller?
          </h2>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/market/seller")}
              className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              Seller
            </button>
            <button
              onClick={() => navigate("/market/buyer")}
              className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Buyer
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <p className="text-gray-600">You need to login</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 px-6 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    )
  );
}
export default function MarketPage() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/seller" element={<SellerPage />} />
      <Route path="/buyer" element={<BuyerPage />} />
    </Routes>
  );
}
