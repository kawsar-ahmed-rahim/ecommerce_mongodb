"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartProvider";

export default function ProductPage({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch("/api/products");
        const products = await res.json();
        const current = products.find((item) => item._id === params.id);
        setProduct(current || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          Loading product...
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold">Product not found</h1>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-[#b85c38] px-5 py-3 text-sm font-semibold text-white"
          >
            Back to marketplace
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <img
          src={product.image || "https://picsum.photos/500/300?random=1"}
          alt={product.title}
          className="h-105 w-full rounded-4xl object-cover shadow-sm"
        />
        <div className="rounded-4xl border border-[#ecd8c3] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
            {product.category}
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{product.title}</h1>
          <p className="mt-4 text-lg leading-8 text-[#6f5848]">
            {product.description}
          </p>
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#fff3e8] p-4">
            <span className="text-2xl font-semibold">₹{product.price}</span>
            <button
              onClick={() => addToCart(product)}
              className="rounded-full bg-[#b85c38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d4628]"
            >
              Add to cart
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
