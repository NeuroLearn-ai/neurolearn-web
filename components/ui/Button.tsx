import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger";
  isLoading?: boolean;
  icon?: ReactNode;
}

export function Button({ 
  children, 
  variant = "primary", 
  isLoading, 
  icon,
  className = "",
  ...props 
}: ButtonProps) {
  
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Look how clean this is now! No more "var(--)"
    primary: "bg-primary text-white hover:bg-primary-hover shadow-lg hover:shadow-blue-500/20",
    outline: "border border-border bg-transparent hover:bg-card text-text-main",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      ) : (
        <>
          {icon && <span className="text-lg">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}