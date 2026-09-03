"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [company, setCompany] = useState("");
  const [companyUrl, setCompanyUrl] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          company,
          companyUrl,
          companyDescription,
          email, 
          password 
        })
      });

      if (!res.ok) {
        const data = await res.json();
        const errorDetail = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        alert(errorDetail || "Registration failed");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("subscio_token", data.access_token);
      localStorage.setItem("subscio_profile", JSON.stringify({
        name: data.user_name,
        email,
        company
      }));
      localStorage.setItem("subscio_auth", "true");

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
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-2 text-white">Create Account</h2>
        <p className="text-sm text-gray-400">Start harvesting buying signals</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Company Name</label>
            <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 bg-[#0C1519]/60 border border-gray-700 text-[#F8FAFC] focus:outline-none focus:border-[#CA9C68] focus:ring-1 focus:ring-[#CA9C68] rounded-md placeholder-gray-500" placeholder="Acme Corp" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Company URL</label>
            <input type="url" required value={companyUrl} onChange={(e) => setCompanyUrl(e.target.value)} className="w-full px-3 py-2 bg-[#0C1519]/60 border border-gray-700 text-[#F8FAFC] focus:outline-none focus:border-[#CA9C68] focus:ring-1 focus:ring-[#CA9C68] rounded-md placeholder-gray-500" placeholder="https://acme.com" />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Company Description</label>
            <textarea required value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="w-full px-3 py-2 bg-[#0C1519]/60 border border-gray-700 text-[#F8FAFC] focus:outline-none focus:border-[#CA9C68] focus:ring-1 focus:ring-[#CA9C68] rounded-md placeholder-gray-500 min-h-[80px]" placeholder="We provide AI solutions for B2B enterprises..."></textarea>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Work Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-[#0C1519]/60 border border-gray-700 text-[#F8FAFC] focus:outline-none focus:border-[#CA9C68] focus:ring-1 focus:ring-[#CA9C68] rounded-md placeholder-gray-500" placeholder="jane@acmecorp.com" />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-[#0C1519]/60 border border-gray-700 text-[#F8FAFC] focus:outline-none focus:border-[#CA9C68] focus:ring-1 focus:ring-[#CA9C68] rounded-md placeholder-gray-500" placeholder="••••••••" minLength={8} />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-to-r from-[#CA9C68] to-[#B88029] text-black font-bold uppercase tracking-wider hover:brightness-110 transition-all rounded-md px-4 py-3 w-full flex items-center justify-center gap-2 mt-4 text-sm"
        >
          {isLoading ? "Creating Account..." : (
            <>
              <UserPlus size={16} /> Get Started Free
            </>
          )}
        </button>
        
        <p className="text-[10px] text-text-muted text-center mt-3">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>

      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-6">
        Already have an account? <Link href="/login" className="font-bold text-[#CA9C68] hover:underline">Sign In</Link>
      </div>
    </div>
  );
}
