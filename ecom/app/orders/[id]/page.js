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
        setOrder(data.order || data);
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

  const createdAt = order?.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : null;

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
              Order details
            </p>
            <h1 className="text-3xl font-semibold">Your order summary</h1>
            {createdAt ? (
              <p className="mt-2 text-sm text-[#6f5848]">
                Placed on {createdAt}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/orders"
              className="rounded-full bg-[#6a8f4c] px-4 py-2 text-sm font-semibold text-white"
            >
              Back to orders
            </Link>
            <Link
              href="/"
              className="rounded-full border border-[#6a8f4c] bg-white px-4 py-2 text-sm font-semibold text-[#6a8f4c]"
            >
              Continue shopping
            </Link>
          </div>
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
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="rounded-3xl bg-[#fffaf4] p-6">
                  <p className="text-lg font-semibold text-[#2f241d]">
                    Order #{String(order._id).slice(-6)}
                  </p>
                  <p className="mt-3 text-sm text-[#6f5848]">{order.address}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-sm text-[#6f5848]">
                    <span className="rounded-full bg-[#f8ede0] px-3 py-1">
                      Status:{" "}
                      <strong className="text-[#b85c38]">
                        {order.status || "pending"}
                      </strong>
                    </span>
                    <span className="rounded-full bg-[#f8ede0] px-3 py-1">
                      Total: ₹{order.subtotal}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-[#fffaf4] p-6">
                  <h2 className="font-semibold text-[#2f241d]">
                    Customer details
                  </h2>
                  <p className="mt-3 text-sm text-[#6f5848]">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-[#6f5848]">{order.phone}</p>
                </div>

                <div className="mt-6 rounded-3xl bg-[#fffaf4] p-6">
                  <h2 className="font-semibold text-[#2f241d]">
                    Delivery notes
                  </h2>
                  <p className="mt-3 text-sm text-[#6f5848]">
                    {order.deliveryNotes || "No notes"}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-[#fffaf4] p-6">
                <h2 className="font-semibold text-[#2f241d]">Order items</h2>
                <div className="mt-5 space-y-3">
                  {order.items?.length ? (
                    order.items.map((item) => (
                      <div
                        key={`${order._id}-${item.productId}`}
                        className="flex items-center gap-3 rounded-2xl border border-[#f2dfcb] bg-white px-4 py-3"
                      >
                        <div className="h-14 w-14 overflow-hidden rounded-2xl bg-[#f3ece4]">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#6f5848]">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#2f241d]">
                            {item.title}
                          </p>
                          <p className="text-sm text-[#6f5848]">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#2f241d]">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-[#f2dfcb] bg-[#fffaf4] px-4 py-5 text-center text-sm text-[#6f5848]">
                      No order item details are available for this order.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
