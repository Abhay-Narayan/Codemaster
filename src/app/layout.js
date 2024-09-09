import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading
} from '@clerk/nextjs'
import { dark } from "@clerk/themes";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Code Master",
  description: "A comprehensive code editor",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
    <html lang="en">
      <body className={montserrat.className}>
        <ClerkLoading>
          <div className="flex items-center justify-center h-screen text-2xl">
            Loading...
          </div>
        </ClerkLoading>
        <ClerkLoaded>
        <Navbar/>
        {children}
        </ClerkLoaded>
      </body>
    </html>
    </ClerkProvider>
  );
}
