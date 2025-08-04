import React, { useState, useEffect } from "react";

const SchemePage = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    const fetchSchemes = async () => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/schemes`)
        .then((res) => res.json())
        .then((data) => setSchemes(data))
        .catch((error) => console.error("Error fetching data:", error));
    };
    fetchSchemes();
  }, []);

  if (schemes.length === 0)
    return (
      <p className="text-lg text-gray-400 text-center mt-20">
        Loading schemes...
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-8 lg:px-20">
      <div className="max-w-6xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold text-green-400 mb-8 text-center">
          🌾 Agriculture Schemes
        </h1>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-4 border border-green-500">Name</th>
                <th className="p-4 border border-green-500">Description</th>
                <th className="p-4 border border-green-500">Official Website</th>
                <th className="p-4 border border-green-500">Details</th>
              </tr>
            </thead>
            <tbody>
              {schemes.map((scheme) => (
                <tr
                  key={scheme._id}
                  className="bg-gray-700 hover:bg-gray-600 transition"
                >
                  <td className="p-4 border border-gray-600 text-center font-medium text-green-300">
                    {scheme.name}
                  </td>
                  <td className="p-4 border border-gray-600 text-left text-gray-200">
                    {scheme.description}
                  </td>
                  <td className="p-4 border border-gray-600 text-center">
                    <a
                      href={scheme.link}
                      target="_blank"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      Link
                    </a>
                  </td>
                  <td className="p-4 border border-gray-600 text-left">
                    <ul className="space-y-1">
                      {Object.entries(scheme.language).map(([lang, url]) => (
                        <li key={lang}>
                          <a
                            href={url}
                            target="_blank"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SchemePage;
