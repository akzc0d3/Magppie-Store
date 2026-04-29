import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/NavBar";
import { Toaster } from "sonner";
import AuthModal from "@/components/auth/AuthModal";
import AppProvider from "@/components/layout/AppProvider";


const interSans = Inter({
    variable: "--font-inter-sans",
    subsets: ["latin"],
});

export const metadata = {
    title: "Magppie e-commerce frontend",
    description: "Magppie e-commerce frontend",
};

export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${interSans.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <AppProvider>
                    <Navbar />
                    {children}
                    <AuthModal />

                    <Toaster position="bottom-right" richColors />
                </AppProvider>
            </body>
        </html>
    );
}