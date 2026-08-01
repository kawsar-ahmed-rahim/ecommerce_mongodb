"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/categories", label: "Categories" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/orders", label: "Orders" },
];

export default function Navbar() {
  const { itemCount, wishlist } = useCart();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (error) {
        console.error(error);
      }
    }

    loadUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="border-b border-amber-100 bg-[#fffaf4]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold text-[#6d3b1f]">
          Society Market
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium text-[#5f4534] sm:gap-5">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#b85c38]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-[#b85c38] px-4 py-2 text-white transition hover:bg-[#9d4628]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="text-sm font-semibold">{itemCount}</span>
          </Link>
          <Link
            href="/wishlist"
            className="inline-flex items-center gap-2 rounded-full border border-[#e0c5a3] bg-[#fff3e8] px-3 py-2 text-xs font-semibold text-[#6d3b1f] transition hover:border-[#d4b088]"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z"></path>
            </svg>
            <span>{wishlist.length}</span>
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                className="text-sm font-semibold text-[#6d3b1f]"
              >
                {user.name || user.email}
              </Link>
              {user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="text-sm font-semibold text-[#6d3b1f]"
                >
                  Admin
                </Link>
              ) : null}
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-[#b85c38]"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-[#6d3b1f]"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
