import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export interface Dice {
  id: number;
  name: string;
  faces: number;
  image: string;
  color: string;
}

export interface RollEntry {
  id: number;
  name: string;
  qty: number;
  faces: number;
  rolls: number[];
  subtotal: number;
}

export interface HistoryEntry {
  id: number;
  timestamp: string;
  items: RollEntry[];
  bonus: number;
  total: number;
  mode?: RollMode;
  first?: RollResult;
  second?: RollResult;
  kept?: RollResult;
  discarded?: RollResult;
}

export type RollMode = "normal" | "advantage" | "disadvantage";

export interface RollResult {
  entries: RollEntry[];
  bonus: number;
  total: number;
}

export interface AdvantageRollResult {
  first: RollResult;
  second: RollResult;
  kept: RollResult;
  discarded: RollResult;
  mode: "advantage" | "disadvantage";
}

const DICES: Dice[] = [
  { id: 1, name: "d4", faces: 4, image: "/d4.svg", color: "ed4248" },
  { id: 2, name: "d6", faces: 6, image: "/d6.svg", color: "f77226" },
  { id: 3, name: "d8", faces: 8, image: "/d8.svg", color: "4083f3" },
  { id: 4, name: "d10", faces: 10, image: "/d10.svg", color: "a757f4" },
  { id: 5, name: "d12", faces: 12, image: "/d12.svg", color: "fddd47" },
  { id: 6, name: "d20", faces: 20, image: "/d20.svg", color: "2cc562" },
  { id: 7, name: "d100", faces: 100, image: "/d100.svg", color: "69d3df" },
];

const STORAGE_KEY = "dice_roll_history_v1";

export function useDiceRoll() {
  const initialQuantities = useMemo(
    () => Object.fromEntries(DICES.map((d) => [d.id, 0])),
    [],
  );

  const [quantities, setQuantities] =
    useState<Record<number, number>>(initialQuantities);
  const [bonus, setBonus] = useState<number>(0);
  const [results, setResults] = useState<RollEntry[]>([]);
  const [grandTotal, setGrandTotal] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastRoll, setLastRoll] = useState<
    RollResult | AdvantageRollResult | null
  >(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      toast.error("Não foi possível carregar o histórico: " + e);
    }
  }, []);

  function increment(id: number) {
    setQuantities((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  }

  function decrement(id: number) {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }));
  }

  function toggle(id: number) {
    setQuantities((q) => ({ ...q, [id]: (q[id] || 0) > 0 ? 0 : 1 }));
  }

  // Função auxiliar para realizar uma rolagem com as quantidades e bônus atuais
  function performRoll(): RollResult {
    const entries: RollEntry[] = [];
    let total = 0;

    DICES.forEach((d) => {
      const qty = quantities[d.id] || 0;
      if (qty > 0) {
        const rolls: number[] = [];
        let subtotal = 0;
        for (let i = 0; i < qty; i++) {
          const r = Math.floor(Math.random() * d.faces) + 1;
          rolls.push(r);
          subtotal += r;
        }
        entries.push({
          id: d.id,
          name: d.name,
          qty,
          faces: d.faces,
          rolls,
          subtotal,
        });
        total += subtotal;
      }
    });

    total += Number(bonus || 0);
    return { entries, bonus, total };
  }

  function addToHistory(result: RollResult | AdvantageRollResult) {
    const timestamp = new Date().toISOString();
    let histEntry: HistoryEntry;

    if ("mode" in result) {
      // É um AdvantageRollResult
      histEntry = {
        id: Date.now(),
        timestamp,
        items: result.kept.entries, // Exibe as entradas mantidas como resultado principal
        bonus: result.kept.bonus,   // Exibe o bônus mantido como resultado principal
        total: result.kept.total,   // Exibe o total mantido como resultado principal
        mode: result.mode,
        first: result.first,
        second: result.second,
        kept: result.kept,
        discarded: result.discarded,
      };
    } else {
      // É um RollResult normal
      histEntry = {
        id: Date.now(),
        timestamp,
        items: result.entries,
        bonus: result.bonus,
        total: result.total,
        mode: "normal", // Define explicitamente o modo para rolagens normais
      };
    }
    const next = [histEntry, ...history];
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      toast.error("Não foi possível salvar o histórico: " + e);
    }
  }

  function handleRoll(mode: RollMode = "normal") {
    if (Object.values(quantities).every((q) => q === 0)) {
      toast.error("Selecione pelo menos um dado para rolar");
      return;
    }

    if (mode === "normal") {
      const result = performRoll();
      setResults(result.entries);
      setGrandTotal(result.total);
      setLastRoll(result);
      addToHistory(result);
    } else {
      // Vantagem ou desvantagem: rola duas vezes
      const first = performRoll();
      const second = performRoll();

      // Determina qual é mantido (maior para vantagem, menor para desvantagem)
      let kept: RollResult, discarded: RollResult;
      if (mode === "advantage") {
        if (first.total >= second.total) {
          kept = first;
          discarded = second;
        } else {
          kept = second;
          discarded = first;
        }
      } else {
        // disadvantage
        if (first.total <= second.total) {
          kept = first;
          discarded = second;
        } else {
          kept = second;
          discarded = first;
        }
      }

      const advantageResult: AdvantageRollResult = {
        first,
        second,
        kept,
        discarded,
        mode,
      };

      // Atualiza o estado de exibição imediata com o resultado mantido
      setResults(kept.entries);
      setGrandTotal(kept.total);
      setLastRoll(advantageResult);

      // Agora adicionamos rolagens com vantagem/desvantagem ao histórico
      addToHistory(advantageResult);
    }
  }

  function handleClear() {
    setQuantities(initialQuantities);
    setResults([]);
    setGrandTotal(null);
    setBonus(0);
    setLastRoll(null);
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      toast.success("Histórico limpo com sucesso");
    } catch (e) {
      toast.error("Não foi possível limpar o histórico: " + e);
    }
  }

  const hasSelectedDice = Object.values(quantities).some((q) => q > 0);

  return {
    dices: DICES,
    quantities,
    bonus,
    results,
    grandTotal,
    history,
    hasSelectedDice,
    lastRoll,
    increment,
    decrement,
    toggle,
    handleRoll,
    handleClear,
    clearHistory,
    setBonus,
  };
}
