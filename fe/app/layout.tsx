import "./globals.css";
import { Inter } from "next/font/google";
import { Navbar } from "./components/Navbar";
import { ToastInitializer } from "./components/ToastInitializer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Online Bookstore",
  description: "Your one-stop shop for all books",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.className} flex flex-col h-full overflow-hidden`}>
        <ToastInitializer />
        <Toaster />
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <main className="container mx-auto p-4 h-full overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
