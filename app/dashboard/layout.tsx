import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      {/* Sidebar - Hidden on Mobile (md:block) */}
      <aside className="hidden w-64 border-r border-[var(--border)] bg-[var(--bg-card)] p-6 md:block">
        <div className="mb-8 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          NeuroLearn
        </div>
        <nav className="space-y-2">
          {/* Example Nav Items */}
          {[{name:'Notes', href:'/notes'}, {name:'Graph View', href:'/graph'}, {name:'Settings', href:'/settings'}].map((item) => (
            <Link
              key = {item.name}
              href = {item.href}
              className="block rounded-lg px-4 py-2 text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-white transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden mb-6 flex justify-between items-center">
          <span className="font-bold text-xl">NeuroLearn</span>
          <button className="text-[var(--text-muted)]">Menu</button>
        </div>
        
        {children}
      </main>
    </div>
  );
}