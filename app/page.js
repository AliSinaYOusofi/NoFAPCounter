import GlassmorphismNavbar from "@/components/Navbar";
import { NofapForm } from "@/components/NoFAPForm";
import UserProfile from "@/components/UserProfile";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <NofapForm />
    </main>
  );
}
