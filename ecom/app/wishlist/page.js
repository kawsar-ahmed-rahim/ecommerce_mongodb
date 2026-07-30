"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { useCart } from "../components/CartProvider";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
              Wishlist
            </p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Your saved favorites
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full bg-[#6a8f4c] px-4 py-2 text-sm font-semibold text-white"
          >
            Continue shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold">No saved items yet</h2>
            <p className="mt-3 text-[#6f5848]">
              Tap the heart on any product to save it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="rounded-4xl border border-[#ecd8c3] bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-[#2f241d]">
                      {product.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#6f5848]">
                      {product.category}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="text-xl"
                    aria-label="Remove from wishlist"
                  >
                    💛
                  </button>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#6f5848]">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-[#2f241d]">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="rounded-full bg-[#b85c38] px-4 py-2 text-sm font-semibold text-white"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
