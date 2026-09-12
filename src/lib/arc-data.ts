export type Role = {
  id: string;
  name: string;
  desc: string;
  ability: string;
  color: string;
  image: string;
  fullCard?: boolean;
};

export const roles: Role[] = [
  {
    id: "0001",
    name: "Merchant",
    desc: "Connects communities through commerce.",
    ability: "Trade resources.",
    color: "#D4AF37",
    image: "/assets/nft-merchant.png",
  },
  {
    id: "0002",
    name: "Builder",
    desc: "Turns ideas into infrastructure.",
    ability: "Construct infrastructure.",
    color: "#2563EB",
    image: "/assets/nft-builder.png",
  },
  {
    id: "0003",
    name: "Traveler",
    desc: "Bridges people, cultures and currencies.",
    ability: "Discover territories.",
    color: "#9333EA",
    image: "/assets/nft-traveler.png",
  },
  {
    id: "0004",
    name: "Trader",
    desc: "Finds opportunity in motion.",
    ability: "Influence markets.",
    color: "#DC2626",
    image: "/assets/nft-trader.png",
  },
  {
    id: "0005",
    name: "Architect",
    desc: "Builds systems that last.",
    ability: "Design systems.",
    color: "#B45309",
    image: "/assets/nft-architect.png",
  },
  {
    id: "0006",
    name: "Creator",
    desc: "Brings stories to the chain.",
    ability: "Generate cultural influence.",
    color: "#7C3AED",
    image: "/assets/nft-creator.png",
  },
  {
    id: "0007",
    name: "Guardian",
    desc: "Secures people, value and freedom.",
    ability: "Protect citizens.",
    color: "#1E3A8A",
    image: "/assets/nft-guardian.png",
  },
  {
    id: "0008",
    name: "Visionary",
    desc: "Sees beyond the horizon.",
    ability: "Predict future events.",
    color: "#EA580C",
    image: "/assets/nft-visionary.png",
  },
];

export type Mission = {
  no: string;
  name: string;
  desc: string;
  roles: string[];
  reward?: string;
};

export const missions: Mission[] = [
  {
    no: "001",
    name: "The Blackout",
    desc: "A major city has lost its energy network.",
    roles: ["Builder", "Guardian", "Visionary"],
    reward: "Reputation +450 · Grid Access",
  },
  {
    no: "002",
    name: "Open Passage",
    desc: "Reconnect a divided territory through safe transit and trade.",
    roles: ["Traveler", "Merchant", "Guardian", "Architect", "Trader"],
    reward: "Trade Clearance · +380 XP",
  },
  {
    no: "003",
    name: "The Living Archive",
    desc: "Preserve a city's memory before its records disappear.",
    roles: ["Creator", "Architect", "Trader", "Visionary"],
    reward: "Civic Honor · Vault Clearance",
  },
];
