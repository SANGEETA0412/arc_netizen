import { useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Role } from "@/lib/arc-data";

type Choice = { title: string; detail: string; strength: string; score: number };
const choices: Choice[] = [
  {
    title: "Repair the grid",
    detail: "Restore the primary power route before nightfall.",
    strength: "Builder / Architect",
    score: 18,
  },
  {
    title: "Redirect energy",
    detail: "Keep hospitals and transit online with a controlled reroute.",
    strength: "Trader / Visionary",
    score: 12,
  },
  {
    title: "Ask another Netizen for help",
    detail: "Bring a second ability into the decision record.",
    strength: "All roles",
    score: 9,
  },
];

export function ArcGame({ role }: { role: Role }) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [stability, setStability] = useState(61);
  const [reputation, setReputation] = useState(8420);

  const choose = (index: number) => {
    setSelectedChoice(index);
    const strongest = choices[index]?.strength.includes(role.name) ?? false;
    setStability((value) => Math.min(99, value + (strongest ? 8 : 3)));
    setReputation((value) => value + (strongest ? 180 : 80));
  };

  return (
    <div className="border border-primary-foreground/25 p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary-foreground/20 pb-5">
        <span className="technical-label">City Zero / Command</span>
        <span className="technical-label">Day 07 / Decision 09-A</span>
      </div>
      <div className="mt-7 grid gap-8 md:grid-cols-[1fr_1.15fr]">
        <div>
          <p className="technical-label text-primary-foreground/50">City status</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {[
              ["Stability", stability],
              ["Energy", 34],
              ["Security", 72],
              ["Economy", 48],
              ["Culture", 83],
            ].map(([name, value]) => (
              <div key={name} className="border border-primary-foreground/20 p-3">
                <span className="technical-label text-primary-foreground/50">{name}</span>
                <p className="mt-2 text-2xl font-medium">{value}%</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between border-t border-primary-foreground/20 pt-5 technical-label">
            <span className="text-primary-foreground/50">Selected Netizen</span>
            <span>{role.name}</span>
          </div>
          <div className="mt-3 flex justify-between technical-label">
            <span className="text-primary-foreground/50">Reputation</span>
            <span>{reputation.toLocaleString()}</span>
          </div>
        </div>
        <div className="border-primary-foreground/20 md:border-l md:pl-8">
          <span className="technical-label text-primary-foreground/50">Crisis detected</span>
          <h3 className="mt-4 text-3xl font-medium uppercase">The power grid is collapsing.</h3>
          <p className="mt-4 text-sm leading-6 text-primary-foreground/60">
            Your selected role changes which decision carries the most weight.
          </p>
          <div className="mt-7 space-y-2">
            {choices.map((choice, index) => {
              const strongest = choice.strength.includes(role.name);
              return (
                <Button
                  key={choice.title}
                  type="button"
                  variant="registryOutline"
                  onClick={() => choose(index)}
                  className={`h-auto w-full justify-between border-primary-foreground/30 px-4 py-4 text-left text-primary-foreground hover:border-primary-foreground ${selectedChoice === index ? "border-primary-foreground bg-primary-foreground/10" : ""}`}
                >
                  <span>
                    <span className="block text-sm font-semibold uppercase tracking-normal">
                      {choice.title}
                    </span>
                    <span className="mt-1 block text-[11px] normal-case tracking-normal text-primary-foreground/50">
                      {choice.detail}
                    </span>
                  </span>
                  <span className="ml-3 shrink-0 text-right font-mono text-[9px] uppercase tracking-wider">
                    {strongest ? `+${choice.score + 8} strong` : `+${choice.score}`}
                  </span>
                </Button>
              );
            })}
          </div>
          {selectedChoice !== null && (
            <p className="mt-5 technical-label text-primary-foreground/60">
              Decision recorded · City stability updated · +{choices[selectedChoice]?.score ?? 0}{" "}
              civic weight
            </p>
          )}
        </div>
      </div>
      {selectedChoice !== null && (
        <Button
          variant="registryOutline"
          onClick={() => {
            setSelectedChoice(null);
            setStability(61);
          }}
          className="mt-8 border-primary-foreground/40 text-primary-foreground hover:border-primary-foreground"
        >
          <RotateCcw /> Review crisis
        </Button>
      )}
      {selectedChoice === null && (
        <p className="mt-8 technical-label text-primary-foreground/50">
          <ArrowUpRight className="mr-2 inline-block size-3" />
          Choose a response to move the city forward.
        </p>
      )}
    </div>
  );
}
