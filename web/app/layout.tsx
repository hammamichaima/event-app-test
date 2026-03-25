import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "EventManager",
  description: "Gestion professionnelle des événements",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-gray-900 antialiased">
        <nav className="bg-blue-700 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
          <span className="text-white font-bold text-lg tracking-tight">EventManager</span>
          <span className="text-blue-200 text-xs font-medium uppercase tracking-widest hidden sm:block">Tableau de bord</span>
        </nav>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
