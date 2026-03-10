import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <div className="w-full min-h-10 h-fit py-4 bg-card border-b-2 border-secondary flex items-center justify-between px-5">
      <div className="flex gap-2 items-center">
        <div className="relative h-12 w-14">
          <Image src="/logo.svg" alt="Logo" fill className="object-contain" />
        </div>
        <h2 className="text-3xl font-bold">Dice Roll</h2>
      </div>
      <ThemeToggle />
    </div>
  );
}
