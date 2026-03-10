// components/result-modal.tsx
"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { SparklesIcon, SkullIcon, Zap, ZapIcon, DicesIcon } from "lucide-react"; // ícones ilustrativos
import {
  RollResult,
  AdvantageRollResult,
  RollEntry,
} from "@/app/hooks/use-dice-roll";

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: RollResult | AdvantageRollResult | null;
}

export function ResultModal({ open, onOpenChange, result }: ResultModalProps) {
  if (!result) return null;

  const isAdvantage = "mode" in result; // verifica se é vantagem/desvantagem

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background/70 backdrop-blur-sm rounded-3xl border border-primary/50 shadow-[0_0px_30px_0px] shadow-primary/50 overflow-hidden ">
        <span className="absolute inset-0 bg-linear-to-tr from-primary/10 via-primary/5 to-transparent pointer-events-none" />
        <DialogTitle className="sr-only">Resultado da Rolagem</DialogTitle>

        {!isAdvantage && <NormalResult result={result as RollResult} />}
        {isAdvantage && (
          <AdvantageResult result={result as AdvantageRollResult} />
        )}

        <DialogClose
          onClick={() => onOpenChange(false)}
          className="flex justify-center w-full border rounded-lg p-4 bg-input/70"
        >
          FECHAR
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function NormalResult({ result }: { result: RollResult }) {
  const hasMultipleDicesOrQuantities =
    result.entries.length > 1 ||
    result.entries.some((item) => item.qty > 1) ||
    result.bonus !== 0;

  return (
    <div className="">
      <div className="py-4 text-center flex flex-col gap-4">
        {/* Opcional: mensagem de crítico/falha */}
        {result.entries.length === 1 && (
          <CriticalMessage entry={result.entries[0]} />
        )}
        <span className="p-5 rounded-full self-center bg-secondary flex items-center justify-center shadow-[0_0px_20px_5px] shadow-secondary mb-4">
          <DicesIcon className="size-10 text-primary stroke-1" />
        </span>
        <p className="text-sm uppercase font-bold tracking-widest text-primary">
          Resultado
        </p>
        <p className="text-8xl font-bold text-foreground">{result.total}</p>
      </div>

      {/* Lista de dados com separador "+" */}
      <div className="flex flex-wrap gap-1 items-center text-sm justify-center">
        {result.entries.map((it, index) => (
          <div key={it.id}>
            <span style={{ color: `var(--${it.name})` }}>
              {it.qty > 1 && `${it.qty}`}
              <span className="uppercase">{it.name}</span>
            </span>
            {index < result.entries.length - 1 && <span> + </span>}
          </div>
        ))}
        {result.bonus > 0 && (
          <>
            <span> + </span>
            <span className="capitalize text-muted-foreground">Bônus</span>
          </>
        )}
      </div>

      {/* Detalhamento dos valores (quando mais de um dado) */}
      {hasMultipleDicesOrQuantities && (
        <div className="text-sm flex gap-1 items-center justify-center">
          {result.entries.map((it, i) => (
            <span key={i} style={{ color: `var(--${it.name})` }}>
              {it.rolls.join(" + ")}
              {i < result.entries.length - 1 ? " + " : ""}
            </span>
          ))}
          {result.bonus > 0 && (
            <>
              <span className="text-muted-foreground"> + </span>
              <span className="text-muted-foreground">{result.bonus}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AdvantageResult({ result }: { result: AdvantageRollResult }) {
  const { kept, discarded, mode, first, second } = result;
  const isAdvantage = mode === "advantage";

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex justify-center gap-1 mt-2 text-xs">
          <span
            className={`px-4 py-1 rounded-full tracking-[3px] font-bold ${isAdvantage ? "text-background bg-advantage" : "text-white bg-disvantage"}`}
          >
            {isAdvantage ? "VANTAGEM" : "DESVANTAGEM"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 py-4 items-center justify-center">
        <span className="p-5 rounded-full self-center bg-secondary flex items-center justify-center shadow-[0_0px_20px_5px] shadow-secondary mb-4">
          <DicesIcon className="size-10 text-primary stroke-1" />
        </span>
        <div className="col-span-2 uppercase tracking-[4px] text-sm self-center text-center font-bold text-primary">
          Resultado
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-center flex flex-col items-center gap-2">
            <div
              className={`w-fit h-fit rounded-full p-8 bg-background/80 aspect-square relative ${isAdvantage ? "shadow-advantage/50 border-advantage border-4 shadow-[0_0px_10px_5px]" : "shadow-disvantage/50 border-disvantage border-4 shadow-[0_0px_10px_5px]"}`}
            >
              <p
                className={`text-4xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isAdvantage ? "text-advantage" : "text-disvantage"}`}
              >
                {kept.total}
              </p>
            </div>
            <p
              className={`text-xs  ${isAdvantage ? "text-advantage" : "text-disvantage"}`}
            >
              MANTIDO
            </p>
          </div>
          <div className="text-center flex flex-col items-center gap-2">
            <div
              className={`w-fit h-fit rounded-full p-8 bg-background/80 aspect-square relative border-muted-foreground border-2`}
            >
              <p
                className={`text-4xl font-bold text-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
              >
                {discarded.total}
              </p>
            </div>
            <p className={`text-xs  text-muted-foreground`}>DESCARTADO</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Total final ({kept.total} + {kept.bonus} )
        </p>
        <p className="text-3xl font-bold text-foreground">
          {kept.total + kept.bonus}
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Fórmula
        </p>
        <p className="text-lg tracking-[2px]">
          [{first.total}, {second.total}] + {kept.bonus}
        </p>
      </div>
    </div>
  );
}

// Mensagem de crítico/falha para um único dado
function CriticalMessage({ entry }: { entry: RollEntry }) {
  const allMax = entry.rolls.every((r) => r === entry.faces);
  const allMin = entry.rolls.every((r) => r === 1);
  if (allMax)
    return (
      <div className="px-4 py-1 tracking-[4px] rounded-full bg-primary self-center w-fit">
        <p className="text-center text-primary-foreground font-semibold text-xs">
          CRÍTICO
        </p>
      </div>
    );
  if (allMin)
    return (
      <div className="px-4 py-1 tracking-[4px] rounded-full bg-accent self-center w-fit">
        <p className="text-center text-accent-foreground font-bold">FALHA!</p>
      </div>
    );
  return null;
}
