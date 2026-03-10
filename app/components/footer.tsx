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
          variant={hasSelectedDice ? "ghost" : "outline"}
          onClick={onAdvantage}
          disabled={!hasSelectedDice}
          className={`flex flex-col items-center rounded-2xl h-full w-full text-[10px] font-light uppercase tracking-wide text-muted-foreground ${hasSelectedDice ? "shadow-[0_0px_10px_0px] shadow-advantage/20 text-advantage border-advantage/50" : "text-background-foreground border-border"}`}
        >
          <ArrowUp />
          Vantagem
        </Button>
        <Button
          onClick={onRoll}
          variant={hasSelectedDice ? "default" : "outline"}
          className={`col-span-2 min-h-18 rounded-2xl text-2xl uppercase tracking-widest  ${hasSelectedDice ? "shadow-[0_0px_10px_0px] shadow-primary text-primary-foreground font-bold" : "text-primary"}`}
        >
          <ZapIcon className="size-5" />
          Rolar
        </Button>
        <Button
          variant={hasSelectedDice ? "ghost" : "outline"}
          onClick={onDisadvantage}
          disabled={!hasSelectedDice}
          className={`flex flex-col items-center rounded-2xl h-full w-full text-[10px] font-light uppercase tracking-wide text-muted-foreground ${hasSelectedDice ? "shadow-[0_0px_10px_0px] shadow-disadvantage/20 text-disadvantage border-disadvantage/50" : "text-background-foreground border-border"}`}
        >
          <ArrowDown />
          Desvantagem
        </Button>
      </div>
    </div>
  );
}
