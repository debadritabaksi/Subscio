"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        const errorDetail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        alert(errorDetail || "Login failed");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("subscio_token", data.access_token);
      localStorage.setItem("subscio_auth", "true");
      
      // Attempt to preserve company if already existed
      let company = "";
      try {
        const existing = JSON.parse(localStorage.getItem("subscio_profile") || "{}");
        company = existing.company || "";
      } catch {}

      localStorage.setItem("subscio_profile", JSON.stringify({
        name: data.user_name,
        email,
        company
      }));

      router.push("/dashboard");
    } catch (err: any) {
      const errorString = err?.response?.data?.detail || err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      alert(errorString);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#162127]/50 backdrop-blur-xl -webkit-backdrop-blur-xl border border-[#CA9C68]/30 shadow-2xl relative z-10 rounded-2xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-2 text-white">Sign In</h2>
        <p className="text-sm text-gray-400">Access your enterprise workspace</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Work Email</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-[#0C1519]/60 border border-gray-700 text-[#F8FAFC] focus:outline-none focus:border-[#CA9C68] focus:ring-1 focus:ring-[#CA9C68] rounded-md placeholder-gray-500"
            placeholder="you@company.com"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">Password</label>
            <a href="#" className="text-xs text-accent-blue hover:underline">Forgot?</a>
          </div>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-[#0C1519]/60 border border-gray-700 text-[#F8FAFC] focus:outline-none focus:border-[#CA9C68] focus:ring-1 focus:ring-[#CA9C68] rounded-md placeholder-gray-500"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-to-r from-[#CA9C68] to-[#B88029] text-black font-bold uppercase tracking-wider hover:brightness-110 transition-all rounded-md px-4 py-3 w-full flex items-center justify-center gap-2 mt-4 text-sm"
        >
          {isLoading ? "Authenticating..." : (
            <>
              <LogIn size={16} /> Sign In
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-6">
        Don't have an account? <Link href="/register" className="font-bold text-[#CA9C68] hover:underline">Get Started</Link>
      </div>
    </div>
  );
}
