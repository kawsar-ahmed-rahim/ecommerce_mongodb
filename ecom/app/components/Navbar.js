"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
];

export default function Navbar() {
  const { itemCount } = useCart();

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
        </nav>
      </div>
    </header>
  );
}
