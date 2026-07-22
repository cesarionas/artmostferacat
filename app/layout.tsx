import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
export const metadata: Metadata = { title: { default: "Artmosfera", template: "%s | Artmosfera" }, description: "Catálogo digital de produtos", openGraph: { type: "website", title: "Artmosfera" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR" suppressHydrationWarning><body><main>{children}</main><Toaster richColors position="top-right" /></body></html>; }
