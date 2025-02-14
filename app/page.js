import GlassmorphismNavbar from "@/components/Navbar";
import { NofapForm } from "@/components/NoFAPForm";
import UserProfile from "@/components/UserProfile";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex bg-gradient-to-b from-black via-gray-900 to-black min-h-screen flex-col items-center justify-center p-10">
      <NofapForm />
    </main>
  );
}
