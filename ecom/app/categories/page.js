"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const placeholderCategories = [
  {
    name: "Footwear",
    description: "Everyday shoes and sandals for society living.",
    image: "https://picsum.photos/500/300?category=footwear",
  },
  {
    name: "Clothing",
    description: "Comfortable clothing and wardrobe essentials.",
    image: "https://picsum.photos/500/300?category=clothing",
  },
  {
    name: "Accessories",
    description: "Useful accessories for daily convenience.",
    image: "https://picsum.photos/500/300?category=accessories",
  },
  {
    name: "Electronics",
    description: "Everyday electronics and home gadgets.",
    image: "https://picsum.photos/500/300?category=electronics",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const categoriesToDisplay =
    categories.length > 0 ? categories : placeholderCategories;

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
            Featured categories
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Explore what your society market has to offer
          </h1>
        </div>

        {loading ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-10 text-center shadow-sm">
            Loading categories...
          </div>
        ) : categoriesToDisplay.length === 0 ? (
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-10 text-center shadow-sm text-[#6f5848]">
            No categories available. Please seed the database or add a category from the admin panel.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categoriesToDisplay.map((category) => (
              <div
                key={category._id || category.name}
                className="group rounded-4xl border border-[#ecd8c3] bg-white shadow-sm transition hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden rounded-t-4xl">
                  <img
                    src={category.image || "https://picsum.photos/500/300?blur=2"}
                    alt={category.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-[#2f241d]">
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#6f5848]">
                    {category.description || "Browse products in this category."}
                  </p>
                  <Link
                    href="/"
                    className="mt-5 inline-block rounded-full bg-[#b85c38] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9d4628]"
                  >
                    Browse items
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
