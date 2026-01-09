"use client";
import Image from "next/image";
import { Card } from "./ui/card";
import { MouseEvent } from "react";
import { Button } from "./ui/button";

interface Die {
  id: number;
  name: string;
  faces: number;
  image: string;
  color: string;
}

interface DiceItemProps {
  dice: Die;
  quantity: number;
  selected: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggle: () => void;
}

const DiceItem = ({
  dice,
  quantity,
  selected,
  onIncrement,
  onDecrement,
  onToggle,
}: DiceItemProps) => {
  const data = dice;

  function handleImageClick(e: MouseEvent) {
    e.stopPropagation();
    onIncrement();
  }

  return (
    <Card
      className={`w-full md:min-w-28 flex items-center justify-center gap-4 p-3 ${
        selected ? "ring-2" : "hover:ring-1"
      }`}
      style={{ ["--tw-ring-color" as any]: `var(--${data.name})` }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onToggle();
        }}
        className={`p-2 rounded-full `}
      >
        <div className="relative overflow-visible aspect-square h-14">
          <Image
            src={data.image}
            alt={data.name}
            fill
            sizes=""
            priority
            className="object-contain cursor-pointer"
            onClick={handleImageClick}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ">
        <div className="flex items-center gap-2">
          <Button
            aria-label={`Diminuir ${data.name}`}
            onClick={onDecrement}
            variant="outline"
            size="sm"
          >
            -
          </Button>
          <div
            className="text-sm font-bold min-w-12 capitalize flex items-center justify-center"
            style={{ color: `var(--${data.name})` }}
          >
            {quantity > 0 && <span>{quantity}</span>}

            <span className="capitalize">{data.name}</span>
          </div>
          <Button
            aria-label={`Aumentar ${data.name}`}
            onClick={onIncrement}
            variant="outline"
            size="sm"
          >
            +
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DiceItem;
