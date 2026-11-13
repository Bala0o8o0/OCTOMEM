"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Stub: Auth integration point (Supabase / Clerk will go here)
    setTimeout(() => {
      setLoading(false);
      // On success: router.push("/studio")
      setError("Auth not yet connected — this is the UI scaffold.");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* ── Left panel — branding ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:flex-1 relative flex-col items-center justify-center px-16 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-brand-pink/15 blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-magenta/10 blur-[120px]" />
        </div>

        {/* Brand mark */}
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2.5 z-10">
          <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center shadow-lg shadow-brand-pink/40">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5" r="3" fill="white" fillOpacity="0.9" />
              <path d="M2 13c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">OCTOMEM <span className="text-brand-pink">AI</span></span>
        </Link>

        {/* Central content */}
        <div className="relative z-10 text-center max-w-lg">
          <div className="text-8xl mb-8">🐙</div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-4">
            Welcome back to the
            <br />
            <span className="bg-gradient-to-r from-brand-pink to-brand-magenta bg-clip-text text-transparent">
              digital ocean.
            </span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Your AI companions are waiting. Encrypted. Portable. Loyal.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {["🔒 AES-256 Encrypted", "💾 Portable PNG Cards", "⚡ NVIDIA NIM Powered"].map((f) => (
              <div
                key={f}
                className="px-4 py-2 rounded-full border border-brand-pink/20 bg-brand-pink/8 text-white/70 text-sm"
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────────────────── */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg flex flex-col justify-center px-8 sm:px-12 lg:px-16 relative">
        {/* Mobile logo */}
        <Link href="/" className="flex lg:hidden items-center gap-2.5 mb-10">
          <div className="w-8 h-8 rounded-lg bg-brand-pink flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5" r="3" fill="white" fillOpacity="0.9" />
              <path d="M2 13c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.9" />
            </svg>
          </div>
          <span className="text-white font-semibold text-sm">OCTOMEM <span className="text-brand-pink">AI</span></span>
        </Link>

        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Sign in</h1>
          <p className="text-white/50 mb-8">
            New here?{" "}
            <Link href="/signup" className="text-brand-pink hover:text-brand-pinkHover font-medium transition-colors">
              Create a free account
            </Link>
          </p>

          {/* Google OAuth (stub) */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/8 text-white font-medium text-sm transition-all duration-200 hover:-translate-y-0.5 mb-6 backdrop-blur-sm"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-white/60 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/30 transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/60 text-sm font-medium">Password</label>
                <Link href="#" className="text-brand-pink text-xs hover:text-brand-pinkHover transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-brand-pink/50 focus:ring-1 focus:ring-brand-pink/30 transition-all duration-200"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-brand-pink/10 border border-brand-pink/20 text-brand-pink text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-brand-pink hover:bg-brand-pinkHover disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-brand-pink/25 hover:shadow-brand-pink/40 hover:-translate-y-0.5 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-white/30 text-xs mt-8">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-white/50 hover:text-white transition-colors">Terms</Link>{" "}
            &{" "}
            <Link href="#" className="text-white/50 hover:text-white transition-colors">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
