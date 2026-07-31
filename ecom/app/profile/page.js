"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setForm((current) => ({
          ...current,
          name: data.user.name || "",
          phone: data.user.phone || "",
          address: data.user.address || "",
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setUser(data.user);
      setMessage("Profile updated successfully");
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (error) {
      setMessage(error.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcf7f1] px-4 py-16 text-[#2f241d]">
        Loading...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fcf7f1] px-4 py-16 text-[#2f241d]">
        <div className="mx-auto max-w-md rounded-4xl border border-[#ecd8c3] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">Please log in</h1>
          <p className="mt-2 text-sm text-[#6f5848]">
            Access your profile to manage your account details.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-[#ecd8c3] bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Your profile</h1>
          <p className="mt-2 text-sm text-[#6f5848]">
            Manage your account settings and update your password.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({ ...current, name: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
              placeholder="Full name"
            />
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((current) => ({ ...current, phone: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
              placeholder="Phone number"
            />
            <input
              value={form.address}
              onChange={(e) =>
                setForm((current) => ({ ...current, address: e.target.value }))
              }
              className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
              placeholder="Address"
            />
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
              placeholder="Current password"
            />
            <input
              type="password"
              value={form.newPassword}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  newPassword: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
              placeholder="New password"
            />
            {message ? (
              <p className="text-sm text-[#b85c38]">{message}</p>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white"
            >
              {saving ? "Saving..." : "Update profile"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
