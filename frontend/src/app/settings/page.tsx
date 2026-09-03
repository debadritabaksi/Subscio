"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Save, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  // State for all fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [productSummary, setProductSummary] = useState("");
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("subscio_token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("/api/auth/me", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const p = data.profile;
          setUsername(p.username || "");
          setEmail(p.email || "");
          setCompanyName(p.company_name || "");
          setWebsiteUrl(p.website_url || "");
          setLogoUrl(p.logo_url || "");
          setPhoneNumber(p.phone_number || "");
          setProductSummary(p.company_description || "");
        } else {
          router.push("/login");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("subscio_token");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          company_name: companyName,
          website_url: websiteUrl,
          logo_url: logoUrl,
          phone_number: phoneNumber,
          company_description: productSummary
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local storage profile to keep navbar in sync if needed
        const newProfile = { name: data.profile.username, email: data.profile.email, company: data.profile.company_name };
        localStorage.setItem("subscio_profile", JSON.stringify(newProfile));
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (e) {
      alert("Error saving profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Both current and new passwords are required.");
      return;
    }
    setIsPasswordSaving(true);
    try {
      const token = localStorage.getItem("subscio_token");
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword
        })
      });
      if (res.ok) {
        alert("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        const data = await res.json();
        alert(data.detail || "Failed to update password");
      }
    } catch (e) {
      alert("Error updating password");
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you absolutely sure? This will wipe your account and all associated pipeline data permanently."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("subscio_token");
      const res = await fetch(`/api/auth/delete-account`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.detail || "Failed to delete account");
        return;
      }
      localStorage.removeItem("subscio_token");
      localStorage.removeItem("subscio_auth");
      localStorage.removeItem("subscio_profile");
      window.location.href = '/login';
    } catch (err: any) {
      alert("Error deleting account.");
    }
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-[#CA9C68] font-bold bg-[#0C1519]">Loading Settings...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0C1519] p-8 pb-20 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-[#CA9C68]/20 pb-4">
          <div className="w-10 h-10 bg-red-50 text-red-700 rounded-md flex items-center justify-center">
            <Activity size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase leading-none text-[#F8FAFC]">Organization Settings</h1>
            <span className="text-xs font-bold text-[#CA9C68] tracking-widest uppercase">Configure your workspace and profile</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Organization & Profile */}
          <div className="md:col-span-2 space-y-8">
            
            <section className="bg-[#162127] border border-[#CA9C68]/30 rounded-xl p-6 space-y-6 shadow-xl">
              <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-[#CA9C68]/20 pb-2">Profile Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Username (Display Name)</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    disabled
                    className="w-full bg-[#0C1519]/50 border border-transparent rounded-md px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </section>

            <section className="bg-[#162127] border border-[#CA9C68]/30 rounded-xl p-6 space-y-6 shadow-xl">
              <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-[#CA9C68]/20 pb-2">Company Information</h2>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName} 
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Website URL</label>
                    <input 
                      type="text" 
                      value={websiteUrl} 
                      onChange={e => setWebsiteUrl(e.target.value)}
                      className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phoneNumber} 
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +1 555-0199"
                      className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Company Logo URL</label>
                  <input 
                    type="text" 
                    value={logoUrl} 
                    onChange={e => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Company Description</label>
                  <textarea 
                    value={productSummary} 
                    onChange={e => setProductSummary(e.target.value)}
                    rows={4}
                    placeholder="Describe your business and target audience..."
                    className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[#CA9C68]/20">
                <button 
                  onClick={handleSaveProfile} 
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#CA9C68] hover:bg-[#B88029] text-black rounded-md text-xs font-bold uppercase flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save size={16} /> {isSaving ? "Saving..." : "Save Profile & Company"}
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Security & Danger Zone */}
          <div className="space-y-8">
            <section className="bg-[#162127] border border-[#CA9C68]/30 rounded-xl p-6 space-y-6 shadow-xl">
              <h2 className="text-sm font-bold text-[#F8FAFC] uppercase tracking-wider border-b border-[#CA9C68]/20 pb-2">Security</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#CA9C68] uppercase tracking-wider block mb-1">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-[#0C1519] border border-[#CA9C68]/20 rounded-md px-3 py-2 text-sm text-[#F8FAFC] outline-none focus:border-[#CA9C68] transition-colors"
                  />
                </div>
                
                <button 
                  onClick={handleUpdatePassword} 
                  disabled={isPasswordSaving}
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-[#CA9C68]/20 hover:bg-[#CA9C68]/40 text-[#CA9C68] rounded-md text-xs font-bold uppercase transition-colors disabled:opacity-50"
                >
                  {isPasswordSaving ? "Updating..." : "Update Password"}
                </button>
              </div>
            </section>

            <section className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 space-y-4 shadow-xl">
              <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider border-b border-red-500/20 pb-2 flex items-center gap-2">
                Danger Zone
              </h2>
              <p className="text-xs text-red-400">
                Permanently delete your organization, target profiles, and all harvested signals. This action cannot be undone.
              </p>
              
              <button 
                onClick={handleDeleteAccount}
                className="w-full flex justify-center items-center gap-2 bg-red-500/20 hover:bg-red-600/90 text-red-500 hover:text-white border border-red-500/30 rounded-md px-4 py-3 text-xs font-bold uppercase transition-all"
              >
                <Trash2 size={16} /> Delete Account Permanently
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
