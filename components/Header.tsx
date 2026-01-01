"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, User, LogOut, Settings, Plus, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/Switch";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const isDarkMode = theme === "dark";

  const toggleTheme = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userLoggedIn = !!token;

    if (isLoggedIn !== userLoggedIn) {
      setIsLoggedIn(userLoggedIn);
    }
    
    // We explicitly ignore 'isLoggedIn' dependency to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
    router.refresh();
  }

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-header/95 backdrop-blur-md text-text-header transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LEFT: Logo (Static - Always shows) */}
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

        {/* RIGHT: Actions (Dynamic) */}
        <div className="flex items-center gap-4">

          {/* THEME SWITCHER UI */}
          <div className="flex items-center gap-2">
            {/* Sun Icon (Decorational) */}
            <Sun size={16} className={`transition-colors ${isDarkMode ? "text-text-muted" : "text-primary"}`} />
            
            {/* The Generic Switch */}
            <Switch 
              checked={isDarkMode} 
              onCheckedChange={toggleTheme} 
            />
            
            {/* Moon Icon (Decorational) */}
            <Moon size={16} className={`transition-colors ${isDarkMode ? "text-primary" : "text-text-muted"}`} />
          </div>
          
          {/* 4. SKELETON STATE: Show this while checking localStorage */}
          {!isMounted ? (
            <div className="flex items-center gap-4 animate-pulse">
              {/* Fake Button */}
              <div className="h-9 w-24 rounded-lg bg-card border border-border" />
              {/* Fake Avatar */}
              <div className="h-8 w-16 rounded-full bg-card border border-border" />
            </div>
          ) : isLoggedIn ? (
            // --- LOGGED IN VIEW ---
            <>
              <Link href="/dashboard/new">
                <Button variant="primary" className="hidden sm:flex h-9 px-4 text-sm" icon={<Plus size={16} />}>
                  New Note
                </Button>
              </Link>

              <button className="relative rounded-full p-2 text-text-muted hover:bg-card hover:text-primary transition">
                <Bell size={20} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </button>

              <Dropdown 
                align="right"
                trigger={
                  <div className="flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 hover:border-primary/50 transition cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                      ME
                    </div>
                    <ChevronDown size={14} className="text-text-muted" />
                  </div>
                }
              >
                <div className="px-3 py-2 text-xs text-text-muted border-b border-border/50 mb-1">
                  My Account
                </div>
                <DropdownItem href="/dashboard/profile">
                  <User size={14} /> Profile
                </DropdownItem>
                <DropdownItem href="/dashboard/settings">
                  <Settings size={14} /> Settings
                </DropdownItem>
                <div className="h-px bg-border/50 my-1" />
                <DropdownItem onClick={handleLogout} danger>
                  <LogOut size={14} /> Logout
                </DropdownItem>
              </Dropdown>
            </>
          ) : (
            // --- LOGGED OUT VIEW ---
            <>
              <Link href="/login" className="text-sm font-medium text-text-muted hover:text-text-main transition">
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