"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function OrderDetailsPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unable to load order");
        setOrder(data);
      } catch (error) {
        setMessage(error.message || "Unable to load order");
      } finally {
        setLoading(false);
      }
    }

    if (params?.id) {
      loadOrder();
    }
  }, [params?.id]);

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
              Order details
            </p>
            <h1 className="text-3xl font-semibold">Your order summary</h1>
          </div>
          <Link
            href="/orders"
            className="rounded-full bg-[#6a8f4c] px-4 py-2 text-sm font-semibold text-white"
          >
            Back to orders
          </Link>
        </div>

        {message ? (
          <p className="mb-4 text-sm text-[#b85c38]">{message}</p>
        ) : null}

        {loading ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-8 text-center">
            Loading order...
          </div>
        ) : !order ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-8 text-center text-[#6f5848]">
            No order found.
          </div>
        ) : (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold">
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

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-[#fffaf4] p-4">
                <h2 className="font-semibold text-[#2f241d]">Customer</h2>
                <p className="mt-2 text-sm text-[#6f5848]">
                  {order.customerName}
                </p>
                <p className="text-sm text-[#6f5848]">{order.phone}</p>
              </div>
              <div className="rounded-3xl bg-[#fffaf4] p-4">
                <h2 className="font-semibold text-[#2f241d]">Delivery notes</h2>
                <p className="mt-2 text-sm text-[#6f5848]">
                  {order.deliveryNotes || "No notes"}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {order.items?.map((item) => (
                <div
                  key={`${order._id}-${item.productId}`}
                  className="flex items-center justify-between rounded-2xl border border-[#f2dfcb] px-4 py-3"
                >
                  <span className="text-sm text-[#2f241d]">
                    {item.title} × {item.quantity}
                  </span>
                  <span className="text-sm font-semibold text-[#2f241d]">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
