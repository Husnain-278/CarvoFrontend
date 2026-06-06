import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../api/axios";

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/user-profile/");
      setProfile(response.data);
      setFormData({
        username: response.data.username || "",
        first_name: response.data.first_name || "",
        last_name: response.data.last_name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
      });
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to load profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setUpdateError(null);
      setUpdateSuccess(false);
      await axiosInstance.patch("/user-profile/", formData);
      setProfile({ ...profile, ...formData });
      setIsEditing(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update profile";
      setUpdateError(message);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
    setIsEditing(false);
    setUpdateError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-emerald-300">
            Account
          </p>
          <h1 className="text-3xl md:text-4xl font-bold">Your Profile</h1>
          <p className="text-slate-300 text-sm">
            Manage your personal information and contact details.
          </p>
        </header>

        {/* Success Message */}
        {updateSuccess && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-emerald-200">
            Profile updated successfully!
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-5 py-4 text-red-200">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-16 rounded-2xl bg-slate-800/70 border border-slate-800 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Profile Content */}
        {profile && !loading && (
          <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 space-y-6">
            {/* Profile Fields */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Username */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Username
                </label>
                <p className="text-slate-100 py-2 px-4 rounded-xl bg-slate-800/50">
                  {formData.username || "Not provided"}
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Email
                </label>
                <p className="text-slate-100 py-2 px-4 rounded-xl bg-slate-800/50">
                  {formData.email || "Not provided"}
                </p>
              </div>

              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-emerald-300">
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="text-slate-100 py-2 px-4 rounded-xl bg-slate-800/50">
                    {formData.first_name || "Not provided"}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="text-slate-100 py-2 px-4 rounded-xl bg-slate-800/50">
                    {formData.last_name || "Not provided"}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs uppercase tracking-[0.2em] text-emerald-300">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-slate-100 py-2 px-4 rounded-xl bg-slate-800/50">
                    {formData.phone || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Update Error */}
            {updateError && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200 text-sm">
                {updateError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 pt-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-600 transition"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800/70 text-slate-200 hover:border-emerald-500/60 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-semibold hover:bg-emerald-600 transition"
                >
                  Edit profile
                </button>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default UserProfilePage;
