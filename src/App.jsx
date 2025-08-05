import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MarketPage from "./screens/market.jsx";
import SignupPage from "./screens/signup.jsx";
import LoginPage from "./screens/login.jsx";
import InfoPage from "./screens/info.jsx";
import YieldPrediction from "./screens/yield.jsx";
import SchemePage from "./screens/scheme.jsx";
import BuyerPage from "./screens/buyer.jsx";
import SellerPage from "./screens/seller.jsx";
import ProfileDropdown from "./components/profileDropDown.jsx";
import HistoryPage from "./screens/history.jsx";
import ProfilePage from "./screens/profile.jsx";
import DiseasePrediction from "./screens/disease.jsx";
import ChatBot from "./components/ChatBot.jsx";
import { useState } from "react";

function getName(key) {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${key}=`);
    
    // Check if the cookie exists
    if (parts.length < 2) {
      return null;
    }
    
    const cookieValue = parts.pop().split(";")[0];
    const decodedValue = decodeURIComponent(cookieValue);
    
    // Check if decoded value exists and is not empty
    if (!decodedValue || decodedValue === "undefined" || decodedValue.trim() === "") {
      return null;
    }
    
    return decodedValue.split(" ")[0];
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
}


function HomePage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="w-full z-20 px-6 py-4 flex justify-between items-center bg-black border-b border-gray-700">
        <h1 className="text-2xl font-bold text-green-400">AgroSearch 🌱</h1>
        <div className="flex gap-6 items-center font-medium text-sm">
          <Link to="/market" className="hover:text-green-300">
            Market
          </Link>
          <Link to="/info" className="hover:text-green-300">
            Info
          </Link>
          <Link to="/yield" className="hover:text-green-300">
            AI
          </Link>
          <Link to="/scheme" className="hover:text-green-300">
            Schemes
          </Link>
          {getName("name") ? (
            <ProfileDropdown />
          ) : (
            <Link
              to="/login"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Login / Signup
            </Link>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center justify-center px-8 md:px-16 py-20 gap-8">
        {/* Left: Animation */}
        <div className="w-full md:w-1/2 flex justify-center">
          <video
            className="w-[300px] md:w-[400px] rounded-lg shadow-lg"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/farmer.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-green-300">
            Welcome to AgroSearch
          </h2>
          <p className="text-lg text-gray-300 max-w-xl">
            Use AI to predict yields, explore crop data, discover government
            schemes, and chat with AgroBot — all in your language, all for your
            farm.
          </p>
        </div>
      </div>

      {/* Chat Button or Bot */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 z-50"
        >
          Chat
        </button>
      ) : (
        <ChatBot setOpen={setOpen} />
      )}
      {/* Market Section */}
      <div className="bg-gray-900 py-16 px-6 md:px-16 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Content */}
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-green-400">
              🌾 AgroMarket — Buy & Sell Crops Easily
            </h3>
            <p className="text-gray-300 text-lg">
              Whether you’re a buyer looking for fresh produce or a farmer ready
              to sell, our marketplace connects you directly — transparently and
              locally.
            </p>
            <Link
              to="/market"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md mt-4 transition"
            >
              Visit Market
            </Link>
          </div>

          {/* Optional Image or Graphic */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/market-illustration.png" // replace with real image path or Lottie later
              alt="AgroMarket"
              className="w-[300px] md:w-[400px] rounded shadow-lg"
            />
          </div>
        </div>
      </div>
      {/* Crop Info Section */}
      <div className="bg-gray-950 py-16 px-6 md:px-16 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-green-400">
              🌱 Crop Knowledge Hub
            </h3>
            <p className="text-gray-300 text-lg">
              Get detailed information about seasonal crops, climate
              requirements, and farming tips tailored to your region.
            </p>
            <Link
              to="/info"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md mt-4 transition"
            >
              Explore Crops
            </Link>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src="/crop-info.png" // Replace with actual crop illustration or icon
              alt="Crop Info"
              className="w-[300px] md:w-[400px] rounded shadow-lg"
            />
          </div>
        </div>
      </div>
      {/* Govt Schemes Section */}
      <div className="bg-gray-900 py-16 px-6 md:px-16 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-4">
            <h3 className="text-3xl md:text-4xl font-bold text-green-400">
              📜 Know Your Government Schemes
            </h3>
            <p className="text-gray-300 text-lg">
              Access up-to-date government initiatives and subsidies for farmers
              — in your local language, without the jargon.
            </p>
            <Link
              to="/scheme"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md mt-4 transition"
            >
              View Schemes
            </Link>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <img
              src="/schemes.png" // Replace with real image
              alt="Govt Schemes"
              className="w-[300px] md:w-[400px] rounded shadow-lg"
            />
          </div>
        </div>
      </div>
      {/* Prediction Section */}
      <div className="bg-gray-950 py-16 px-6 md:px-16 text-white">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold text-green-400">
            📊 Predict with AgroSearch AI
          </h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Use our AI models to forecast crop yield or detect plant diseases
            from images — helping you plan better.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 pt-4">
            <Link
              to="/yield"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md transition"
            >
              Predict Yield
            </Link>
            <Link
              to="/disease"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md transition"
            >
              Detect Disease
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/market/buyer" element={<BuyerPage />} />
        <Route path="/market/seller" element={<SellerPage />} />

        <Route path="/user/history" element={<HistoryPage />} />
        <Route path="/user/profile" element={<ProfilePage />} />

        <Route path="/disease" element={<DiseasePrediction />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/yield" element={<YieldPrediction />} />
        <Route path="/scheme" element={<SchemePage />} />
      </Routes>
    </Router>
  );
}
