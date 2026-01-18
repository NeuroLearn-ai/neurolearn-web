"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"; 
import { Card } from "@/components/ui/Card";
import { User, Mail, Camera, X } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, authFetch, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
      setIsLoading(true);
      try {
        const res = await authFetch("/user/me", {
          method: "PUT",
          body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error("Failed to save");

        console.log("Saving data:", formData);
        
        setIsEditing(false);
        
        // 👇 Update the UI instantly with the new name
        await refreshUser(); 

      } catch (error) {
        console.error("Failed to update profile", error);
      } finally {
        setIsLoading(false);
      }
    };

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-4xl p-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main">My Profile</h1>
        <p className="text-text-muted mt-1">Manage your personal information and account settings.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-12">
        
        {/* LEFT COLUMN: Avatar Card */}
        <div className="md:col-span-4">
          <Card className="flex flex-col items-center p-6 text-center">
            <div className="relative mb-4 h-32 w-32">
              {/* Avatar Image */}
              <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-card shadow-lg">
                {user.avatar_url ? (
                  <Image 
                    src={user.avatar_url} 
                    alt="User Avatar" 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                    {user.email?.[0].toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Edit Photo Button (Visual Only for now) */}
              {isEditing && (
                <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-white hover:bg-primary/90 transition shadow-md">
                  <Camera size={16} />
                </button>
              )}
            </div>

            <h2 className="text-xl font-bold text-text-main">{user.name || "User"}</h2>
            <p className="text-sm text-text-muted">{user.provider === "google" ? "Google Account" : "Standard Account"}</p>
          </Card>
        </div>

        {/* RIGHT COLUMN: Details & Form */}
        <div className="md:col-span-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-main">Personal Details</h3>
              
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                    <X size={16} className="mr-2" /> Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
                     Save Changes
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Full Name</label>
                {isEditing ? (
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center gap-3 rounded-md border border-transparent bg-secondary/50 px-3 py-2 text-text-main">
                    <User size={18} className="text-text-muted" />
                    {user.name || <span className="text-text-muted italic">No name set</span>}
                  </div>
                )}
              </div>

              {/* Email Field (Read Only) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-muted">Email Address</label>
                <div className="flex items-center justify-between rounded-md border border-border bg-card/50 px-3 py-2 text-text-muted cursor-not-allowed">
                  <div className="flex items-center gap-3">
                    <Mail size={18} />
                    {user.email}
                  </div>
                  <span className="text-xs border border-border px-2 py-0.5 rounded bg-secondary">
                    Locked
                  </span>
                </div>
                <p className="text-xs text-text-muted">
                  Email cannot be changed.
                </p>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}