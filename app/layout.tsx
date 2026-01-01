import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "NeuroLearn",
  description: "Your AI Second Brain",
  // Have to update this after building the application accordingly.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <ThemeProvider>
            <Header />      
              <div className="flex-1">
                {children}
              </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}