"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, User, LogOut, Settings, Plus, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/Switch";
import { useAuth } from "@/context/AuthContext"; // Import context

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  // 1. Get everything from AuthContext
  const { user, logout } = useAuth(); 
  
  // 2. Simple Boolean for UI checks
  const isLoggedIn = !!user;

  // 3. Hydration Fix (Prevent "Text content does not match" error)
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const isDarkMode = theme === "dark";

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  }

  // Don't show header on login page
  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-header/95 backdrop-blur-md text-text-header transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LEFT: Logo */}
        <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="relative h-15 w-15">
            <Image 
              src="/icon.png" 
              alt="NeuroLearn Logo"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text hidden sm:block">
            NeuroLearn
          </span>
        </Link>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4">

          {/* Theme Switcher (Only show after mount to avoid hydration mismatch) */}
          {isMounted && (
            <div className="flex items-center gap-2">
              <Sun size={16} className={`transition-colors ${isDarkMode ? "text-text-muted" : "text-primary"}`} />
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={toggleTheme} 
              />
              <Moon size={16} className={`transition-colors ${isDarkMode ? "text-primary" : "text-text-muted"}`} />
            </div>
          )}
          
          {/* Auth Buttons */}
          {!isMounted ? (
            // Skeleton Loader while checking auth
            <div className="flex items-center gap-4 animate-pulse">
              <div className="h-9 w-24 rounded-lg bg-white/10" />
              <div className="h-8 w-8 rounded-full bg-white/10" />
            </div>
          ) : isLoggedIn ? (
            // --- LOGGED IN VIEW ---
            <>
              <Link href="/dashboard/new">
                <Button variant="primary" className="hidden sm:flex h-9 px-4 text-sm" icon={<Plus size={16} />}>
                  New Note
                </Button>
              </Link>

              <button className="relative rounded-full p-2 text-text-muted hover:bg-white/10 hover:text-primary transition">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </button>

              <Dropdown 
                align="right"
                trigger={
                  <div className="flex items-center gap-2 rounded-full border border-border bg-white/5 pl-1 pr-3 py-1 hover:border-primary/50 transition cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                      {/* Show user initial if available, else 'ME' */}
                      {user?.email?.[0] || "ME"}
                    </div>
                    <ChevronDown size={14} className="text-text-muted" />
                  </div>
                }
              >
                <div className="px-3 py-2 text-xs text-text-muted border-b border-border/50 mb-1">
                  {user?.email}
                </div>
                <DropdownItem href="/profile">
                  <User size={14} /> Profile
                </DropdownItem>
                <DropdownItem href="/settings">
                  <Settings size={14} /> Settings
                </DropdownItem>
                <div className="h-px bg-border/50 my-1" />
                {/* 👇 Use the logout function from Context */}
                <DropdownItem onClick={logout} danger>
                  <LogOut size={14} /> Logout
                </DropdownItem>
              </Dropdown>
            </>
          ) : (
            // --- LOGGED OUT VIEW ---
            <>
              <Link href="/login" className="text-sm font-medium text-text-muted hover:text-text-header transition">
                Sign In
              </Link>
              <Link href="/login?mode=register">
                <Button variant="primary" className="h-9 px-4 text-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
}