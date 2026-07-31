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
            className="rounded-full bg-[#b85c38] px-4 py-2 text-white transition hover:bg-[#9d4628]"
          >
            Cart ({itemCount})
          </Link>
          <span className="rounded-full border border-[#e0c5a3] bg-[#fff3e8] px-3 py-2 text-xs font-semibold text-[#6d3b1f]">
            Wishlist ({wishlist.length})
          </span>
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
