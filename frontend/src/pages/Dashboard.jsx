import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateDescription } from "../services/aiServices";

import toast from "react-hot-toast";
import {
  createProperty,
  getProperties,
  deleteProperty,
} from "../services/propertyService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) navigate("/");
  }, [navigate]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await getProperties();
      setProperties(data);
    } catch {
      toast.error("Unable to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProperty(formData);
      toast.success("Property listed successfully");

      setFormData({
        title: "",
        location: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        area: "",
        image: "",
      });

      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add property");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this property?")) return;

    try {
      await deleteProperty(id);
      toast.success("Property deleted");
      fetchProperties();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(
      (property) =>
        property.title.toLowerCase().includes(search.toLowerCase()) ||
        property.location.toLowerCase().includes(search.toLowerCase()),
    );
  }, [properties, search]);

  // const handleAIGenerate = async () => {
  //   try {
  //     toast.loading("AI is writing...", {
  //       id: "ai",
  //     });

  //     const { data } = await generateDescription(formData);

  //     setFormData((prev) => ({
  //       ...prev,
  //       description: data.description,
  //     }));

  //     toast.success("Description generated!", {
  //       id: "ai",
  //     });
  //   } catch {
  //     toast.error("AI failed", {
  //       id: "ai",
  //     });
  //   }
  // };

  const handleAIGenerate = async () => {
    try {
      toast.loading("AI is writing...", {
        id: "ai",
      });

      const { data } = await generateDescription(formData);

      setFormData((prev) => ({
        ...prev,
        description: data.description,
      }));

      toast.success("Description generated!", {
        id: "ai",
      });

      // ✅ AUTO CLEAR AFTER 3 SECONDS (optional UX)
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          description: "",
        }));
      }, 3000);
    } catch {
      toast.error("AI failed", {
        id: "ai",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            EstatePro
          </h1>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="mb-10">
          <h2 className="text-5xl font-black text-slate-900 mb-3">
            Premium Properties
          </h2>
          <p className="text-slate-600 text-lg">
            Manage and showcase your real estate listings.
          </p>
        </div>

        {/* Add Property */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-slate-100">
          <h3 className="text-3xl font-bold mb-8 text-slate-800">
            Add New Property
          </h3>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            {[
              ["title", "Property Title"],
              ["location", "Location"],
              ["price", "Price"],
              ["area", "Area (sqft)"],
              ["bedrooms", "Bedrooms"],
              ["bathrooms", "Bathrooms"],
            ].map(([name, placeholder]) => (
              <input
                key={name}
                type={
                  ["price", "area", "bedrooms", "bathrooms"].includes(name)
                    ? "number"
                    : "text"
                }
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                required
                className="p-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
              />
            ))}

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={formData.image}
              onChange={handleChange}
              className="md:col-span-2 p-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
            />

            <button
              type="button"
              onClick={handleAIGenerate}
              className="md:col-span-2 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white text-lg font-bold hover:scale-[1.01] transition shadow-lg"
            >
              ✨ Generate AI Description
            </button>

            <textarea
              name="description"
              rows="6"
              placeholder="AI-generated property description will appear here..."
              value={formData.description}
              onChange={handleChange}
              className="md:col-span-2 p-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition resize-none"
            ></textarea>

            <button
              type="submit"
              className="md:col-span-2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold hover:scale-[1.01] transition"
            >
              Add Property
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-5 rounded-2xl border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
          />
        </div>

        {/* Properties */}
        {loading ? (
          <div className="text-center py-20 text-2xl font-bold text-slate-500">
            Loading properties...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-lg">
            <h3 className="text-3xl font-bold text-slate-700">
              No Properties Found
            </h3>
            <p className="text-slate-500 mt-3">
              Add your first luxury listing.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-500 hover:-translate-y-2"
              >
                <div className="overflow-hidden">
                  <img
                    src={
                      property.image ||
                      "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
                    }
                    alt={property.title}
                    className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800">
                        {property.title}
                      </h3>
                      <p className="text-slate-500 mt-1">
                        📍 {property.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-3xl font-black text-blue-600 mb-5">
                    Rs. {Number(property.price).toLocaleString()}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                    <div className="bg-slate-100 p-3 rounded-2xl">
                      <p className="font-bold text-lg">{property.bedrooms}</p>
                      <p className="text-sm text-slate-500">Beds</p>
                    </div>

                    <div className="bg-slate-100 p-3 rounded-2xl">
                      <p className="font-bold text-lg">{property.bathrooms}</p>
                      <p className="text-sm text-slate-500">Baths</p>
                    </div>

                    <div className="bg-slate-100 p-3 rounded-2xl">
                      <p className="font-bold text-lg">{property.area}</p>
                      <p className="text-sm text-slate-500">Sqft</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(property._id)}
                    className="w-full py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold transition"
                  >
                    Delete Property
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
