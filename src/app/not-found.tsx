import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEDF0] flex flex-col items-center justify-center p-6 text-center select-none font-matrix">
      <div className="w-12 h-12 bg-[#0D0D0D] border border-white/[0.12] flex items-center justify-center text-[#FF5500] font-semibold text-lg mb-4 font-orbitron">
        404
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 tracking-tight font-orbitron">
        Page Not Found
      </h2>
      <p className="text-neutral-400 mb-6 text-sm max-w-md font-matrix">
        The card or page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#FF5500] hover:bg-[#ff661a] text-white text-xs font-medium tracking-wide transition-all shadow-[0_4px_20px_rgba(255,85,0,0.3)] font-orbitron uppercase"
      >
        Back to Home
      </Link>
    </div>
  );
}
