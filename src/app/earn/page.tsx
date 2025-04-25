import Navbar from "@/components/navbar";
import VaultInterface from "@/components/earn-components/vault-interface";

export default function EarnPage() {

    return(
        <main className="flex min-h-screen flex-col items-center justify-start bg-black p-4">
    <Navbar />
    <VaultInterface />
    </main>
    )
}