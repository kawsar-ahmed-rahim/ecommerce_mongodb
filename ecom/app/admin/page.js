"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    imageFile: null,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadAdminData = async () => {
      try {
        const [meRes, productsRes, categoriesRes, ordersRes] =
          await Promise.all([
            fetch("/api/auth/me", { signal: controller.signal }),
            fetch("/api/products", { signal: controller.signal }),
            fetch("/api/categories", { signal: controller.signal }),
            fetch("/api/orders", { signal: controller.signal }),
          ]);

        const meData = await meRes.json();
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        const ordersData = await ordersRes.json();

        if (!controller.signal.aborted) {
          if (!meData.user || meData.user.role !== "admin") {
            setUser(null);
            return;
          }

          setUser(meData.user);
          setProducts(Array.isArray(productsData) ? productsData : []);
          setCategories(Array.isArray(categoriesData) ? categoriesData : []);
          setOrders(Array.isArray(ordersData) ? ordersData : []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadAdminData();
    return () => controller.abort();
  }, []);

  async function handleProductSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      let imageValue = productForm.image;
      if (productForm.imageFile) {
        const formData = new FormData();
        formData.append("file", productForm.imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
        imageValue = uploadData.url;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          image: imageValue,
          price: Number(productForm.price),
          stock: Number(productForm.stock || 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to create product");
      setProducts((current) => [data.product, ...current]);
      setProductForm({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
        imageFile: null,
      });
      setMessage("Product added successfully");
    } catch (error) {
      setMessage(error.message || "Unable to add product");
    }
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        editingCategoryId
          ? `/api/categories/${editingCategoryId}`
          : "/api/categories",
        {
          method: editingCategoryId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryForm),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to manage category");
      if (editingCategoryId) {
        setCategories((current) =>
          current.map((category) =>
            category._id === editingCategoryId ? data.category : category,
          ),
        );
        setMessage("Category updated successfully");
      } else {
        setCategories((current) => [data.category, ...current]);
        setMessage("Category added successfully");
      }
      setEditingCategoryId(null);
      setCategoryForm({ name: "", description: "", image: "" });
    } catch (error) {
      setMessage(error.message || "Unable to add category");
    }
  }

  async function handleDeleteCategory(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to delete category");
      setCategories((current) =>
        current.filter((category) => category._id !== categoryId),
      );
      setMessage("Category deleted successfully");
    } catch (error) {
      setMessage(error.message || "Unable to delete category");
    }
  }

  async function handleEditCategory(category) {
    setEditingCategoryId(category._id);
    setCategoryForm({
      name: category.name || "",
      description: category.description || "",
      image: category.image || "",
    });
  }

  async function handleDeleteProduct(productId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to delete product");
      setProducts((current) =>
        current.filter((product) => product._id !== productId),
      );
      setMessage("Product deleted successfully");
    } catch (error) {
      setMessage(error.message || "Unable to delete product");
    }
  }

  async function handleEditProduct(product) {
    setEditingProductId(product._id);
    setProductForm({
      title: product.title,
      description: product.description || "",
      price: product.price,
      category: product.category || "",
      image: product.image || "",
      stock: product.stock ?? 0,
      imageFile: null,
    });
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    setMessage("");

    try {
      let imageValue = productForm.image;
      if (productForm.imageFile) {
        const formData = new FormData();
        formData.append("file", productForm.imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");
        imageValue = uploadData.url;
      }

      const res = await fetch(`/api/products/${editingProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          image: imageValue,
          price: Number(productForm.price),
          stock: Number(productForm.stock || 0),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update product");
      setProducts((current) =>
        current.map((product) =>
          product._id === editingProductId ? data.product : product,
        ),
      );
      setEditingProductId(null);
      setProductForm({
        title: "",
        description: "",
        price: "",
        category: "",
        image: "",
        stock: "",
        imageFile: null,
      });
      setMessage("Product updated successfully");
    } catch (error) {
      setMessage(error.message || "Unable to update product");
    }
  }

  async function handleStatusChange(orderId, status) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to update order");
      setOrders((current) =>
        current.map((order) => (order._id === orderId ? data.order : order)),
      );
      setMessage("Order status updated successfully");
    } catch (error) {
      setMessage(error.message || "Unable to update order");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcf7f1] px-4 py-16 text-[#2f241d]">
        Loading admin panel...
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#fcf7f1] px-4 py-16 text-[#2f241d]">
        <div className="mx-auto max-w-md rounded-4xl border border-[#ecd8c3] bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-[#6f5848]">
            Only the admin account can view this dashboard.
          </p>
          <Link
            href="/auth/login"
            className="mt-6 inline-block rounded-full bg-[#b85c38] px-5 py-3 font-semibold text-white"
          >
            Login as admin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
              Admin dashboard
            </p>
            <h1 className="text-3xl font-semibold">
              Manage products, categories, and orders
            </h1>
          </div>
          <div className="rounded-3xl border border-[#ecd8c3] bg-white px-4 py-3 text-sm text-[#6f5848]">
            Signed in as {user.email}
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-[#e0c5a3] bg-[#fff3e8] p-4 text-sm text-[#6d3b1f]">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Add product</h2>
            <form
              onSubmit={
                editingProductId ? handleSaveProduct : handleProductSubmit
              }
              className="mt-4 space-y-3"
            >
              <input
                required
                value={productForm.title}
                onChange={(e) =>
                  setProductForm((current) => ({
                    ...current,
                    title: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Title"
              />
              <input
                value={productForm.description}
                onChange={(e) =>
                  setProductForm((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Description"
              />
              <input
                type="number"
                required
                value={productForm.price}
                onChange={(e) =>
                  setProductForm((current) => ({
                    ...current,
                    price: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Price"
              />
              <input
                value={productForm.category}
                onChange={(e) =>
                  setProductForm((current) => ({
                    ...current,
                    category: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Category"
              />
              <input
                value={productForm.image}
                onChange={(e) =>
                  setProductForm((current) => ({
                    ...current,
                    image: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Image URL or upload path"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProductForm((current) => ({
                    ...current,
                    imageFile: e.target.files?.[0] || null,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
              />
              <input
                type="number"
                value={productForm.stock}
                onChange={(e) =>
                  setProductForm((current) => ({
                    ...current,
                    stock: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Stock"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#b85c38] px-4 py-3 font-semibold text-white"
                >
                  {editingProductId ? "Save changes" : "Add product"}
                </button>
                {editingProductId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProductId(null);
                      setProductForm({
                        title: "",
                        description: "",
                        price: "",
                        category: "",
                        image: "",
                        stock: "",
                        imageFile: null,
                      });
                    }}
                    className="rounded-full border border-[#e8d2bc] px-4 py-3 font-semibold text-[#6d3b1f]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">
              {editingCategoryId ? "Edit category" : "Add category"}
            </h2>
            <form onSubmit={handleCategorySubmit} className="mt-4 space-y-3">
              <input
                required
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Category name"
              />
              <input
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm((current) => ({
                    ...current,
                    description: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Description"
              />
              <input
                value={categoryForm.image}
                onChange={(e) =>
                  setCategoryForm((current) => ({
                    ...current,
                    image: e.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e8d2bc] bg-[#fffaf4] px-4 py-3"
                placeholder="Image URL"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#6a8f4c] px-4 py-3 font-semibold text-white"
                >
                  {editingCategoryId ? "Save category" : "Add category"}
                </button>
                {editingCategoryId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategoryId(null);
                      setCategoryForm({ name: "", description: "", image: "" });
                    }}
                    className="rounded-full border border-[#e8d2bc] px-4 py-3 font-semibold text-[#6d3b1f]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Categories</h2>
            <div className="mt-4 space-y-3">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="rounded-2xl border border-[#f2dfcb] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#2f241d]">
                        {category.name}
                      </p>
                      <p className="text-sm text-[#6f5848]">
                        {category.description || "No description"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="text-sm font-semibold text-[#b85c38]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category._id)}
                        className="text-sm font-semibold text-[#b85c38]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Products</h2>
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="rounded-2xl border border-[#f2dfcb] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#2f241d]">
                        {product.title}
                      </p>
                      <p className="text-sm text-[#6f5848]">
                        ₹{product.price} • Stock: {product.stock ?? 0}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditProduct(product)}
                        className="text-sm font-semibold text-[#b85c38]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product._id)}
                        className="text-sm font-semibold text-[#b85c38]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-[#ecd8c3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Recent orders</h2>
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-[#f2dfcb] p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-[#2f241d]">
                        {order.customerName}
                      </p>
                      <p className="text-sm text-[#6f5848]">
                        {order.address} • ₹{order.subtotal}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#b85c38]">
                        {order.status || "pending"}
                      </p>
                    </div>
                    <select
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="rounded-full border border-[#e8d2bc] bg-[#fffaf4] px-2 py-1 text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
