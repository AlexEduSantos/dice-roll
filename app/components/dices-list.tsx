"use client";
import DiceItem from "./dice";
import { useMemo, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const DicesList = () => {
  const dices = [
    { id: 1, name: "d4", faces: 4, image: "/d4.svg", color: "ed4248" },
    { id: 2, name: "d6", faces: 6, image: "/d6.svg", color: "f77226" },
    { id: 3, name: "d8", faces: 8, image: "/d8.svg", color: "4083f3" },
    { id: 4, name: "d10", faces: 10, image: "/d10.svg", color: "a757f4" },
    { id: 5, name: "d12", faces: 12, image: "/d12.svg", color: "fddd47" },
    { id: 6, name: "d20", faces: 20, image: "/d20.svg", color: "2cc562" },
    { id: 7, name: "d100", faces: 100, image: "/d100.svg", color: "69d3df" },
  ];

  const initialQuantities = useMemo(
    () => Object.fromEntries(dices.map((d) => [d.id, 0])),
    [dices]
  );
  const [quantities, setQuantities] =
    useState<Record<number, number>>(initialQuantities);
  const [bonus, setBonus] = useState<number>(0);
  const [results, setResults] = useState<any[]>([]);
  const [grandTotal, setGrandTotal] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const STORAGE_KEY = "dice_roll_history_v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.error("failed to load history", e);
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

  function handleRoll() {
    const entries: any[] = [];
    let total = 0;

    if (Object.values(quantities).every((q) => q === 0)) {
      return;
    }

    dices.forEach((d) => {
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
    setResults(entries);
    setGrandTotal(total);

    // build history entry
    const timestamp = new Date().toISOString();
    const histEntry = {
      id: Date.now(),
      timestamp,
      items: entries,
      bonus: Number(bonus || 0),
      total,
    };

    const next = [histEntry, ...history];
    setHistory(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("failed to save history", e);
    }
  }

  function handleClear() {
    setQuantities(initialQuantities);
    setResults([]);
    setGrandTotal(null);
    setBonus(0);
  }

  function clearHistory() {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("failed to clear history", e);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full md:flex grid grid-cols-2 gap-2">
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

      <div className="md:mt-4 md:flex grid grid-cols-3 w-fit items-center md:gap-3 gap-2">
        <Label className="font-medium text-2xl">Bônus</Label>
        <Input
          type="number"
          value={bonus}
          className="col-span-2 text-right"
          onChange={(e) => setBonus(Number(e.target.value))}
        />
        <Button onClick={handleRoll}>Rolar</Button>
        <Button
          onClick={handleClear}
          className="border-destructive-foreground bg-transparent border text-destructive-foreground"
        >
          Limpar Seleção
        </Button>
        <Button
          onClick={clearHistory}
          className="border-destructive-foreground bg-transparent border text-destructive-foreground"
        >
          Limpar Histórico
        </Button>
      </div>

      <div
        className={`md:mt-4 md:max-h-125 overflow-y-scroll scrollbar-thin scrollbar-thumb-primary-foreground scrollbar-track-accent px-2 ${
          history.length <= 3 &&
          "scrollbar-thumb-transparent scrollbar-track-transparent"
        } `}
      >
        <div className="md:mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Histórico de Resultados
          </h3>
          <div className="space-y-3">
            {history.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Nenhum resultado
              </div>
            )}

            {history.map((h, idx) => (
              <div key={h.id} className="p-3 border rounded bg-surface/50">
                <div className="flex items-start justify-between">
                  <div className="text-sm text-muted-foreground">
                    {new Date(h.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-primary text-primary-foreground">
                    #{history.length - idx}
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  <div className="flex flex-wrap gap-2 items-center">
                    {h.items.map((it: any) => (
                      <span
                        key={it.id}
                        className="text-lg rounded"
                        style={{ color: `var(--${it.name})` }}
                      >
                        {it.qty > 1 && `${it.qty}`}
                        <span className="capitalize">{it.name},</span>
                      </span>
                    ))}
                    {h.bonus > 0 && (
                      <span className="text-lg rounded">
                        <span className="capitalize text-muted-foreground">
                          Bônus,
                        </span>
                      </span>
                    )}
                    <span className="text-lg capitalize">
                      total
                    </span>
                  </div>

                  <div className="mt-2 font-mono text-lg">
                    {h.items.map((it: any, i: number) => (
                      <span
                        key={i}
                        className=""
                        style={{ color: `var(--${it.name})` }}
                      >
                        {it.rolls.join(" + ")}
                        {i < h.items.length - 1 ? " + " : ""}
                      </span>
                    ))}
                    {h.bonus > 0 && (
                      <span className="text-muted-foreground">
                        {" + "} 
                        {h.bonus}
                      </span>
                    )}
                    {" = "}<span className="font-bold "> {h.total}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DicesList;
