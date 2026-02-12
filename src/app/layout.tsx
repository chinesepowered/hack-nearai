import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNDOX — Private AI for things you'd never ask ChatGPT",
  description:
    "Ask AI anything without doxxing yourself. Powered by NEAR AI private inference with verified confidentiality. Your prompts never leave the TEE.",
  openGraph: {
    title: "UNDOX — Ask AI anything without doxxing yourself",
    description:
      "Private AI powered by NEAR AI's verified confidential inference. Crypto wallets, health, finances, personal — all private by default.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
