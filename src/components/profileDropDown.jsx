import { useState } from "react";
import { useNavigate } from "react-router-dom";


const handleSignOut = async () => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }).catch((err) => console.error("Logout failed:", err));
  
  if (response && response.status === 200) {
    window.location.href = "/";
  } else {
    console.error("Logout failed");
  }
}

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
      >
        Profile ▼
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-20">
          <button
            onClick={() => navigate("/user/history")}
            className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition"
          >
            History
          </button>
          <button
            onClick={() => navigate("/user/profile")}
            className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition"
          >
            Profile
          </button>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 hover:text-white transition"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}
