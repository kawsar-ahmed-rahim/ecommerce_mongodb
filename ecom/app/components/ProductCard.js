"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="overflow-hidden rounded-3xl border border-[#f2dfcb] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img
        src={product.image || "https://picsum.photos/500/300?random=1"}
        alt={product.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b85c38]">
          {product.category || "Community Pick"}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-[#2f241d]">
          {product.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-[#6f5848]">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#2f241d]">
            ₹{product.price}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => addToCart(product)}
              className="rounded-full bg-[#6a8f4c] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#55753a]"
            >
              Add to cart
            </button>
            <Link
              href={`/products/${product._id}`}
              className="rounded-full border border-[#d8b590] px-3 py-2 text-sm font-semibold text-[#6d3b1f] transition hover:bg-[#fff3e8]"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
