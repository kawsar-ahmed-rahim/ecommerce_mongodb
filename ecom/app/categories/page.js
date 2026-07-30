"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";

const categories = [
  {
    title: "Daily Essentials",
    description: "Groceries, cleaning supplies, and home basics for every day.",
    accent: "bg-[#fff3e8]",
  },
  {
    title: "Lifestyle Picks",
    description: "Fashion, accessories, and comfort items for your routine.",
    accent: "bg-[#eef5e8]",
  },
  {
    title: "Tech & Gadgets",
    description: "Useful gadgets, chargers, and smart devices for convenience.",
    accent: "bg-[#f8efe6]",
  },
  {
    title: "Fitness & Wellness",
    description:
      "Fitness gear, wellness tools, and health-friendly essentials.",
    accent: "bg-[#fef7e8]",
  },
];

export default function CategoriesPage() {
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

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.title}
              className={`rounded-4xl border border-[#ecd8c3] p-6 shadow-sm ${category.accent}`}
            >
              <h2 className="text-xl font-semibold text-[#2f241d]">
                {category.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[#6f5848]">
                {category.description}
              </p>
              <Link
                href="/"
                className="mt-5 inline-block rounded-full bg-[#b85c38] px-4 py-2 text-sm font-semibold text-white"
              >
                Browse items
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
