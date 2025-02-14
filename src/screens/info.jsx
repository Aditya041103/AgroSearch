import React, { useState } from "react";
import axios from "axios";

export default function InfoPage() {
    const [cropName, setCropName] = useState('');
    const [data, setData] = useState({});

    const handleSubmit = async () => {
        if (!cropName.trim()) {
            alert("Please enter a crop name!");
            return;
        }
        try {
            const response = await axios.get("http://localhost:5000/api/details", { params: { crop: cropName } });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData({});
        }
    };

    const handleChange = (e) => {
        setCropName(e.target.value);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-slate-600 p-6">
                    <h1 className="text-4xl font-bold text-white text-center">Crop Details</h1>
                </div>

                {/* Input Section */}
                <div className="p-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            className="flex-grow p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 transition-colors text-lg"
                            name="crop"
                            placeholder="Enter Crop Name"
                            value={cropName}
                            onChange={handleChange}
                        />
                        <button
                            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                            onClick={handleSubmit}
                        >
                            Find
                        </button>
                    </div>
                </div>

                {/* Data Display Section */}
                {data.details && (
                    <div className="p-8 pt-0">
                        <div className="space-y-6">
                            {/* Crop Details */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Crop Details</h2>
                                <div className="space-y-3">
                                    <p className="text-lg text-gray-700">
                                        <strong className="text-green-600">Scientific Name:</strong> {data.details.scientific_name || "Unknown"}
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        <strong className="text-green-600">Category:</strong> {data.details.category || "Unknown"}
                                    </p>
                                    <p className="text-lg text-gray-700">
                                        <strong className="text-green-600">Local Names:</strong> {data.details.local_names ? data.details.local_names.join(", ") : "Unknown"}
                                    </p>
                                </div>
                            </div>

                            {/* Growing Conditions */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Growing Conditions</h2>
                                {data.growingCondition ? (
                                    <div className="space-y-3">
                                        <p className="text-lg text-gray-700">
                                            <strong className="text-green-600">Soil:</strong> {data.growingCondition.soil || "Unknown"}
                                        </p>
                                        <p className="text-lg text-gray-700">
                                            <strong className="text-green-600">Temperature:</strong> {data.growingCondition.temperature || "Unknown"}
                                        </p>
                                        <p className="text-lg text-gray-700">
                                            <strong className="text-green-600">Rainfall:</strong> {data.growingCondition.rainfall || "Unknown"}
                                        </p>
                                        <p className="text-lg text-gray-700">
                                            <strong className="text-green-600">Season:</strong> {data.growingCondition.season || "Unknown"}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-lg text-gray-700">No condition data available.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}