import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MarketPage from "./screens/market.jsx";
import SignupPage from "./screens/signup.jsx";
import LoginPage from "./screens/login.jsx";
import InfoPage from "./screens/info.jsx";
import YieldPrediction from "./screens/yield.jsx";
import SchemePage from "./screens/scheme.jsx";

function getName(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const decodedValue = decodeURIComponent(parts.pop().split(';').shift());
    return decodedValue.split(' ')[0]; 
  }
  return null; 
}



function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-green-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            AgroSearch
          </Link>

          

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex space-x-4 items-center font-medium">
            <Link to="/market" className="hover:text-green-200">
              Market
            </Link>
            <Link to="/info" className="hover:text-green-200">
              Crop Info
            </Link>
            <Link to="/yield" className="hover:text-green-200">
              Yield Prediction
            </Link>
            <Link to="/scheme" className="hover:text-green-200">
              Govt Schemes
            </Link>
            <div className="p-4">
              {getName("name") ? (
                <p>Hi {getName("name")}</p>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-green-600 px-4 py-2 rounded hover:bg-green-100"
                >
                  Login/Signup
                </Link>
              )}
            </div>
          </div>
        </div>

       
      </nav>

      {/* Hero Section */}
      <section className="bg-green-50 py-20 text-center">
        <div className="container mx-auto">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            Empowering Farmers with AgroSearch
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Your one-stop solution for crop information, yield prediction,
            market access, and government schemes.
          </p>
          <div className="space-x-4">
            <Link
              to="/market"
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 font-medium"
            >
              Explore Market
            </Link>
            <Link
              to="/yield"
              className="bg-white text-green-600 px-6 py-3 rounded hover:bg-green-100 font-medium"
            >
              Predict Yield
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Crop Information
            </h3>
            <p className="text-gray-600">
              Get detailed information about various crops, including
              cultivation practices and pest control.
            </p>
            <Link
              to="/info"
              className="font-medium text-green-600 hover:underline"
            >
              Learn More →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Yield Prediction
            </h3>
            <p className="text-gray-600">
              Predict your crop yield using advanced AI models and plan your
              harvest effectively.
            </p>
            <Link
              to="/yield"
              className="font-medium text-green-600 hover:underline"
            >
              Try Now →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-green-700 mb-4">
              Government Schemes
            </h3>
            <p className="text-gray-600">
              Stay updated with the latest government schemes and subsidies for
              farmers.
            </p>
            <Link
              to="/scheme"
              className="font-medium text-green-600 hover:underline"
            >
              Explore Schemes →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-5">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 AgroSearch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/market/*" element={<MarketPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/yield" element={<YieldPrediction />} />
        <Route path="/scheme" element={<SchemePage />} />
      </Routes>
    </Router>
  );
}

export default App;
