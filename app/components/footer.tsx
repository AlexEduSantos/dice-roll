import { ArrowDown, ArrowUp, ZapIcon } from "lucide-react";
import { Button } from "./ui/button";

interface FooterProps {
  onRoll: () => void;
  onAdvantage?: () => void;
  onDisadvantage?: () => void;
  hasSelectedDice: boolean;
}

export default function Footer({
  onRoll,
  onAdvantage,
  onDisadvantage,
  hasSelectedDice,
}: FooterProps) {
  return (
    <div className="w-full min-h-14 h-fit p-3 flex items-center bg-background shadow-[0_-5px_20px_10px] shadow-background border-t-2 border-secondary fixed bottom-0">
      <div className="grid grid-cols-4 gap-3 items-center h-full w-full justify-between">
        <Button
          variant="ghost"
          onClick={onAdvantage}
          className="flex flex-col items-center border-advantage/50 h-full w-full text-[10px] font-light uppercase tracking-wide text-muted-foreground"
        >
          <ArrowUp className="text-advantage" />
          Vantagem
        </Button>
        <Button
          onClick={onRoll}
          variant={hasSelectedDice ? "default" : "outline"}
          className={`col-span-2 min-h-18 rounded-2xl relative  text-2xl uppercase tracking-widest font-semibold ${hasSelectedDice ? "shadow-[0_0px_10px_0px] shadow-primary text-primary-foreground" : "text-primary"}`}
        >
          <ZapIcon className="size-5" />
          Rolar
        </Button>
        <Button
          variant="ghost"
          onClick={onDisadvantage}
          className="flex flex-col items-center border-disadvantage/50 h-full w-full text-[10px] font-light uppercase tracking-wide text-muted-foreground"
        >
          <ArrowDown className="text-disadvantage" />
          Desvantagem
        </Button>
      </div>
    </div>
  );
}
