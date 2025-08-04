import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        const data = await res.json();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center py-12 px-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
          Purchase History
        </h2>

        {history.length === 0 ? (
          <p className="text-gray-400 text-center">No history found.</p>
        ) : (
          <ul className="space-y-4">
            {history.map((entry, index) => (
              <li
                key={index}
                className="bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="space-y-2 text-gray-200">
                  <p className="text-lg font-semibold">
                    <span className="text-green-400">🌾</span> Crop:{" "}
                    {entry.crop}
                  </p>
                  <p className="text-sm">
                    <span className="text-green-400">⚖️</span> Quantity:{" "}
                    {entry.quantity} kg
                  </p>
                  <p className="text-sm">
                    <span className="text-green-400">💰</span> Amount Paid: ₹
                    {entry.amount}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
