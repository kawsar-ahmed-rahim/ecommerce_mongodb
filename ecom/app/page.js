"use client";

import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  async function loadCategories() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  async function loadProducts(category = selectedCategory) {
    setLoading(true);

    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      let nextProducts = Array.isArray(data) ? data : [];
      if (category !== "All") {
        nextProducts = nextProducts.filter(
          (product) => product.category === category,
        );
      }
      setProducts(nextProducts);
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
      let nextProducts = Array.isArray(data) ? data : [];
      if (selectedCategory !== "All") {
        nextProducts = nextProducts.filter(
          (product) => product.category === selectedCategory,
        );
      }
      setProducts(nextProducts);
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
        <div className="mb-8 overflow-hidden rounded-4xl border border-[#ecd8c3] bg-linear-to-r from-[#fff3e8] via-[#fcebd8] to-[#e8f1de] p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
                Noida society marketplace
              </p>
              <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Find trusted essentials for your home and community
              </h1>
              <p className="mt-3 text-lg text-[#6f5848]">
                Shop daily-use products with a friendly local experience
                designed for society living.
              </p>
            </div>
            <div className="rounded-3xl border border-[#e0c5a3] bg-white/80 px-4 py-3 text-sm text-[#6f5848] shadow-sm">
              <p className="font-semibold text-[#2f241d]">
                Fast delivery in society
              </p>
              <p>Same-day drop-offs for nearby residents</p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Daily essentials",
              desc: "Groceries, cleaning, and home basics",
            },
            {
              title: "Lifestyle picks",
              desc: "Fashion, accessories, and comfort items",
            },
            {
              title: "Tech made easy",
              desc: "Useful gadgets and smart everyday tools",
            },
          ].map((category) => (
            <div
              key={category.title}
              className="rounded-3xl border border-[#ecd8c3] bg-white p-4 shadow-sm"
            >
              <h2 className="font-semibold text-[#2f241d]">{category.title}</h2>
              <p className="mt-1 text-sm text-[#6f5848]">{category.desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-3xl border border-[#ecd8c3] bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[#2f241d]">
                Delivery slots
              </h2>
              <p className="text-sm text-[#6f5848]">
                Choose a convenient time for your order.
              </p>
            </div>
            <select className="rounded-full border border-[#e5ccb4] bg-[#fffaf4] px-4 py-2 text-sm text-[#2f241d] outline-none">
              <option>Today, 6:00 PM - 8:00 PM</option>
              <option>Tomorrow, 10:00 AM - 12:00 PM</option>
              <option>Tomorrow, 4:00 PM - 6:00 PM</option>
            </select>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <select
            value={selectedCategory}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategory(value);
              loadProducts(value);
            }}
            className="rounded-full border border-[#e5ccb4] bg-white px-4 py-3 text-sm text-[#2f241d] shadow-sm outline-none"
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
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
