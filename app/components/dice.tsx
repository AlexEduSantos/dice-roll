"use client";
import Image from "next/image";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Dice } from "../hooks/use-dice-roll";

interface DiceItemProps {
  dice: Dice;
  quantity: number;
  selected: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggle: () => void;
}

export default function DiceItem({
  dice,
  quantity,
  selected,
  onIncrement,
  onDecrement,
  onToggle,
}: DiceItemProps) {
  return (
    <Card
      className={`w-full md:min-w-28 min-h-40 flex items-center justify-center gap-4 p-3 ${
        selected ? `ring-1 shadow-[0_0_8px_1px]` : "hover:ring-1 shadow-none"
      }`}
      style={{
        ["--tw-ring-color" as any]: `var(--${dice.name})`,
        ["--tw-shadow-color" as any]: `var(--${dice.name})`,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggle();
        }}
        className="p-2 rounded-full"
      >
        <div className="relative overflow-visible aspect-square h-14">
          <Image
            src={dice.image}
            alt={dice.name}
            fill
            sizes=""
            priority
            className="object-contain cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onIncrement();
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            aria-label={`Diminuir ${dice.name}`}
            onClick={onDecrement}
            variant="outline"
            className="text-muted-foreground"
            size="sm"
          >
            -
          </Button>
          <div
            className="text-sm font-bold min-w-12 capitalize flex items-center justify-center"
            style={{ color: `var(--${dice.name})` }}
          >
            {quantity > 0 && <span>{quantity}</span>}
            <span className="capitalize">{dice.name}</span>
          </div>
          <Button
            aria-label={`Aumentar ${dice.name}`}
            onClick={onIncrement}
            variant="outline"
            className="text-muted-foreground"
            size="sm"
          >
            +
          </Button>
        </div>
      </div>
    </Card>
  );
}
