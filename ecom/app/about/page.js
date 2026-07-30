import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcf7f1] text-[#2f241d]">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-[#ecd8c3] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#b85c38]">
            About our marketplace
          </p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
            A friendly local marketplace for Noida residents
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#6f5848]">
            This marketplace helps neighbors discover useful products, share
            trusted essentials, and support one another with convenient local
            shopping.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              [
                "Trusted local deals",
                "Every product is selected for everyday usefulness and value.",
              ],
              [
                "Convenient shopping",
                "Browse and order from home without the usual hassle.",
              ],
              [
                "Community-first",
                "Built for the comfort and convenience of society living.",
              ],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl bg-[#fff3e8] p-5">
                <h2 className="font-semibold text-[#6d3b1f]">{title}</h2>
                <p className="mt-2 text-sm text-[#6f5848]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
