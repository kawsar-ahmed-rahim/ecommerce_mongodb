"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartProvider";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    deliveryNotes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleOrder = async () => {
    if (!formData.customerName || !formData.phone || !formData.address) {
      setMessage(
        "Please fill in your name, phone number, and delivery address.",
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          subtotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Order failed");
      }

      clearCart();
      setMessage("Order placed successfully! We will contact you shortly.");
      setFormData({
        customerName: "",
        phone: "",
        address: "",
        deliveryNotes: "",
      });
    } catch (error) {
      setMessage(
        error.message || "Something went wrong while placing the order.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
            Checkout
          </p>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            Complete your order for the society market
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">No items to checkout</h2>
            <p className="mt-3 text-[#6f5848]">
              Pick some products first and come back here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-[#6a8f4c] px-5 py-3 text-sm font-semibold text-white"
            >
              Browse marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-4xl border border-[#ecd8c3] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Delivery details</h2>
              <div className="mt-6 space-y-4">
                <input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                  placeholder="Full name"
                />
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                  placeholder="Phone number"
                />
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                  placeholder="Society / Block / House number"
                />
                <textarea
                  name="deliveryNotes"
                  value={formData.deliveryNotes}
                  onChange={handleChange}
                  className="min-h-28 w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                  placeholder="Delivery notes"
                />
              </div>
            </div>

            <div className="rounded-4xl border border-[#ecd8c3] bg-[#fff3e8] p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <div className="mt-4 space-y-3 text-sm text-[#6f5848]">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>
                      {item.title} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-[#e4c9a9] pt-4 text-sm">
                <div className="flex justify-between font-semibold text-[#2f241d]">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
              {message ? (
                <p className="mt-4 text-sm text-[#6d3b1f]">{message}</p>
              ) : null}
              <button
                onClick={handleOrder}
                disabled={loading}
                className="mt-6 w-full rounded-full bg-[#b85c38] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#9d4628] disabled:cursor-not-allowed disabled:bg-[#d9a37f]"
              >
                {loading ? "Placing order..." : "Place order"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
