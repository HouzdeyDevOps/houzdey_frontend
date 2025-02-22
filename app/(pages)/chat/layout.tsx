import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages - Houzdey",
  description: "Chat with property owners and interested buyers",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
}
