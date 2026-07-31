"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      router.push("/auth/login");
    } catch (error) {
      setMessage(error.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcf7f1] px-4 py-16 text-[#2f241d]">
      <div className="mx-auto max-w-md rounded-4xl border border-[#ecd8c3] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Create account</h1>
        <p className="mt-2 text-sm text-[#6f5848]">
          Join the marketplace and start shopping.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm((current) => ({ ...current, name: e.target.value }))
            }
            className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
            placeholder="Full name"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) =>
              setForm((current) => ({ ...current, email: e.target.value }))
            }
            className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
            placeholder="Email"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) =>
              setForm((current) => ({ ...current, password: e.target.value }))
            }
            className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
            placeholder="Password"
          />
          <input
            value={form.phone}
            onChange={(e) =>
              setForm((current) => ({ ...current, phone: e.target.value }))
            }
            className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
            placeholder="Phone"
          />
          <input
            value={form.address}
            onChange={(e) =>
              setForm((current) => ({ ...current, address: e.target.value }))
            }
            className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
            placeholder="Address"
          />
          {message ? <p className="text-sm text-[#b85c38]">{message}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#b85c38] px-4 py-3 font-semibold text-white"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-[#6f5848]">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-[#b85c38]">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
