import Navbar from "@/components/navbar";
import PoolsInterface from "@/components/pool-components/pools-interface";

export default function PoolsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black p-4">
      <Navbar />
      <PoolsInterface />
    </main>
  );
}
