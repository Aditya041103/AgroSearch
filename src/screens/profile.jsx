import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [data, setData] = useState({});
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
          .then((res) => res.json())
          .catch((err) => console.error(err));
        setData(response);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchData();
  }, []);

  function handleChange(event) {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setEdit(false);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">
          Your Profile
        </h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(data).map(([key, value]) => (
              <label key={key} className="block">
                <span className="text-gray-300 font-semibold capitalize">{key}</span>
                <input
                  className={`mt-1 block w-full px-4 py-2 rounded-lg bg-gray-700 text-white border ${
                    edit
                      ? "border-green-400 focus:ring-green-500 focus:border-green-500"
                      : "border-gray-600"
                  }`}
                  type="text"
                  readOnly={!edit}
                  value={value}
                  name={key}
                  onChange={handleChange}
                />
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setEdit(!edit)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {edit ? "Cancel" : "Edit"}
            </button>

            <button
              type="submit"
              hidden={!edit}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
