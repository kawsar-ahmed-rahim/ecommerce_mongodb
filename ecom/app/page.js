"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Featured Products
          </h1>
          <p className="mt-2 text-gray-600">
            Browse our latest items from the database.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No products available right now.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/400x250?text=Product"
                  }
                  alt={product.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-sm font-medium uppercase tracking-wide text-blue-600">
                    {product.category || "General"}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    {product.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </span>
                    <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
