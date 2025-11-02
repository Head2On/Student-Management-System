"use client";

import { Domine } from "next/font/google";
import "./globals.css";
import Navbar from "../../components/navbar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";

const domine = Domine({ subsets: ["latin"] });


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where Navbar should be hidden
  const noNavbarRoutes = ["/login","/"];

  const shouldShowNavbar = !noNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body className={domine.className}>
          <AuthProvider>
            <div className="flex h-screen">
              {shouldShowNavbar && <Navbar />}
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </AuthProvider>
      </body>
    </html>
  );
}
