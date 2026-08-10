"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders/history");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message || "Unable to load orders");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
              Order history
            </p>
            <h1 className="text-3xl font-semibold">Your past orders</h1>
          </div>
          <Link
            href="/"
            className="rounded-full bg-[#6a8f4c] px-4 py-2 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>

        {message ? (
          <p className="mb-4 text-sm text-[#b85c38]">{message}</p>
        ) : null}

        {loading ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-8 text-center">
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-8 text-center text-[#6f5848]">
            You have not placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-4xl border border-[#ecd8c3] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-[#2f241d]">
                      Order #{String(order._id).slice(-6)}
                    </p>
                    <p className="text-sm text-[#6f5848]">{order.address}</p>
                  </div>
                  <div className="text-sm text-[#6f5848]">
                    <p>
                      Status:{" "}
                      <span className="font-semibold text-[#b85c38]">
                        {order.status || "pending"}
                      </span>
                    </p>
                    <p>Total: ₹{order.subtotal}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {order.items?.map((item) => (
                    <div
                      key={`${order._id}-${item.productId}`}
                      className="flex items-center justify-between rounded-2xl bg-[#fffaf4] px-4 py-3 text-sm"
                    >
                      <span>
                        {item.title} × {item.quantity}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
