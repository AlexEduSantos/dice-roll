// components/dices-list.tsx
"use client";
import { useState } from "react";
import { useDiceRoll } from "@/app/hooks/use-dice-roll";
import Header from "./header";
import Footer from "./footer";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  EraserIcon,
  ListRestartIcon,
  TextAlignJustifyIcon,
} from "lucide-react";
import { ResultModal } from "./result-model";
import DiceItem from "./dice";
import HistoryItem from "./result";

export default function DicesList() {
  const {
    dices,
    quantities,
    bonus,
    history,
    hasSelectedDice,
    increment,
    decrement,
    toggle,
    handleRoll,
    handleClear,
    clearHistory,
    setBonus,
    lastRoll, // último resultado (normal ou com vantagem)
  } = useDiceRoll();

  const [modalOpen, setModalOpen] = useState(false);

  // Função para rolagem normal
  const onRollNormal = () => {
    if (!hasSelectedDice) return;
    handleRoll("normal");
    setModalOpen(true);
  };

  // Função para vantagem
  const onAdvantage = () => {
    if (!hasSelectedDice) return;
    handleRoll("advantage");
    setModalOpen(true);
  };

  // Função para desvantagem
  const onDisadvantage = () => {
    if (!hasSelectedDice) return;
    handleRoll("disadvantage");
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4 w-full relative">
        <Header />
        <div className="px-4 flex flex-col gap-4">
          {/* Dados */}
          <div className="w-full md:flex grid grid-cols-2 gap-4">
            {dices.map((d) => (
              <div key={d.id}>
                <DiceItem
                  dice={d}
                  quantity={quantities[d.id] || 0}
                  selected={(quantities[d.id] || 0) > 0}
                  onIncrement={() => increment(d.id)}
                  onDecrement={() => decrement(d.id)}
                  onToggle={() => toggle(d.id)}
                />
              </div>
            ))}
          </div>

          {/* Bônus */}
          <div className="flex flex-col bg-card border rounded-lg p-4 w-full items-center md:gap-3 gap-2">
            <Label className="font-semibold text-md tracking-widest text-muted-foreground uppercase">
              Bônus
            </Label>
            <div className="w-full flex gap-2 items-center">
              <Button
                onClick={() => setBonus((b) => b - 1)}
                variant="ghost"
                className="aspect-square border border-border min-h-14 text-primary text-4xl font-light shadow-[0_5px_8px_1px] shadow-background/50"
              >
                -
              </Button>
              <h2 className="w-full text-center tracking-widest text-4xl">
                {bonus > 0 ? "+" : ""}
                {bonus || 0}
              </h2>
              <Button
                onClick={() => setBonus((b) => b + 1)}
                variant="ghost"
                className="aspect-square border border-border min-h-14 text-primary text-4xl font-light shadow-[0_5px_8px_1px] shadow-background/50"
              >
                +
              </Button>
            </div>
          </div>

          {/* Botões de limpeza */}
          <div className="w-full grid grid-cols-2 gap-4">
            <Button
              onClick={handleClear}
              variant="ghost"
              className="border border-border min-h-10 w-full shadow-[0_5px_8px_1px] shadow-background/50 text-muted-foreground"
            >
              <EraserIcon className="stroke-1 size-5" />
              Limpar Seleção
            </Button>
            <Button
              onClick={clearHistory}
              variant="ghost"
              className="border border-border min-h-10 w-full shadow-[0_5px_8px_1px] shadow-background/50 text-muted-foreground"
            >
              <ListRestartIcon className="stroke-1 size-5" />
              Limpar Histórico
            </Button>
          </div>

          {/* Histórico (mantido como estava) */}
          <div
            className={`h-fit mb-16 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary-foreground scrollbar-track-accent px-2 ${
              history.length <= 3 &&
              "scrollbar-thumb-transparent scrollbar-track-transparent"
            }`}
          >
            <div className="md:mt-6 mb-12">
              <div className="flex gap-2 items-center mb-3">
                <TextAlignJustifyIcon className="size-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  Histórico de Resultados
                </h3>
              </div>
              <div className="space-y-3">
                {history.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Nenhum resultado
                  </div>
                )}
                {history.map((h, idx) => (
                  <HistoryItem key={h.id} h={h} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer com as ações */}
        <Footer
          onRoll={onRollNormal}
          onAdvantage={onAdvantage}
          onDisadvantage={onDisadvantage}
          hasSelectedDice={hasSelectedDice}
        />
      </div>

      {/* Modal de resultados */}
      <ResultModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        result={lastRoll}
      />
    </>
  );
}
