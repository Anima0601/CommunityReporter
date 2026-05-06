import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const CreateReport = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Roads");
  const [address, setAddress] = useState(""); // New state for address
  const [coords, setCoords] = useState({ lat: null, lng: null }); // New state for coordinates
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Automatically try to get coordinates when the component mounts
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location access denied or unavailable.");
        },
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("address", address); // Adding address to the request
    formData.append("latitude", coords.lat || 0);
    formData.append("longitude", coords.lng || 0);

    if (image) {
      formData.append("image", image);
    }

    try {
      await api.post("/reports", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Report submitted successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center pb-16">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-10 w-full max-w-150">
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-br from-brand-primary to-lime-500">
          Report an Issue
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title and Category fields remain the same... */}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-slate-600 mb-1.5"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="E.g. Pothole on Main St"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-slate-600 mb-1.5"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            >
              <option value="Roads">Roads</option>
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* NEW ADDRESS FIELD */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-semibold text-slate-600 mb-1.5"
            >
              Location / Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="Enter the street name or landmark"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
            {coords.lat && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                ✓ GPS Coordinates captured
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-600 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              placeholder="Provide more details..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none transition-all resize-y"
            />
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-slate-600 mb-1.5"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-brand-primary hover:file:bg-green-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-primary text-white rounded-full font-bold text-lg hover:bg-brand-hover transition-colors shadow-md hover:shadow-lg mt-2 disabled:opacity-70"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateReport;
