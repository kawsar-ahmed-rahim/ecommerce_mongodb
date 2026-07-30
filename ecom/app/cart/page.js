"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartProvider";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
              Your cart
            </p>
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Items ready for checkout
            </h1>
          </div>
          <Link
            href="/checkout"
            className="rounded-full bg-[#b85c38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d4628]"
          >
            Proceed to checkout
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="mt-3 text-[#6f5848]">
              Add a few essentials from the marketplace and they will appear
              here.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block rounded-full bg-[#6a8f4c] px-5 py-3 text-sm font-semibold text-white"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-3xl border border-[#ecd8c3] bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <img
                    src={item.image || "https://picsum.photos/500/300?random=1"}
                    alt={item.title}
                    className="h-24 w-full rounded-2xl object-cover sm:w-24"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2f241d]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#6f5848]">
                      {item.category}
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                        className="rounded-full border px-3 py-1 text-sm"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                        className="rounded-full border px-3 py-1 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2f241d]">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="mt-3 text-sm font-semibold text-[#b85c38]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <aside className="rounded-4xl border border-[#ecd8c3] bg-[#fff3e8] p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Order summary</h2>
              <div className="mt-4 space-y-3 text-sm text-[#6f5848]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between border-t border-[#e4c9a9] pt-3 font-semibold text-[#2f241d]">
                  <span>Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 inline-flex w-full justify-center rounded-full bg-[#b85c38] px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Checkout now
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
