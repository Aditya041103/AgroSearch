import React, { useState, useEffect } from "react";
import axios from "axios";

const SchemePage = () => {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/schemes") // Adjust URL as needed
      .then((response) => setSchemes(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  if (schemes.length === 0)
    return <p className="text-lg text-gray-600 text-center mt-20">Loading schemes...</p>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">
        🌾 Agriculture Schemes
      </h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-700 text-white">
            <th className="p-3 border border-green-600">Name</th>
            <th className="p-3 border border-green-600">Description</th>
            <th className="p-3 border border-green-600">Official Website</th>
            <th className="p-3 border border-green-600">Details</th>
          </tr>
        </thead>
        <tbody>
          {schemes.map((scheme) => (
            <tr key={scheme._id} className="bg-gray-50 hover:bg-gray-100 transition-colors">
              <td className="p-3 border border-gray-200 text-center">{scheme.name}</td>
              <td className="p-3 border border-gray-200 text-left">{scheme.description}</td>
              <td className="p-3 border border-gray-200 text-center">
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Link
                </a>
              </td>
              <td className="p-3 border border-gray-200 text-left">
                <ul>
                  {Object.entries(scheme.language).map(([lang, url]) => (
                    <li key={lang}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold hover:underline"
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
  );
};

export default SchemePage;