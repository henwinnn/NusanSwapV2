import Navbar from "@/components/navbar";
import PoolCreationInterface from "@/components/pool-components/pool-creation-interface";

export default function CreatePoolPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-black p-4">
      <Navbar />
      <PoolCreationInterface />
    </main>
  );
}
