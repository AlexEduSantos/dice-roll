import { format } from "date-fns";
import {
  RollEntry,
  RollResult,
  AdvantageRollResult,
} from "../hooks/use-dice-roll";
import { ClockIcon } from "lucide-react";
import React from "react";

interface History {
  id: number;
  timestamp: string;
  items: RollEntry[];
  bonus: number;
  total: number;
  mode?: "normal" | "advantage" | "disadvantage";
  first?: RollResult;
  second?: RollResult;
  kept?: RollResult;
  discarded?: RollResult;
}

const HistoryItem = ({ h }: { h: History }) => {
  const isSingleType = h.items.length === 1;
  let isCritical = false;
  let isFailure = false;

  if (isSingleType) {
    const item = h.items[0];
    const allOnes = item.rolls.every((r) => r === 1);
    const allMax = item.rolls.every((r) => r === item.faces);
    isCritical = allMax;
    isFailure = allOnes;
  }

  const borderColorClass = isSingleType
    ? isCritical
      ? "border-primary"
      : isFailure
        ? "border-accent"
        : ""
    : "";

  const isAdvantage = h.mode === "advantage" || h.mode === "disadvantage";

  const hasMultipleDicesOrQuantities =
    h.items.length > 1 || h.items.some((item) => item.qty > 1) || h.bonus !== 0;

  return (
    <div
      key={h.id}
      className={`p-3 border rounded-lg shadow-xl bg-surface/50 flex justify-between items-center border-r-6 relative ${borderColorClass}`}
    >
      <div className="flex flex-col gap-2 items-start justify-between">
        <div className="text-xs text-muted-foreground flex gap-1 items-center">
          <ClockIcon className="size-3" />
          {format(new Date(h.timestamp), "kk:mm")}
          {isAdvantage && (
            <p
              className={`ml-6 text-xs ${h.mode === "advantage" ? "text-advantage" : "text-disadvantage"}`}
            >
              {h.mode === "advantage" ? "Vantagem" : "Desvantagem"}
            </p>
          )}
        </div>

        {/* Lista de dados com separador "+" */}
        <div className="flex flex-wrap gap-1 items-center text-sm">
          {h.items.map((it, index) => (
            <div key={it.id}>
              <span style={{ color: `var(--${it.name})` }}>
                {it.qty > 1 && `${it.qty}`}
                <span className="uppercase">{it.name}</span>
              </span>
              {index < h.items.length - 1 && <span> + </span>}
            </div>
          ))}
          {h.bonus > 0 && (
            <>
              <span> + </span>
              <span className="capitalize text-muted-foreground">Bônus</span>
            </>
          )}
        </div>

        {/* Detalhamento dos valores (quando mais de um dado) */}
        {hasMultipleDicesOrQuantities && (
          <div className="text-xs">
            {h.items.map((it, i) => (
              <span key={i} style={{ color: `var(--${it.name})` }}>
                {it.rolls.join(" + ")}
                {i < h.items.length - 1 ? " + " : ""}
              </span>
            ))}
            {h.bonus > 0 && (
              <span className="text-muted-foreground"> + {h.bonus}</span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <p className="text-3xl font-bold text-muted-foreground">{h.total}</p>
        {isSingleType && (isCritical || isFailure) && (
          <p className={isCritical ? "text-primary" : "text-accent"}>
            {isCritical ? "Crítico" : "Falha"}
          </p>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;
