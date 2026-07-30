"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);

    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      await loadProducts();
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log("Error searching products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-4xl border border-[#ecd8c3] bg-[#fff3e8] p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
            Noida society marketplace
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Find trusted essentials for your home and community
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-[#6f5848]">
            Shop daily-use products with a friendly local experience designed
            for society living.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, category, or description"
            className="w-full rounded-full border border-[#e5ccb4] bg-white px-4 py-3 text-sm text-[#2f241d] shadow-sm outline-none focus:border-[#b85c38] focus:ring-2 focus:ring-[#f2dfcb] sm:max-w-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#b85c38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9d4628] disabled:cursor-not-allowed disabled:bg-[#d9a37f]"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ecd8c3] border-t-[#b85c38]"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-4xl border border-dashed border-[#e0c5a3] bg-white p-8 text-center text-[#6f5848]">
            No products matched your search.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
