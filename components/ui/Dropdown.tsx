"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";

interface DropdownProps {
  trigger: ReactNode;      // The button/text you click to open it
  children: ReactNode;     // The menu items inside
  align?: "left" | "right";
}

export function Dropdown({ trigger, children, align = "right" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute top-full mt-2 w-48 rounded-xl border border-border bg-card p-1 shadow-xl shadow-black/50 transition-all animate-in fade-in zoom-in-95 z-50 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="flex flex-col gap-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for items inside the dropdown
export function DropdownItem({ href, onClick, children, danger }: { href?: string, onClick?: () => void, children: ReactNode, danger?: boolean }) {
  const baseClass = `px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
    danger 
      ? "text-red-400 hover:bg-red-500/10" 
      : "text-text-main hover:bg-primary/10 hover:text-primary"
  }`;

  if (href) {
    return <Link href={href} className={baseClass}>{children}</Link>;
  }
  return <div onClick={onClick} className={baseClass}>{children}</div>;
}