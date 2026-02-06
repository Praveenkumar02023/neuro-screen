import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Caveat } from "next/font/google"; // Added Mono font for technical data
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
    title: "NeuroScreen AI",
    description: "Advanced Neurological Diagnostic System",
};

import { Providers } from "./providers";

import { Footer } from "@/components/Footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${jetbrains.variable} ${caveat.variable} font-sans`}>
                <Providers>
                    {children}
                    <Footer />
                </Providers>
            </body>
        </html>
    );
}
