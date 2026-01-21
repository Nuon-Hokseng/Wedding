"use client";

import { useState, useEffect } from "react";
import { supabase, type Guest } from "@/lib/supabase";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [guests, setGuests] = useState<Guest[]>([]);
  const [newGuest, setNewGuest] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchGuests();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - in production, use proper authentication
    const adminPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "wedding2026";
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setMessage("");
    } else {
      setMessage("Invalid password");
    }
  };

  const fetchGuests = async () => {
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .order("invited_at", { ascending: false });

    if (error) {
      setMessage("Error fetching guests: " + error.message);
    } else {
      setGuests(data || []);
    }
  };

  const generateToken = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.name.trim()) {
      setMessage("Please enter a guest name");
      return;
    }

    setLoading(true);
    const token = generateToken();

    const { data, error } = await supabase
      .from("guests")
      .insert([
        {
          name: newGuest.name,
          email: newGuest.email || null,
          link_token: token,
        },
      ])
      .select();

    if (error) {
      setMessage("Error adding guest: " + error.message);
    } else {
      setMessage("Guest added successfully!");
      setNewGuest({ name: "", email: "" });
      fetchGuests();
    }
    setLoading(false);
  };

  const handleDeleteGuest = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guest?")) return;

    const { error } = await supabase.from("guests").delete().eq("id", id);

    if (error) {
      setMessage("Error deleting guest: " + error.message);
    } else {
      setMessage("Guest deleted successfully!");
      fetchGuests();
    }
  };

  const copyInviteLink = (token: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://phorn-mey.vercel.app";
    const url = `${baseUrl}/invite/${token}`;
    navigator.clipboard.writeText(url);
    setMessage("Invite link copied to clipboard!");
    setTimeout(() => setMessage(""), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 to-amber-50 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-rose-600 mb-6 text-center">
            Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                placeholder="Enter admin password"
              />
            </div>
            {message && (
              <p className="text-red-600 text-sm text-center">{message}</p>
            )}
            <button
              type="submit"
              className="w-full bg-rose-500 text-white py-3 rounded-lg font-semibold hover:bg-rose-600 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 to-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-rose-600 mb-6">
            Guest Management
          </h1>

          {message && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {message}
            </div>
          )}

          {/* Add Guest Form */}
          <form onSubmit={handleAddGuest} className="mb-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Guest Name *
                </label>
                <input
                  type="text"
                  value={newGuest.name}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="លោក/លោកស្រី គាំ សុវណ្ណា"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newGuest.email}
                  onChange={(e) =>
                    setNewGuest({ ...newGuest, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="guest@example.com"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-rose-600 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Guest"}
            </button>
          </form>

          {/* Guests List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Guest List ({guests.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Invite Link
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {guest.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {guest.email || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => copyInviteLink(guest.link_token)}
                          className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-2"
                        >
                          <span className="hidden md:inline">
                            /invite/{guest.link_token.substring(0, 8)}...
                          </span>
                          <span className="md:hidden">Copy Link</span>
                          📋
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {guests.length === 0 && (
                <p className="text-center py-8 text-gray-500">
                  No guests added yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
