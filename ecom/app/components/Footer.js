export default function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-[#f8ede0] text-[#5f4534]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="font-medium">Society Market</p>
        <p>Build better community shopping with trusted local sellers.</p>
        <p className="text-xs text-[#8e6f53]">
          © {new Date().getFullYear()} Society Market. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
