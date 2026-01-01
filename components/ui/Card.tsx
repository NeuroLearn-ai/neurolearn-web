export function Card({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`rounded-xl bg-card border border-border p-6 shadow-xl backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}