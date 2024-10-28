import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-purple-100 to white">
          {children}
        </main>
        {/* Footer  */}
        <footer className="bg-purple-300 py-12">
          <div className="container mx-auto px-4 text-center">
            Made with 🖤 by Sai Jami
          </div>
        </footer>
      </body>
    </html>
  );
}
