import SwapInterface from "@/components/swap-interface";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "WOWOSwap",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <Navbar />
      <SwapInterface />
    </main>
  );
}
