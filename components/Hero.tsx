export default function Hero() {
  return (
    <section className="w-full bg-white py-9 relative overflow-hidden">
      {/* Background image */}
      <img
        src="/bg_grd.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none select-none"
        aria-hidden="true"
      />
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 text-left">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-3xl font-bold text-black mb-2">
              Find help from your community!
            </h1>
            <p className="text-lg text-[#455775] leading-snug">
              Browse peer-to-peer services in your community <br />
              There&apos;s someone nearby to help :)
            </p>
          </div>
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-18 w-auto transform -scale-x-100"
          />
        </div>
      </div>
    </section>
  );
}