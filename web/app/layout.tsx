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
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="h-full bg-gray-50 text-gray-900 antialiased">
        <div className="flex h-full">
          <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="px-6 py-5 border-b border-gray-200">
              <span className="text-lg font-semibold tracking-tight text-gray-900">EventManager</span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              <a href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-900">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Événements
              </a>
            </nav>
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-400">v1.0.0</p>
            </div>
          </aside>
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
              <h1 className="text-sm font-medium text-gray-500">Tableau de bord</h1>
            </header>
            <main className="flex-1 overflow-y-auto px-8 py-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
