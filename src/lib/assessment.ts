import { roles } from "@/lib/arc-data";

export type Answer = { label: string; role: string };
export type Question = { prompt: string; answers: Answer[] };

export const questions: Question[] = [
  {
    prompt: "A new network opens with no rules yet. What do you do first?",
    answers: [
      { label: "Set up the exchange so value can move", role: "Merchant" },
      { label: "Draw the plan the network will grow into", role: "Architect" },
      { label: "Start building the first structure by hand", role: "Builder" },
      { label: "Go find out what lies past the edge", role: "Traveler" },
    ],
  },
  {
    prompt: "Something breaks under pressure. Your instinct is to…",
    answers: [
      { label: "Shield the people affected first", role: "Guardian" },
      { label: "Redesign the system so it cannot break again", role: "Architect" },
      { label: "Repair it now, improve it later", role: "Builder" },
      { label: "Ask what this failure predicts next", role: "Visionary" },
    ],
  },
  {
    prompt: "You are handed a scarce resource. You…",
    answers: [
      { label: "Move it to where it is worth the most", role: "Trader" },
      { label: "Distribute it across the community", role: "Merchant" },
      { label: "Turn it into something people remember", role: "Creator" },
      { label: "Hold it for the moment that matters", role: "Visionary" },
    ],
  },
  {
    prompt: "What do people come to you for?",
    answers: [
      { label: "A story worth repeating", role: "Creator" },
      { label: "A deal that works for both sides", role: "Trader" },
      { label: "Safety when things get loud", role: "Guardian" },
      { label: "A route nobody else knows", role: "Traveler" },
    ],
  },
  {
    prompt: "Your idea of progress is…",
    answers: [
      { label: "Something standing that was not there before", role: "Builder" },
      { label: "A culture that shifted", role: "Creator" },
      { label: "A market that finally makes sense", role: "Merchant" },
      { label: "A future arriving earlier than expected", role: "Visionary" },
    ],
  },
  {
    prompt: "Ten years from now, your mark on ARC is…",
    answers: [
      { label: "The systems everyone quietly relies on", role: "Architect" },
      { label: "The trades that funded the whole thing", role: "Trader" },
      { label: "The people who were never left behind", role: "Guardian" },
      { label: "The places you opened up for everyone else", role: "Traveler" },
    ],
  },
];

export function resolveRole(picks: string[]) {
  const tally = new Map<string, number>();
  picks.forEach((p, i) => tally.set(p, (tally.get(p) ?? 0) + (i === 0 ? 1.5 : 1)));
  let best = picks[0] ?? "Creator";
  let bestScore = -1;
  for (const [name, score] of tally) {
    if (score > bestScore) {
      best = name;
      bestScore = score;
    }
  }
  return roles.find((r) => r.name === best) ?? roles[5]!;
}
